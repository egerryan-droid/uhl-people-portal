"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface PtoEntry {
  id: string
  userName: string | null
  userEmail: string
  startDate: string
  endDate: string
  status: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function PtoCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [entries, setEntries] = useState<PtoEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/pto/calendar?year=${year}&month=${month + 1}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.requests ?? []))
      .catch(() => toast.error("Failed to load calendar"))
      .finally(() => setLoading(false))
  }, [year, month])

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  // Build map of day -> entries
  const dayEntries: Record<number, PtoEntry[]> = {}
  for (const entry of entries) {
    const start = new Date(entry.startDate)
    const end = new Date(entry.endDate)
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      if (date >= start && date <= end) {
        if (!dayEntries[d]) dayEntries[d] = []
        dayEntries[d].push(entry)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="py-3">
          {loading ? (
            <p className="text-sm text-center text-muted-foreground py-8">Loading...</p>
          ) : (
            <div className="grid grid-cols-7 gap-px">
              {/* Day headers */}
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}

              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[60px] p-1" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isWeekend = new Date(year, month, day).getDay() % 6 === 0
                const dayPto = dayEntries[day] ?? []

                return (
                  <div
                    key={day}
                    className={`min-h-[60px] rounded-md border p-1 ${
                      isWeekend ? "bg-muted/50" : ""
                    }`}
                  >
                    <p className="text-xs font-medium">{day}</p>
                    <div className="space-y-0.5 mt-0.5">
                      {dayPto.slice(0, 3).map((entry) => (
                        <div
                          key={entry.id}
                          className={`rounded px-1 py-0.5 text-[10px] leading-tight truncate ${
                            entry.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {entry.userName ?? entry.userEmail.split("@")[0]}
                        </div>
                      ))}
                      {dayPto.length > 3 && (
                        <p className="text-[10px] text-muted-foreground">
                          +{dayPto.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-900/30" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-yellow-100 dark:bg-yellow-900/30" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  )
}
