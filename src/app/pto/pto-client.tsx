"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import { toast } from "sonner"

interface PtoRequest {
  id: string
  startDate: Date
  endDate: Date
  totalDays: number
  reason: string | null
  status: string
  adminNotes: string | null
  reviewedBy: string | null
  createdAt: Date
}

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: <Clock className="h-3 w-3 text-yellow-500" />,
  },
  approved: {
    label: "Approved",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  },
  denied: {
    label: "Denied",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3 text-red-500" />,
  },
}

function getBusinessDays(start: Date, end: Date): number {
  let count = 0
  const current = new Date(start)
  while (current <= end) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

function getNoticeRequirement(days: number): { text: string; warn: boolean } {
  if (days >= 10) return { text: "1 month notice required (2+ weeks of PTO)", warn: true }
  if (days >= 3) return { text: "2 weeks notice required (3+ days of PTO)", warn: true }
  return { text: "3 days notice required (1-2 days of PTO)", warn: false }
}

export function PtoClient({ myRequests }: { myRequests: PtoRequest[] }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalDays =
    startDate && endDate
      ? getBusinessDays(new Date(startDate), new Date(endDate))
      : 0

  const notice = totalDays > 0 ? getNoticeRequirement(totalDays) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || totalDays < 2) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/pto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, totalDays, reason }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit")
      }
      setSubmitted(true)
      toast.success("PTO request submitted!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Request Time Off
        </h1>
        <p className="text-muted-foreground">
          Submit a PTO request for 2 or more business days. For single-day
          absences, notify your manager directly.
        </p>
      </div>

      {/* Calendar Link */}
      <div className="flex justify-end">
        <Link href="/pto/calendar">
          <Button variant="outline" size="sm">
            <Calendar className="mr-1 h-4 w-4" />
            View PTO Calendar
          </Button>
        </Link>
      </div>

      {/* Policy Quick Reference */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="py-3 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium">PTO Policy Reminders</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <p>
              <strong>1-2 days:</strong> 3 days notice
            </p>
            <p>
              <strong>3+ days:</strong> 2 weeks notice
            </p>
            <p>
              <strong>2+ weeks:</strong> 1 month notice
            </p>
            <p>
              <strong>Minimum:</strong> 15 days/year (5 consecutive)
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Extended vacations (5+ days) should be after your first 90 days.
            Record all PTO in ADP.
          </p>
        </CardContent>
      </Card>

      {/* Request Form */}
      {submitted ? (
        <Card>
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <p className="mt-3 text-sm font-medium">PTO Request Submitted</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your manager and HR will review this request. You&apos;ll see the
              status update below. Remember to also record approved PTO in ADP.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSubmitted(false)
                setStartDate("")
                setEndDate("")
                setReason("")
              }}
            >
              Submit another request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">New PTO Request</CardTitle>
            </div>
            <CardDescription>
              For absences of 2 or more business days. Single-day absences just
              need a Slack/email heads-up to your manager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First day off</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last day off</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {totalDays > 0 && (
                <div className="rounded-md bg-muted p-3 space-y-2">
                  <p className="text-sm">
                    <strong>{totalDays} business day{totalDays !== 1 ? "s" : ""}</strong> off
                  </p>
                  {notice && (
                    <div className="flex items-center gap-2">
                      {notice.warn ? (
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      ) : (
                        <Info className="h-3 w-3 text-muted-foreground" />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {notice.text}
                      </p>
                    </div>
                  )}
                  {totalDays < 2 && (
                    <p className="text-xs text-amber-600">
                      For single-day absences, just notify your manager — no
                      formal request needed.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Reason / notes (optional)</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Vacation, personal time, etc. No need to be specific."
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!startDate || !endDate || totalDays < 2 || submitting}
              >
                {submitting ? "Submitting..." : "Submit PTO Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* My Requests */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-muted-foreground">
          Your PTO Requests
        </h2>
        {myRequests.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No PTO requests submitted yet.
            </CardContent>
          </Card>
        ) : (
          myRequests.map((req) => {
            const status = statusMap[req.status] ?? statusMap.pending
            return (
              <Card key={req.id}>
                <CardContent className="flex items-center gap-4 py-3">
                  {status.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {new Date(req.startDate).toLocaleDateString()} —{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.totalDays} business day{req.totalDays !== 1 ? "s" : ""}
                      {req.reason ? ` · ${req.reason}` : ""}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
