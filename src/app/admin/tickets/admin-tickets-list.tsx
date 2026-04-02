"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { MessageSquare } from "lucide-react"

interface TicketWithUser {
  id: string
  title: string
  description: string
  category: string
  type: string
  priority: string
  status: string
  assignedTo: string | null
  createdAt: Date
  updatedAt: Date
  user: { id: string; name: string | null; email: string | null }
  _count: { comments: number }
}

interface AdminUser {
  id: string
  name: string | null
  email: string | null
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  open: { label: "Open", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  "waiting-on-employee": { label: "Waiting", variant: "outline" },
  resolved: { label: "Resolved", variant: "outline" },
  closed: { label: "Closed", variant: "secondary" },
}

const priorityMap: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  normal: { label: "Normal", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  high: { label: "High", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
}

export function AdminTicketsList({
  initialTickets,
  adminUsers,
}: {
  initialTickets: TicketWithUser[]
  adminUsers: AdminUser[]
}) {
  const [tickets, setTickets] = useState(initialTickets)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (typeFilter !== "all" && t.type !== typeFilter) return false
    return true
  })

  const updateTicket = async (
    id: string,
    updates: { status?: string; priority?: string; assignedTo?: string }
  ) => {
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) throw new Error("Failed to update")

      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
      toast.success("Ticket updated")
    } catch {
      toast.error("Failed to update ticket")
    }
  }

  const addComment = async (
    ticketId: string,
    message: string,
    internal: boolean
  ) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, internal }),
      })
      if (!res.ok) throw new Error("Failed to post")
      toast.success(internal ? "Internal note added" : "Response sent")
    } catch {
      toast.error("Failed to post comment")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        {["all", "open", "in-progress", "waiting-on-employee", "resolved", "closed"].map(
          (s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : statusMap[s]?.label ?? s}
              {s !== "all" && (
                <Badge variant="secondary" className="ml-1">
                  {tickets.filter((t) => t.status === s).length}
                </Badge>
              )}
            </Button>
          )
        )}
        <span className="text-sm text-muted-foreground ml-2">Type:</span>
        {["all", "general", "formal"].map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter(t)}
          >
            {t === "all" ? "All" : t === "formal" ? "Formal" : "General"}
          </Button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No tickets match filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{ticket.title}</span>
                      {ticket.type === "formal" && (
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          Formal
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ticket.user.name ?? ticket.user.email}
                  </TableCell>
                  <TableCell className="text-sm">{ticket.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        priorityMap[ticket.priority]?.className ?? ""
                      }`}
                    >
                      {priorityMap[ticket.priority]?.label ?? ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[ticket.status]?.variant ?? "secondary"}>
                      {statusMap[ticket.status]?.label ?? ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ticket._count.comments > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground mr-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket._count.comments}
                        </span>
                      )}
                      <TicketManageDialog
                        ticket={ticket}
                        adminUsers={adminUsers}
                        onUpdate={updateTicket}
                        onComment={addComment}
                      />
                      <Link href={`/tickets/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          Full View
                        </Button>
                      </Link>
                    </div>
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

function TicketManageDialog({
  ticket,
  adminUsers,
  onUpdate,
  onComment,
}: {
  ticket: TicketWithUser
  adminUsers: AdminUser[]
  onUpdate: (id: string, updates: { status?: string; priority?: string; assignedTo?: string }) => void
  onComment: (ticketId: string, message: string, internal: boolean) => void
}) {
  const [status, setStatus] = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority)
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo ?? "")
  const [comment, setComment] = useState("")
  const [internal, setInternal] = useState(false)

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
        Manage
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{ticket.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm max-h-32 overflow-y-auto">
            {ticket.description}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusMap).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v ?? priority)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityMap).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Assigned To</Label>
              <Select value={assignedTo} onValueChange={(v) => setAssignedTo(v ?? "")}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {adminUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name ?? u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full"
            size="sm"
            onClick={() =>
              onUpdate(ticket.id, { status, priority, assignedTo: assignedTo || undefined })
            }
          >
            Save Changes
          </Button>

          <div className="border-t pt-3 space-y-2">
            <Label className="text-xs">Quick Response</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a response or internal note..."
              rows={2}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={internal}
                  onCheckedChange={(checked: boolean) => setInternal(checked)}
                />
                <span className="text-xs text-muted-foreground">
                  Internal note
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={!comment.trim()}
                onClick={() => {
                  onComment(ticket.id, comment, internal)
                  setComment("")
                  setInternal(false)
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
