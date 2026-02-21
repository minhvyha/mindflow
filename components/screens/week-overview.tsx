"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { Thought } from "@/lib/store"

interface WeekOverviewProps {
  thoughts: Thought[]
}

const PIE_COLORS: Record<string, string> = {
  "Let Go": "#D8D4F2",
  "Mental Load": "#A7C7E7",
  Growth: "#B7E4C7",
  "Emotional Weight": "#F7D27C",
  Urgent: "#F6B6C1",
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
  urgent: "Urgent",
  "mental-load": "Mental Load",
  "emotional-weight": "Emotional Weight",
  growth: "Growth",
  "let-go": "Let Go",
}

export function WeekOverview({ thoughts }: WeekOverviewProps) {
  const categoryCounts: Record<string, number> = {}
  thoughts.forEach((t) => {
    const label = CATEGORY_LABEL_MAP[t.category] || t.category
    categoryCounts[label] = (categoryCounts[label] || 0) + 1
  })

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }))

  const recurringThemes = ["Response anxiety", "Academic pressure", "Social uncertainty"]

  return (
    <div className="flex flex-col px-8 pt-12 pb-38 min-h-screen">
      <h1 className="text-[28px] font-bold text-foreground mb-6 text-balance text-center">
        Week Overview
      </h1>

      {thoughts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-8">
          <p className="text-muted-foreground text-center text-lg leading-relaxed">
            Your weekly overview will appear here once you start sorting thoughts.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
        {/* Weekly Summary Insight */}
        <div className="bg-card rounded-2xl p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <img src="/ai.svg" alt="" />
            <h2 className="text-lg font-bold text-black">Weekly Summary Insight</h2>
          </div>
          <p className="text-black text-lg leading-relaxed mb-2">
            {"You've had more urgent thoughts this week."}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thursday was your busiest day, likely due to upcoming deadlines
          </p>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-2xl p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-border/40">
          <h2 className="text-lg font-bold text-black mb-4">
            Category Distribution
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[entry.name] || "#ccc"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[entry.name] || "#ccc" }}
                  />
                  <span className="text-foreground text-xs">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recurring Themes */}
        <div className="bg-card rounded-2xl p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <img src="/ai.svg" alt="" />
            <h2 className="text-lg font-bold text-black">Recurring Themes</h2>
          </div>
          <ul className="flex flex-col gap-3 pl-2" role="list">
            {recurringThemes.map((theme) => (
              <li key={theme} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-foreground shrink-0" aria-hidden="true" />
                <span className="text-foreground text-base">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}
    </div>
  )
}

