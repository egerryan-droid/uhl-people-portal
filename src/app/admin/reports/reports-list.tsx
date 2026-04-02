"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

interface Report {
  id: string
  reportDate: Date
  category: string
  description: string
  status: string
  adminNotes: string | null
  referenceId: string
  updatedAt: Date
}

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "New", variant: "default" },
  reviewing: { label: "Under Review", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
}

export function AdminReportsList({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState(initialReports)
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter)

  const updateReport = async (
    id: string,
    updates: { status?: string; adminNotes?: string }
  ) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) throw new Error("Failed to update")

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      )
      toast.success("Report updated")
    } catch {
      toast.error("Failed to update report")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {["all", "new", "reviewing", "resolved"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : statusBadge[s]?.label ?? s}
            {s !== "all" && (
              <Badge variant="secondary" className="ml-1">
                {reports.filter((r) => r.status === s).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ref</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs">
                    {report.referenceId}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">{report.category}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[report.status]?.variant ?? "secondary"}>
                      {statusBadge[report.status]?.label ?? report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ReportDetailDialog
                      report={report}
                      onUpdate={updateReport}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function ReportDetailDialog({
  report,
  onUpdate,
}: {
  report: Report
  onUpdate: (id: string, updates: { status?: string; adminNotes?: string }) => void
}) {
  const [status, setStatus] = useState(report.status)
  const [notes, setNotes] = useState(report.adminNotes ?? "")

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Report {report.referenceId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{report.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(report.reportDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <div className="rounded-md bg-muted p-3 text-sm">
              {report.description}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Select value={status} onValueChange={(val) => setStatus(val ?? status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Admin Notes (internal only)</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={3}
            />
          </div>

          <Button
            className="w-full"
            onClick={() => onUpdate(report.id, { status, adminNotes: notes })}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
