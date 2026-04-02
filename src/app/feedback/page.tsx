"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CheckCircle2, MessageSquare } from "lucide-react"
import { toast } from "sonner"

const categories = [
  "Portal Feature Request",
  "Workplace Suggestion",
  "HR Question",
]

export default function FeedbackPage() {
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !message.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      setSubmitted(true)
      toast.success("Feedback submitted! Thank you.")
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
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>
              Your feedback has been submitted. We review all submissions and use
              them to improve the portal and workplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setCategory("")
                setMessage("")
              }}
            >
              Submit another
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          Share suggestions, feature requests, or questions. This form is tied to
          your account (not anonymous).
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Submit Feedback</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!category || !message.trim() || submitting}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
