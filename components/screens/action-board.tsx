"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { Task } from "@/lib/store"
import { CATEGORY_TASK_COLORS } from "@/lib/store"

interface ActionBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onToggleComplete: (taskId: string) => void
}

export function ActionBoard({ tasks, onTaskClick, onToggleComplete }: ActionBoardProps) {
  const [todayOpen, setTodayOpen] = useState(true)
  const [upcomingOpen, setUpcomingOpen] = useState(true)
  const [completedOpen, setCompletedOpen] = useState(true)

  const todayTasks = tasks.filter((t) => t.isToday && !t.completed)
  const upcomingTasks = tasks.filter((t) => !t.isToday && !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="flex flex-col px-5 pt-12 pb-32 min-h-screen">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6 text-center text-balance">
        Action Board
      </h1>

      <div className="flex flex-col gap-5">
        {/* Today Section */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
          <button
            onClick={() => setTodayOpen(!todayOpen)}
            className="flex items-center justify-between w-full mb-3"
            aria-expanded={todayOpen}
          >
            <h2 className="text-xl font-bold text-foreground">Today</h2>
            {todayOpen ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {todayOpen && (
            <div className="flex flex-col gap-2.5">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks for today
                </p>
              ) : (
                todayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Upcoming Section */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
          <button
            onClick={() => setUpcomingOpen(!upcomingOpen)}
            className="flex items-center justify-between w-full mb-3"
            aria-expanded={upcomingOpen}
          >
            <h2 className="text-xl font-bold text-foreground">Upcoming</h2>
            {upcomingOpen ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {upcomingOpen && (
            <div className="flex flex-col gap-2.5">
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              ) : (
                upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Completed Section */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/40">
          <button
            onClick={() => setCompletedOpen(!completedOpen)}
            className="flex items-center justify-between w-full mb-3"
            aria-expanded={completedOpen}
          >
            <h2 className="text-xl font-bold text-foreground">Completed</h2>
            {completedOpen ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {completedOpen && (
            <div className="flex flex-col gap-2.5">
              {completedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed tasks yet
                </p>
              ) : (
                completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskItem({
  task,
  onTaskClick,
  onToggleComplete,
}: {
  task: Task
  onTaskClick: (task: Task) => void
  onToggleComplete: (taskId: string) => void
}) {
  return (
    <div
      className={`${CATEGORY_TASK_COLORS[task.category]} rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete(task.id)
        }}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          task.completed
            ? "bg-foreground border-foreground"
            : "border-muted-foreground/50 bg-transparent"
        }`}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            />
          </svg>
        )}
      </button>

      <button
        onClick={() => onTaskClick(task)}
        className={`flex-1 text-left text-sm font-medium text-foreground leading-snug ${
          task.completed ? "line-through opacity-50" : ""
        }`}
      >
        {task.title}
      </button>

      <button
        onClick={() => onTaskClick(task)}
        className="text-muted-foreground shrink-0"
        aria-label={`View details for "${task.title}"`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
