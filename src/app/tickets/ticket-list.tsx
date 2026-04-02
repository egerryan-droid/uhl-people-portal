"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
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
import { ArrowRight } from "lucide-react"

interface Ticket {
  id: string
  title: string
  category: string
  type: string
  priority: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  open: { label: "Open", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  "waiting-on-employee": { label: "Waiting on You", variant: "outline" },
  resolved: { label: "Resolved", variant: "outline" },
  closed: { label: "Closed", variant: "secondary" },
}

const priorityMap: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  normal: { label: "Normal", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  high: { label: "High", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  const statuses = ["all", "open", "in-progress", "waiting-on-employee", "resolved", "closed"]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : statusMap[s]?.label ?? s}
          </Button>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No tickets match this filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {ticket.title}
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
                    <Badge
                      variant={
                        statusMap[ticket.status]?.variant ?? "secondary"
                      }
                    >
                      {statusMap[ticket.status]?.label ?? ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
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
