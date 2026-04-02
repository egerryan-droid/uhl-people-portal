"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface FeedbackItem {
  id: string
  userEmail: string
  userName: string | null
  category: string
  message: string
  status: string
  createdAt: string
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  new: "secondary",
  reviewed: "default",
  responded: "outline",
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then((r) => r.json())
      .then((data) => setFeedback(data.feedback ?? []))
      .catch(() => toast.error("Failed to load feedback"))
      .finally(() => setLoading(false))
  }, [])

  const markAsReviewed = async (id: string) => {
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "reviewed" }),
      })
      if (!res.ok) throw new Error()
      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "reviewed" } : f))
      )
      toast.success("Marked as reviewed")
    } catch {
      toast.error("Failed to update")
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Employee Feedback
        </h1>
        <p className="text-muted-foreground">
          View all feedback and suggestions submitted by employees.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : feedback.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No feedback submitted yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {f.userName ?? f.userEmail}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[f.status] ?? "secondary"}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-md">
                    {f.message}
                  </TableCell>
                  <TableCell>
                    {f.status === "new" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsReviewed(f.id)}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Reviewed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
