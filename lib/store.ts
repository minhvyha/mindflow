export type Category = "urgent" | "mental-load" | "emotional-weight" | "growth" | "let-go"

export interface Thought {
  id: string
  text: string
  title: string
  derivedQuote: string
  aiSummary: string
  category: Category
  createdAt: string
  timeAgo: string
}

export interface Task {
  id: string
  title: string
  category: Category
  derivedFrom: string
  dueDate: Date
  completed: boolean
  createdAt: string
  isToday: boolean
}

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bg: string; description: string }> = {
  urgent: {
    label: "Urgent",
    color: "bg-app-red",
    bg: "bg-app-red/30",
    description: "Time-sensitive or action-triggering thoughts",
  },
  "mental-load": {
    label: "Mental Load",
    color: "bg-app-yellow",
    bg: "bg-app-yellow/30",
    description: "Cognitive tasks and recurring mental loops",
  },
  "emotional-weight": {
    label: "Emotional Weight",
    color: "bg-app-blue",
    bg: "bg-app-blue/30",
    description: "Emotionally charged or unresolved experiences",
  },
  growth: {
    label: "Growth",
    color: "bg-app-green",
    bg: "bg-app-green/30",
    description: "Reflective or future-oriented thinking",
  },
  "let-go": {
    label: "Let Go",
    color: "bg-app-purple",
    bg: "bg-app-purple/30",
    description: "Low-value or repetitive cognitive noise.",
  },
}

export const CATEGORY_BADGE_COLORS: Record<Category, string> = {
  urgent: "bg-app-red",
  "mental-load": "bg-app-yellow",
  "emotional-weight": "bg-app-blue",
  growth: "bg-app-green",
  "let-go": "bg-app-purple",
}

export const CATEGORY_TASK_COLORS: Record<Category, string> = {
  urgent: "bg-[#F6B6C1]/40",
  "mental-load": "bg-[#F7D27C]/40",
  "emotional-weight": "bg-[#A7C7E7]/40",
  growth: "bg-[#B7E4C7]/40",
  "let-go": "bg-[#D8D4F2]/40",
}

export const INITIAL_THOUGHTS: Thought[] = []

export const INITIAL_TASKS: Task[] = []

export const AI_INSIGHTS: Record<string, string> = {
  default: "It sounds like this thought is driven by concern about how you're being perceived. When something feels important, it can create pressure to respond quickly, even if you're not ready.",
  urgent: "This thought feels time-sensitive and is creating pressure. It might help to identify the actual deadline and separate urgency from anxiety.",
  "mental-load": "This is a task that keeps circling in your mind. Writing it down and creating a concrete action can help release the mental loop.",
  "emotional-weight": "This feeling is valid and significant. Acknowledging it is the first step - you don't have to resolve it right now.",
  growth: "This is a forward-looking thought. Consider what small first step could move you toward this aspiration.",
  "let-go": "This thought may not serve you anymore. Recognizing it as repetitive cognitive noise can help you gently release it.",
}

// LocalStorage utilities
const STORAGE_KEYS = {
  THOUGHTS: "mindsort_thoughts",
  TASKS: "mindsort_tasks",
}

export function loadThoughtsFromStorage(): Thought[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THOUGHTS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load thoughts from localStorage:", error)
    return []
  }
}

export function saveThoughtsToStorage(thoughts: Thought[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.THOUGHTS, JSON.stringify(thoughts))
  } catch (error) {
    console.error("Failed to save thoughts to localStorage:", error)
  }
}

export function loadTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error)
    return []
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error)
  }
}
