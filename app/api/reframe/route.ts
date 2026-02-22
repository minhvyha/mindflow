import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })

type Category = "urgent" | "mental-load" | "emotional-weight" | "growth" | "let-go"

type ReframeResult = {
  originalThought: string
  compassionateReframe: string
  evidenceFor: string
  evidenceAgainst: string
  smallActionStep: string
  shortAffirmation: string
  title?: string
  derivedQuote?: string
  aiSummary?: string
  category?: Category
}

function safeString(input: any, fallback = "") {
  if (input === null || input === undefined) return fallback
  try {
    return String(input).trim()
  } catch {
    return fallback
  }
}

function localFallbackReframe(thought: string): ReframeResult {
  const truncated = thought.length > 180 ? thought.slice(0, 177) + "..." : thought
  return {
    originalThought: truncated,
    compassionateReframe:
      `I hear how heavy this feels. One kinder way to say it might be: "${truncated}" while also asking what else could be true.`,
    evidenceFor: "This thought is likely based on recent feelings or events that felt significant.",
    evidenceAgainst: "There are probably moments or facts that do not fully support the absolute version of this thought.",
    smallActionStep: "Spend 5 minutes writing one clear fact that contradicts the thought.",
    shortAffirmation: "I am learning and growing",
    title: truncated.split(/\s+/).slice(0, 6).join(" "),
    derivedQuote: truncated.slice(0, 60),
    aiSummary: truncated.split(".")[0],
    category: "growth",
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const thought = safeString(body?.thought ?? body?.text ?? "")
    const existingId = safeString(body?.id ?? "")

    if (!thought) {
      return NextResponse.json({ error: "No thought provided" }, { status: 400 })
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const prompt = `You are a compassionate mental health assistant. Today's date is ${today}.
User thought:
"""
${thought}
"""
Return a JSON object only, with these exact fields:
- originalThought: the original thought text
- compassionateReframe: a warm 1-2 sentence reframe that validates feelings and offers a kinder alternative perspective
- evidenceFor: one short sentence listing realistic evidence that might support the original thought
- evidenceAgainst: one short sentence listing realistic evidence that weakens or contradicts the original thought
- smallActionStep: one small, concrete action the user can take in the next 24 hours to test or soothe the thought
- shortAffirmation: a short positive affirmation, 6 words or fewer
- title: a short title for the thought, 6 words or fewer
- derivedQuote: a short quoted phrase the user might pull out, max 40 characters
- aiSummary: one-sentence summary of the thought
- category: exactly one of these strings: "urgent", "mental-load", "emotional-weight", "growth", "let-go"

Be empathetic, non-judgmental, and avoid diagnoses, medical instructions, or promises. Output only valid JSON with these fields.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    let responseText = (response.text ?? "{}").trim()

    // strip triple backticks if present
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    // try to parse
    let parsed: any = null
    try {
      parsed = JSON.parse(responseText)
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0])
        } catch {
          parsed = null
        }
      }
    }

    const fallback = localFallbackReframe(thought)

    const result: ReframeResult = {
      originalThought: safeString(parsed?.originalThought, fallback.originalThought),
      compassionateReframe: safeString(parsed?.compassionateReframe, fallback.compassionateReframe),
      evidenceFor: safeString(parsed?.evidenceFor, fallback.evidenceFor),
      evidenceAgainst: safeString(parsed?.evidenceAgainst, fallback.evidenceAgainst),
      smallActionStep: safeString(parsed?.smallActionStep, fallback.smallActionStep),
      shortAffirmation: safeString(parsed?.shortAffirmation, fallback.shortAffirmation),
      title: safeString(parsed?.title, fallback.title),
      derivedQuote: safeString(parsed?.derivedQuote, fallback.derivedQuote),
      aiSummary: safeString(parsed?.aiSummary, fallback.aiSummary),
      category: (parsed?.category as Category) ?? fallback.category,
    }

    // build the Thought object to return to client
    const id = existingId || `thought-${Date.now()}`
    const thoughtObj = {
      id,
      text: safeString(result.originalThought),
      title: safeString(result.title || result.originalThought.split(/\s+/).slice(0, 6).join(" ")),
      derivedQuote: safeString(result.derivedQuote || result.compassionateReframe.slice(0, 60)),
      aiSummary: safeString(result.aiSummary || result.compassionateReframe),
      category: (result.category as Category) || "growth",
      createdAt: new Date().toISOString(),
      timeAgo: "just now",
    }

    return NextResponse.json({ reframe: result, thought: thoughtObj })
  } catch (error) {
    console.error("Reframe api error:", error)
    return NextResponse.json({ error: "Failed to reframe thought. Please try again." }, { status: 500 })
  }
}