import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const isAdmin = session.user.role === "admin"

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } })
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Employees can only comment on their own tickets
    if (!isAdmin && ticket.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { message, internal } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      )
    }

    const comment = await prisma.ticketComment.create({
      data: {
        ticketId: id,
        authorId: session.user.id,
        authorName: session.user.name,
        authorRole: isAdmin ? "admin" : "employee",
        message: message.trim(),
        internal: isAdmin ? !!internal : false,
      },
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
