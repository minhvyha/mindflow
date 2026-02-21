import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })

type ReframeResult = {
  originalThought: string
  compassionateReframe: string
  evidenceFor: string
  evidenceAgainst: string
  smallActionStep: string
  shortAffirmation: string
}

function safeString(input: any, fallback = "") {
  if (!input && input !== "") return fallback
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
      `I hear how heavy this feels. One kinder way to say it might be: "${truncated}" but with curiosity about what else could be true.`,
    evidenceFor: "This thought may come from recent experiences or strong emotions that made the idea feel true.",
    evidenceAgainst: "There are likely times or facts that do not fully support the absolute version of this thought.",
    smallActionStep: "Try a 5 minute check-in: write down 1 thing that contradicts this thought.",
    shortAffirmation: "I am learning and growing",
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const thought = safeString(body?.thought ?? body?.text ?? "")

    if (!thought) {
      return NextResponse.json({ error: "No thought provided" }, { status: 400 })
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const prompt = `You are a compassionate mental health assistant that helps users reframe single unhelpful or distressing thoughts. Today's date is ${today}.
User thought:\n"""
${thought}
"""\n
Your job is to return a JSON object with exactly these fields:
- originalThought: the original thought text
- compassionateReframe: a warm 1-2 sentence reframe that validates feelings and offers a kinder alternative perspective
- evidenceFor: one short sentence listing realistic evidence that might support the original thought
- evidenceAgainst: one short sentence listing realistic evidence that weakens or contradicts the original thought
- smallActionStep: one small, concrete action the user can take in the next 24 hours to test or soothe the thought
- shortAffirmation: a short positive affirmation, 6 words or fewer
Be empathetic, non-judgmental, and avoid diagnoses, medical instructions, or promises. Answer ONLY with a valid JSON object, no surrounding markdown or explanation.`

    // Call the GenAI model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // note: you can add parameters such as temperature if desired
    })

    let responseText = response.text?.trim() ?? "{}"

    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    let parsed: any = null
    try {
      parsed = JSON.parse(responseText)
    } catch (err) {
      // try to recover if the model wrapped the JSON in extra text
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
    }

    return NextResponse.json({ reframe: result })
  } catch (error) {
    console.error("Reframe api error:", error)
    return NextResponse.json({ error: "Failed to reframe thought. Please try again." }, { status: 500 })
  }
}
