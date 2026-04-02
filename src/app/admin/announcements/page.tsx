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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Announcement {
  id: string
  title: string
  content: string
  active: boolean
  createdAt: string
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data.announcements ?? []))
      .catch(() => toast.error("Failed to load announcements"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAnnouncements((prev) => [data.announcement, ...prev])
      setTitle("")
      setContent("")
      toast.success("Announcement created")
    } catch {
      toast.error("Failed to create announcement")
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch("/api/admin/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      })
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active } : a))
      )
    } catch {
      toast.error("Failed to update")
    }
  }

  const deleteAnnouncement = async (id: string) => {
    try {
      await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      toast.success("Announcement deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Create and manage dashboard announcements visible to all employees.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Announcement message"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className={!a.active ? "opacity-60" : ""}>
              <CardContent className="flex items-start gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    <Badge variant={a.active ? "default" : "outline"}>
                      {a.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {a.content}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={a.active}
                    onCheckedChange={(checked: boolean) => toggleActive(a.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this announcement?")) {
                        deleteAnnouncement(a.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
