import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Ticket } from "lucide-react"
import { TicketList } from "./ticket-list"

export default async function TicketsPage() {
  const session = await auth()

  let tickets: {
    id: string
    title: string
    category: string
    type: string
    priority: string
    status: string
    createdAt: Date
    updatedAt: Date
  }[] = []

  try {
    if (session?.user?.id) {
      tickets = await prisma.ticket.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    }
  } catch {
    // DB may not be connected
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">HR Tickets</h1>
          <p className="text-muted-foreground">
            Submit and track HR requests, questions, and formal concerns.
          </p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No tickets yet. Submit a new ticket to get started.
            </p>
            <Link href="/tickets/new" className="mt-4 inline-block">
              <Button variant="outline">Create your first ticket</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  )
}
