"use client"

import { ChevronDown, Tag, CheckCircle2, SlidersHorizontal } from "lucide-react"
import type { Thought } from "@/lib/store"
import { CATEGORY_CONFIG, CATEGORY_BADGE_COLORS } from "@/lib/store"

interface ThoughtDetailProps {
  thought: Thought
  onClose: () => void
  onReframe: (thought: Thought) => void
  onTurnToAction: (thought: Thought) => void
  onLetGo: (thought: Thought) => void
}

export function ThoughtDetail({
  thought,
  onClose,
  onReframe,
  onTurnToAction,
  onLetGo,
}: ThoughtDetailProps) {
  const config = CATEGORY_CONFIG[thought.category]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-background rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
        {/* Pull handle */}
        <button
          onClick={onClose}
          className="flex justify-center w-full mb-6"
          aria-label="Close detail view"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold tracking-wider text-muted-foreground uppercase">
            Your Thought
          </span>
            <span
            className={`${CATEGORY_BADGE_COLORS[thought.category]} opacity-50 text-xs text-black font-semibold px-3 py-2 rounded-full uppercase tracking-wider`}
            >
            {config.label}
          </span>
        </div>

        {/* Thought title */}
        <h2 className="text-2xl font-medium text-foreground leading-snug mb-2">
          {thought.title}
        </h2>

        {/* Derived quote
        <p className="text-muted-foreground text-sm italic leading-relaxed mb-1">
          {`\u201C${thought.derivedQuote}\u201D`}
        </p> */}

        {/* Creation date */}
        <p className="text-muted-foreground/70 text-xs mb-6">
          {new Date(thought.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        {/* AI Insight */}
        <div className="bg-[#FFF8F2] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-2xl p-5 mb-8">
          <div className="mb-3">
            <img src="/ai.svg" alt="" />
          </div>
          <p className="text-foreground text-lg leading-relaxed">{thought.aiSummary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onReframe(thought)}
            className="flex items-center justify-between w-full px-5 py-4 rounded-full border-2 border-solid border-app-green text-foreground transition-all hover:bg-app-green/20 active:scale-[0.98]"
          >
            <span className="text-base font-medium">Reframe gently</span>
            <Tag className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => onTurnToAction(thought)}
            className="flex items-center justify-between w-full px-5 py-4 rounded-full border-2 border-solid border-app-yellow text-foreground transition-all hover:bg-app-yellow/20 active:scale-[0.98]"
          >
            <span className="text-base font-medium">Turn into action</span>
            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => onLetGo(thought)}
            className="flex items-center justify-between w-full px-5 py-4 rounded-full border-2 border-solid border-app-blue text-foreground transition-all hover:bg-app-blue/20 active:scale-[0.98]"
          >
            <span className="text-base font-medium">Let go</span>
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#D8D4F2" />
      <path d="M18 14L19 17L22 18L19 19L18 22L17 19L14 18L17 17L18 14Z" fill="#A7C7E7" />
      <path d="M6 16L6.75 18.25L9 19L6.75 19.75L6 22L5.25 19.75L3 19L5.25 18.25L6 16Z" fill="#F6B6C1" />
    </svg>
  )
}
