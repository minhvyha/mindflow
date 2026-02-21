"use client"

import { Mic, Loader2 } from "lucide-react"

interface DumpingGroundProps {
  onSort: (text: string) => void
  inputText: string
  setInputText: (text: string) => void
  isSorting: boolean
}

export function DumpingGround({ onSort, inputText, setInputText, isSorting }: DumpingGroundProps) {
  return (
    <div className="flex flex-col items-center px-6 pt-12 pb-32 min-h-screen">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-12 text-balance text-center">
        Dumping Ground
      </h1>

      <div className="w-full max-w-sm">
        <div className="relative bg-card rounded-2xl shadow-sm border border-border/50 p-5 min-h-[200px]">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full h-[160px] bg-transparent text-foreground placeholder:text-muted-foreground/60 text-lg leading-relaxed resize-none focus:outline-none font-sans"
            aria-label="Write your thoughts"
            disabled={isSorting}
          />
          <button
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
            aria-label="Record voice note"
            disabled={isSorting}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm text-center mt-4 leading-relaxed">
          {"You don't need to organise it. I'll help."}
        </p>
      </div>

      <div className="w-full max-w-sm mt-12">
        <button
          onClick={() => {
            if (inputText.trim() && !isSorting) {
              onSort(inputText.trim())
            }
          }}
          disabled={!inputText.trim() || isSorting}
          className="w-full py-4 px-8 bg-foreground text-primary-foreground rounded-full text-lg font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSorting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sorting your thoughts...</span>
            </>
          ) : (
            "Sort my thoughts"
          )}
        </button>
      </div>
    </div>
  )
}
