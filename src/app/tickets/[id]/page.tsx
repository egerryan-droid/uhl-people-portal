import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { TicketDetailClient } from "./ticket-detail"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { id } = await params
  const isAdmin = session.user.role === "admin"

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      comments: {
        where: isAdmin ? {} : { internal: false },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) notFound()
  if (!isAdmin && ticket.userId !== session.user.id) redirect("/tickets")

  const status = statusMap[ticket.status] ?? { label: ticket.status, variant: "secondary" as const }
  const priority = priorityMap[ticket.priority]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Tickets
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{ticket.title}</CardTitle>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{ticket.category}</Badge>
            {priority && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}
              >
                {priority.label}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Submitted {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      {/* Comments thread */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-muted-foreground">
          Conversation
        </h2>

        {ticket.comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No responses yet. HR will respond here.
          </p>
        ) : (
          ticket.comments.map((comment) => (
            <Card
              key={comment.id}
              className={
                comment.internal
                  ? "border-amber-500/30 bg-amber-500/5"
                  : comment.authorRole === "admin"
                    ? "border-blue-500/20 bg-blue-500/5"
                    : ""
              }
            >
              <CardContent className="py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    {comment.authorName ?? "Unknown"}
                  </span>
                  {comment.authorRole === "admin" && (
                    <Badge variant="secondary" className="text-[10px]">
                      HR
                    </Badge>
                  )}
                  {comment.internal && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500 text-amber-600"
                    >
                      Internal Note
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Comment form */}
      {ticket.status !== "closed" && (
        <TicketDetailClient
          ticketId={ticket.id}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}
