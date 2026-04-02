"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

interface PtoReq {
  id: string
  userName: string | null
  userEmail: string
  startDate: Date
  endDate: Date
  totalDays: number
  reason: string | null
  status: string
  adminNotes: string | null
  reviewedBy: string | null
  createdAt: Date
}

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  denied: { label: "Denied", variant: "destructive" },
}

export function AdminPtoList({ initialRequests }: { initialRequests: PtoReq[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter)

  const updateRequest = async (id: string, status: string, adminNotes?: string) => {
    try {
      const res = await fetch("/api/admin/pto", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNotes }),
      })
      if (!res.ok) throw new Error()
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, ...(adminNotes !== undefined && { adminNotes }) } : r))
      )
      toast.success(`PTO request ${status}`)
    } catch {
      toast.error("Failed to update")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {["all", "pending", "approved", "denied"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s === "all" ? "All" : statusBadge[s]?.label ?? s}
            {s !== "all" && (
              <Badge variant="secondary" className="ml-1">
                {requests.filter((r) => r.status === s).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-center">Days</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No PTO requests found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="text-sm">{req.userName ?? req.userEmail}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center font-medium">{req.totalDays}</TableCell>
                  <TableCell className="text-sm max-w-xs truncate text-muted-foreground">
                    {req.reason || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[req.status]?.variant ?? "secondary"}>
                      {statusBadge[req.status]?.label ?? req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <PtoReviewDialog request={req} onUpdate={updateRequest} />
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

function PtoReviewDialog({
  request,
  onUpdate,
}: {
  request: PtoReq
  onUpdate: (id: string, status: string, adminNotes?: string) => void
}) {
  const [notes, setNotes] = useState(request.adminNotes ?? "")

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
        Review
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>PTO Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Employee</p>
              <p className="font-medium">{request.userName ?? request.userEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Days</p>
              <p className="font-medium">{request.totalDays} business days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start</p>
              <p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End</p>
              <p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {request.reason && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reason</p>
              <div className="rounded-md bg-muted p-3 text-sm">{request.reason}</div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => onUpdate(request.id, "approved", notes)}>
              <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
            </Button>
            <Button variant="destructive" className="flex-1" onClick={() => onUpdate(request.id, "denied", notes)}>
              <XCircle className="mr-1 h-4 w-4" /> Deny
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
