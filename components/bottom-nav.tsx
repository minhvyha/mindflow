"use client"

import { Plus } from "lucide-react"

export type Screen = "dumping" | "sorting" | "action" | "overview"

interface BottomNavProps {
  active: Screen
  onNavigate: (screen: Screen) => void
  onAdd: () => void
}

export function BottomNav({ active, onNavigate, onAdd }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bg-card/90 backdrop-blur-lg rounded-full shadow-lg border border-border/40 px-4 py-2 flex items-center gap-2 max-w-xs w-full justify-between">
        <NavButton
          label="Dumping Ground"
          active={active === "dumping"}
          onClick={() => onNavigate("dumping")}
        >
          <img src="/room.svg" alt="" />
        </NavButton>

        <NavButton
          label="Sorting Room"
          active={active === "sorting"}
          onClick={() => onNavigate("sorting")}
        >
          <img src="/box.svg" alt="" />
        </NavButton>

        {/* Floating Add Button */}
        <button
          onClick={onAdd}
          className="w-12 h-12 -mt-6 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
          aria-label="Add new thought"
        >
          <Plus className="w-6 h-6" />
        </button>

        <NavButton
          label="Week Overview"
          active={active === "overview"}
          onClick={() => onNavigate("overview")}
        >
          <img src="/chart.svg" alt="" />
        </NavButton>

        <NavButton
          label="Action Board"
          active={active === "action"}
          onClick={() => onNavigate("action")}
        >
          <img src="/board.svg" alt="" />
        </NavButton>
      </div>
    </nav>
  )
}

function NavButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-colors ${
        active ? "" : "opacity-70 hover:opacity-100"
      }`}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  )
}