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
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Holiday {
  id: string
  name: string
  date: string
  year: number
  active: boolean
}

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/holidays")
      .then((r) => r.json())
      .then((data) => setHolidays(data.holidays ?? []))
      .catch(() => toast.error("Failed to load holidays"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !date.trim()) return

    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), date: date.trim() }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setHolidays((prev) => [...prev, data.holiday])
      setName("")
      setDate("")
      toast.success("Holiday added")
    } catch {
      toast.error("Failed to add holiday")
    }
  }

  const deleteHoliday = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return
    try {
      await fetch("/api/admin/holidays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setHolidays((prev) => prev.filter((h) => h.id !== id))
      toast.success("Holiday deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Manage Holidays
        </h1>
        <p className="text-muted-foreground">
          Add or remove company holidays shown on the Company page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Holiday</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Holiday Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Memorial Day"
                />
              </div>
              <div className="space-y-2">
                <Label>Date Description</Label>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Last Monday in May"
                />
              </div>
            </div>
            <Button type="submit" disabled={!name.trim() || !date.trim()}>
              <Plus className="mr-1 h-4 w-4" />
              Add Holiday
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : holidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No holidays configured. The Company page will show default holidays.
          </p>
        ) : (
          holidays.map((h) => (
            <Card key={h.id}>
              <CardContent className="flex items-center gap-4 py-3">
                <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <Badge variant="secondary">{h.year}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHoliday(h.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
