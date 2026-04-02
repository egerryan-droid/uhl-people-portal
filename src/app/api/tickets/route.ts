import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { postTicketToSlack } from "@/lib/slack"

const GENERAL_CATEGORIES = [
  "Benefits Question",
  "PTO/Leave",
  "Payroll Issue",
  "Equipment Request",
  "Policy Question",
  "Other",
]
const FORMAL_CATEGORIES = [
  "Accommodation Request",
  "Workplace Concern",
  "Grievance",
]
const ALL_CATEGORIES = [...GENERAL_CATEGORIES, ...FORMAL_CATEGORIES]
const PRIORITIES = ["low", "normal", "high", "urgent"]

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, category, priority } = body

    if (!title?.trim() || !description?.trim() || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required." },
        { status: 400 }
      )
    }

    if (!ALL_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category." },
        { status: 400 }
      )
    }

    const validPriority = PRIORITIES.includes(priority) ? priority : "normal"
    const type = FORMAL_CATEGORIES.includes(category) ? "formal" : "general"

    const ticket = await prisma.ticket.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        type,
        priority: validPriority,
        userId: session.user.id,
      },
    })

    // Post to Slack (non-blocking — failure doesn't affect ticket creation)
    postTicketToSlack({
      ticketId: ticket.id,
      title: ticket.title,
      category: ticket.category,
      type: ticket.type,
      priority: ticket.priority,
      submitterName: session.user.name ?? session.user.email ?? "Employee",
    })

    return NextResponse.json({ success: true, ticketId: ticket.id })
  } catch (error) {
    console.error("Ticket creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        type: true,
        priority: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Ticket list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
