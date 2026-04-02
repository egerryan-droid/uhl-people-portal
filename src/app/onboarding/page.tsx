"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Square, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string | null
  category: string
  order: number
}

const categoryLabels: Record<string, string> = {
  "before-start": "Before Your Start Date",
  "first-day": "First Day",
  "first-week": "First Week",
  "first-month": "First Month",
}

const categoryOrder = ["before-start", "first-day", "first-week", "first-month"]

export default function OnboardingPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((data) => {
        setTasks(data.tasks ?? [])
        setProgress(data.progress ?? {})
      })
      .catch(() => toast.error("Failed to load onboarding tasks"))
      .finally(() => setLoading(false))
  }, [])

  const toggleTask = async (taskId: string) => {
    const newCompleted = !progress[taskId]
    setProgress((prev) => ({ ...prev, [taskId]: newCompleted }))

    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: newCompleted }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setProgress((prev) => ({ ...prev, [taskId]: !newCompleted }))
      toast.error("Failed to update")
    }
  }

  const totalTasks = tasks.length
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat] ?? cat,
      items: tasks.filter((t) => t.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Onboarding Checklist
        </h1>
        <p className="text-muted-foreground">
          Track your onboarding progress. Check off tasks as you complete them.
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              {completedCount} of {totalTasks} tasks complete
            </p>
            <span className="text-sm text-muted-foreground">{progressPct}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <div className="flex items-center gap-2 mt-3 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">All tasks complete! Welcome to the team.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Groups */}
      {grouped.map((group) => (
        <div key={group.category} className="space-y-2">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            {group.label}
          </h2>
          <Card>
            <CardContent className="py-2">
              {group.items.map((task) => {
                const done = !!progress[task.id]
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    {done ? (
                      <CheckSquare className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <Square className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </span>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
