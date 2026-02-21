import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const prompt = `You are a compassionate mental health assistant that helps users organize their thoughts. The user has written the following text as a brain dump:

"""
${text.trim()}
"""

Today's date is ${today}.

Your job is to identify each distinct thought from the text and categorize each one into EXACTLY one of these categories:
- "urgent": Time-sensitive or action-triggering thoughts
- "mental-load": Cognitive tasks and recurring mental loops
- "emotional-weight": Emotionally charged or unresolved experiences
- "growth": Reflective or future-oriented thinking
- "let-go": Low-value or repetitive cognitive noise

For each thought, provide:
1. "title": A short 2-4 word title summarizing the thought
2. "derivedQuote": The exact quote or close paraphrase from the user's text that this thought is derived from
3. "category": One of the five categories above
4. "aiSummary": A warm, empathetic 1-2 sentence explanation of why the user might be having this thought and what it reveals about their inner state. Be compassionate, non-judgmental, and insightful.

Respond ONLY with a valid JSON array. No markdown, no code fences, no explanation. Just the raw JSON array.

Example format:
[
  {
    "title": "Response pressure",
    "derivedQuote": "I need to respond before they think I'm ignoring them",
    "category": "urgent",
    "aiSummary": "This thought is driven by concern about how you're being perceived. When something feels important, it can create pressure to respond quickly."
  }
]`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const responseText = response.text?.trim() || "[]"

    // Clean up the response - remove markdown code fences if present
    let cleanedText = responseText
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    const sortedThoughts = JSON.parse(cleanedText)

    // Validate and sanitize the response
    const validCategories = ["urgent", "mental-load", "emotional-weight", "growth", "let-go"]
    const validatedThoughts = sortedThoughts.map(
      (
        thought: {
          title?: string
          derivedQuote?: string
          category?: string
          aiSummary?: string
        },
        index: number
      ) => ({
        id: `ai-${Date.now()}-${index}`,
        text: thought.derivedQuote || "Untitled thought",
        title: thought.title || "Untitled",
        derivedQuote: thought.derivedQuote || "",
        aiSummary:
          thought.aiSummary || "Take a moment to reflect on this thought.",
        category: validCategories.includes(thought.category || "")
          ? thought.category
          : "mental-load",
        createdAt: new Date().toISOString(),
        timeAgo: "just now",
      })
    )

    return NextResponse.json({ thoughts: validatedThoughts })
  } catch (error) {
    console.error("Error sorting thoughts:", error)
    return NextResponse.json(
      { error: "Failed to sort thoughts. Please try again." },
      { status: 500 }
    )
  }
}
