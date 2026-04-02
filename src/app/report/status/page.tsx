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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "Received", variant: "secondary" },
  reviewing: { label: "Under Review", variant: "default" },
  resolved: { label: "Resolved", variant: "outline" },
}

export default function ReportStatusPage() {
  const [referenceId, setReferenceId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    status: string
    category: string
    reportDate: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!referenceId.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(
        `/api/report/status?ref=${encodeURIComponent(referenceId.trim().toUpperCase())}`
      )
      if (res.status === 404) {
        setError("No report found with that reference number.")
        return
      }
      if (!res.ok) throw new Error("Failed to check status")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check Report Status</CardTitle>
          <CardDescription>
            Enter your reference number to check the status of a previously
            submitted anonymous report. No login required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., AB12CD34"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                  className="font-mono tracking-wider"
                  maxLength={8}
                />
                <Button type="submit" disabled={!referenceId.trim() || loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          {result && (
            <div className="mt-4 rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={statusLabels[result.status]?.variant ?? "secondary"}>
                  {statusLabels[result.status]?.label ?? result.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm">{result.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Date submitted
                </span>
                <span className="text-sm">
                  {new Date(result.reportDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/report"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Submit a new anonymous report
        </Link>
      </div>
    </div>
  )
}
