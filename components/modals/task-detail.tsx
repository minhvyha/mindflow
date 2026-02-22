"use client"

import { useState } from "react"
import { X, Pencil, XCircle, CheckCircle2, Save } from "lucide-react"
import type { Task } from "@/lib/store"
import { CATEGORY_CONFIG, CATEGORY_BADGE_COLORS } from "@/lib/store"

interface TaskDetailProps {
  task: Task
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMarkComplete: (taskId: string) => void
}

export function TaskDetail({
  task,
  onClose,
  onEdit,
  onDelete,
  onMarkComplete,
}: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDueDate, setEditedDueDate] = useState<string | Date>(task.dueDate)

  const config = CATEGORY_CONFIG[task.category]

  const handleSave = () => {
    onEdit({
      ...task,
      title: editedTitle,
      dueDate: typeof editedDueDate === 'string' ? new Date(editedDueDate) : editedDueDate,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(task.title)
    setEditedDueDate(task.dueDate)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <span
            className={`${CATEGORY_BADGE_COLORS[task.category]} text-xs font-semibold opacity-50 px-3 py-1 rounded-full uppercase tracking-wider`}
          >
            {config.label}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="mb-4">
          <span className="text-xs  tracking-wider text-muted-foreground uppercase">
            Task
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-lg font-medium text-foreground mt-1 px-3 py-2 bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <h2 className="text-lg font-medium text-foreground mt-1">{task.title}</h2>
          )}
        </div>

        <div className="mb-4">
          <span className="text-xs tracking-wider text-muted-foreground uppercase">
            Derived from thought
          </span>
          <p className="text-lg font-medium text-foreground mt-1">
            {`\u201C${task.derivedFrom}\u201D`}
          </p>
        </div>

        <div className="mb-6">
          <span className="text-xs tracking-wider text-muted-foreground uppercase">
            Due Date
          </span>
          {isEditing ? (
            <input
              type="text"
              value={typeof editedDueDate === 'string' ? editedDueDate : editedDueDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full text-foreground font-bold mt-1 px-3 py-2 bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter due date"
            />
          ) : (
            <p className="text-foreground font-bold mt-1">{task.dueDate.toLocaleDateString()}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition-all active:scale-[0.97]"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors active:scale-[0.97]"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-solid border-[#A7C7E7] text-[#5d86af] text-sm font-medium hover:bg-muted/50 transition-colors active:scale-[0.97]"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-solid border-app-red text-[#d86e80] text-sm font-medium hover:bg-app-red/10 transition-colors active:scale-[0.97]"
              >
                <XCircle className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>

        {/* Mark Complete */}
        <button
          onClick={() => onMarkComplete(task.id)}
          className=" px-4 mx-auto flex items-center justify-center gap-2 py-3.5 bg-foreground text-primary-foreground rounded-full text-base font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <img src="/check.svg" alt="Checkmark" className="w-5 h-5" />
          Mark as completed
        </button>

        {/* Date Created */}
        <div className="text-center mt-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Date Created
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">{task.createdAt}</p>
        </div>
      </div>
    </div>
  )
}
