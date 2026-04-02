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
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Copy, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const categories = [
  "Harassment or Discrimination",
  "Safety Concern",
  "Fraud or Financial Misconduct",
  "Policy Violation",
  "Retaliation",
  "Other Workplace Concern",
]

export default function ReportPage() {
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || description.length < 20) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      const data = await res.json()
      setReferenceId(data.referenceId)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyReferenceId = async () => {
    if (referenceId) {
      await navigator.clipboard.writeText(referenceId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (referenceId) {
    return (
      <div className="mx-auto max-w-lg mt-8 space-y-6">
        <Card className="border-green-500/50">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <CardTitle className="text-xl">Report Submitted</CardTitle>
            <CardDescription>
              Your anonymous report has been received. Save your reference number
              to check the status later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-4">
              <code className="text-2xl font-mono font-bold tracking-wider">
                {referenceId}
              </code>
              <Button variant="ghost" size="icon" onClick={copyReferenceId}>
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Write this down or copy it. You will not see it again.
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/report/status">
                <Button variant="outline">Check report status</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg mt-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>Anonymous Report</CardTitle>
          </div>
          <CardDescription>
            Submit a confidential workplace concern. This form does not require
            you to be logged in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg bg-muted p-3 space-y-1">
            <p className="text-sm font-medium">Your privacy is protected</p>
            <p className="text-xs text-muted-foreground">
              This report is anonymous. UHL cannot and will not attempt to
              identify who submitted it. No user account, IP address, or session
              data is stored with this report.
            </p>
          </div>

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
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the concern in detail. Include dates, locations, and any other relevant information."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
              {description.length > 0 && description.length < 20 && (
                <p className="text-xs text-destructive">
                  Please provide at least 20 characters.
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!category || description.length < 20 || submitting}
            >
              {submitting ? "Submitting..." : "Submit Anonymous Report"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/report/status"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Already submitted? Check report status
        </Link>
      </div>
    </div>
  )
}
