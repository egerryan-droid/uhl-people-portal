import { prisma } from "@/lib/db"
import { AdminTicketsList } from "./admin-tickets-list"

export default async function AdminTicketsPage() {
  let tickets: {
    id: string
    title: string
    description: string
    category: string
    type: string
    priority: string
    status: string
    userId: string
    assignedTo: string | null
    createdAt: Date
    updatedAt: Date
    user: { id: string; name: string | null; email: string | null }
    _count: { comments: number }
  }[] = []

  let adminUsers: { id: string; name: string | null; email: string | null }[] = []

  try {
    tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    adminUsers = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true, name: true, email: true },
    })
  } catch {
    // DB might not be connected
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Manage Tickets
        </h1>
        <p className="text-muted-foreground">
          View and manage all HR tickets submitted by employees.
        </p>
      </div>
      <AdminTicketsList initialTickets={tickets} adminUsers={adminUsers} />
    </div>
  )
}
