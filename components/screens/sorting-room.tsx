"use client"

import type { Thought, Category } from "@/lib/store"
import { CATEGORY_CONFIG, CATEGORY_BADGE_COLORS } from "@/lib/store"

interface SortingRoomProps {
  thoughts: Thought[]
  onThoughtClick: (thought: Thought) => void
}

const CATEGORY_ORDER: Category[] = ["urgent", "mental-load", "emotional-weight", "growth", "let-go"]

export function SortingRoom({ thoughts, onThoughtClick }: SortingRoomProps) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    config: CATEGORY_CONFIG[cat],
    items: thoughts.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex flex-col px-5 pt-12 pb-32 min-h-screen">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6 text-center text-balance">
        Sorting Room
      </h1>

      {thoughts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-8">
          <p className="text-muted-foreground text-center text-lg leading-relaxed">
            Your sorted thoughts will appear here. Head to the Dumping Ground to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
        {grouped.map(({ category, config, items }) => (
          <div
            key={category}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border/40"
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-xl font-bold text-foreground">{config.label}</h2>
              <span
                className={`${CATEGORY_BADGE_COLORS[category]} text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center`}
              >
                {items.length}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {config.description}
            </p>
            <div className="flex flex-col gap-2.5">
              {items.map((thought) => (
                <button
                  key={thought.id}
                  onClick={() => onThoughtClick(thought)}
                  className={`${config.bg} rounded-xl px-4 py-3 flex items-center justify-between text-left transition-all hover:opacity-80 active:scale-[0.98]`}
                >
                  <div className="pr-3">
                    <span className="text-foreground text-sm font-semibold leading-snug block">
                      {thought.title}
                    </span>
                    <span className="text-muted-foreground text-xs leading-snug line-clamp-1">
                      {thought.derivedQuote}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {thought.timeAgo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
