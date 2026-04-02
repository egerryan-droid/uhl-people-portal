"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ArrowLeft, CheckCircle2, Ticket } from "lucide-react"
import { toast } from "sonner"

const GENERAL_CATEGORIES = [
  "Benefits Question",
  "PTO/Leave",
  "Payroll Issue",
  "Equipment Request",
  "Policy Question",
  "Other",
]

const FORMAL_CATEGORIES = [
  "Accommodation Request",
  "Workplace Concern",
  "Grievance",
]

const PRIORITIES = [
  { value: "low", label: "Low — Not time sensitive" },
  { value: "normal", label: "Normal — Standard request" },
  { value: "high", label: "High — Needs attention soon" },
  { value: "urgent", label: "Urgent — Immediate attention needed" },
]

export default function NewTicketPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("normal")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !category || !description.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, priority, description }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      const data = await res.json()
      setTicketId(data.ticketId)
      setSubmitted(true)
      toast.success("Ticket submitted!")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg mt-8">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <CardTitle>Ticket Submitted</CardTitle>
            <CardDescription>
              Your HR ticket has been received. HR has been notified and will
              respond as soon as possible. You can track the status below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-2">
            {ticketId && (
              <Link href={`/tickets/${ticketId}`}>
                <Button>View Ticket</Button>
              </Link>
            )}
            <Link href="/tickets">
              <Button variant="outline">All Tickets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Tickets
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <CardTitle>New HR Ticket</CardTitle>
          </div>
          <CardDescription>
            Submit an HR request or concern. This is tied to your account — HR
            will see who submitted it. For anonymous reports, use the{" "}
            <Link href="/report" className="underline">
              Anonymous Report
            </Link>{" "}
            form instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your request"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    General
                  </div>
                  {GENERAL_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
                    Formal
                  </div>
                  {FORMAL_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val ?? "normal")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your request or concern..."
                rows={5}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                !title.trim() || !category || !description.trim() || submitting
              }
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
