"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string | null
  category: string
  order: number
  active: boolean
}

const categories = [
  { value: "before-start", label: "Before Start" },
  { value: "first-day", label: "First Day" },
  { value: "first-week", label: "First Week" },
  { value: "first-month", label: "First Month" },
]

export default function AdminOnboardingPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("first-day")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/onboarding")
      .then((r) => r.json())
      .then((data) => setTasks(data.tasks ?? []))
      .catch(() => toast.error("Failed to load tasks"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch("/api/admin/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTasks((prev) => [...prev, data.task])
      setTitle("")
      toast.success("Task added")
    } catch {
      toast.error("Failed to add task")
    }
  }

  const deleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this onboarding task?")) return
    try {
      await fetch("/api/admin/onboarding", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success("Task deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const grouped = categories.map((cat) => ({
    ...cat,
    items: tasks.filter((t) => t.category === cat.value),
  }))

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Onboarding Tasks
        </h1>
        <p className="text-muted-foreground">
          Manage the onboarding checklist shown to new employees.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete I-9 and W-4 in ADP"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={!title.trim()}>
              <Plus className="mr-1 h-4 w-4" />
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks configured. Default tasks will be shown to employees.
        </p>
      ) : (
        grouped
          .filter((g) => g.items.length > 0)
          .map((group) => (
            <div key={group.value} className="space-y-2">
              <h2 className="text-sm font-medium uppercase text-muted-foreground">
                {group.label}
              </h2>
              {group.items.map((task) => (
                <Card key={task.id}>
                  <CardContent className="flex items-center gap-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                    </div>
                    <Badge variant="secondary">{group.label}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))
      )}
    </div>
  )
}
