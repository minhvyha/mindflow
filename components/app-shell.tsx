"use client"

import { useState, useCallback, useEffect } from "react"
import { BottomNav, type Screen } from "@/components/bottom-nav"
import { DumpingGround } from "@/components/screens/dumping-ground"
import { SortingRoom } from "@/components/screens/sorting-room"
import { ActionBoard } from "@/components/screens/action-board"
import { WeekOverview } from "@/components/screens/week-overview"
import { ThoughtDetail } from "@/components/modals/thought-detail"
import { TaskDetail } from "@/components/modals/task-detail"
import {
  loadThoughtsFromStorage,
  saveThoughtsToStorage,
  loadTasksFromStorage,
  saveTasksToStorage,
  type Thought,
  type Task,
} from "@/lib/store"

export function AppShell() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dumping")
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputText, setInputText] = useState("")
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    setThoughts(loadThoughtsFromStorage())
    setTasks(loadTasksFromStorage())
  }, [])

  // Save thoughts to localStorage whenever they change
  useEffect(() => {
    saveThoughtsToStorage(thoughts)
  }, [thoughts])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasksToStorage(tasks)
  }, [tasks])

  const [isSorting, setIsSorting] = useState(false)

  const handleSort = useCallback(
    async (text: string) => {
      setIsSorting(true)
      try {
        const response = await fetch("/api/sort-thoughts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          throw new Error("Failed to sort thoughts")
        }

        const data = await response.json()
        console.log("Sorted thoughts from API:", data)
        const newThoughts: Thought[] = data.thoughts

        setThoughts((prev) => [...newThoughts, ...prev])
        setInputText("")
        setActiveScreen("sorting")
      } catch (error) {
        console.error("Error sorting thoughts:", error)
        alert("Something went wrong while sorting your thoughts. Please try again.")
      } finally {
        setIsSorting(false)
      }
    },
    []
  )

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const handleEditTask = useCallback(
    (updatedTask: Task) => {
      if(updatedTask.dueDate instanceof Date) {
          updatedTask.isToday = updatedTask.dueDate.toDateString() === new Date().toDateString()
        }
      setTasks((prev) =>
        
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      )
    },
    []
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setSelectedTask(null)
    },
    []
  )

  const handleMarkComplete = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      )
      setSelectedTask(null)
    },
    []
  )

  const handleTurnToAction = useCallback(
    (thought: Thought) => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: thought.title,
        category: thought.category,
        derivedFrom: thought.derivedQuote,
        dueDate: new Date(), // Default to today, can be edited in TaskDetail
        completed: false,
        createdAt: new Date().toLocaleDateString(),
        isToday: true,
      }
      setTasks((prev) => [newTask, ...prev])
      setSelectedThought(null)
      setActiveScreen("action")
    },
    []
  )

  const handleLetGo = useCallback(
    (thought: Thought) => {
      setThoughts((prev) => prev.filter((t) => t.id !== thought.id))
      setSelectedThought(null)
    },
    []
  )

  const handleReframe = useCallback((_thought: Thought) => {
    setSelectedThought(null)
  }, [])

  const handleAdd = useCallback(() => {
    setActiveScreen("dumping")
    setInputText("")
  }, [])

  return (
    <div className="relative min-h-screen max-w-md mx-auto overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A7C7E7]/15 via-[#faf9f7] to-[#F6B6C1]/15" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#A7C7E7]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-48 h-48 bg-[#A7C7E7]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-[#F6B6C1]/15 rounded-full blur-3xl" />
      </div>

      {/* Screen Content */}
      <main>
        {activeScreen === "dumping" && (
          <DumpingGround
            onSort={handleSort}
            inputText={inputText}
            setInputText={setInputText}
            isSorting={isSorting}
          />
        )}
        {activeScreen === "sorting" && (
          <SortingRoom
            thoughts={thoughts}
            onThoughtClick={setSelectedThought}
          />
        )}
        {activeScreen === "action" && (
          <ActionBoard
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onToggleComplete={handleToggleComplete}
          />
        )}
        {activeScreen === "overview" && (
          <WeekOverview thoughts={thoughts} />
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav
        active={activeScreen}
        onNavigate={setActiveScreen}
        onAdd={handleAdd}
      />

      {/* Modals */}
      {selectedThought && (
        <ThoughtDetail
          thought={selectedThought}
          onClose={() => setSelectedThought(null)}
          onReframe={handleReframe}
          onTurnToAction={handleTurnToAction}
          onLetGo={handleLetGo}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onMarkComplete={handleMarkComplete}
        />
      )}
    </div>
  )
}
