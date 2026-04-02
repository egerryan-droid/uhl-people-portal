import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notifyTicketUpdate } from "@/lib/slack"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") return null
  return session
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const priority = searchParams.get("priority")

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status && { status }),
        ...(type && { type }),
        ...(priority && { priority }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Admin ticket list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status, priority, assignedTo } = body

    if (!id) {
      return NextResponse.json(
        { error: "Ticket ID required" },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
      },
    })

    if (status) {
      notifyTicketUpdate(
        ticket.title,
        status,
        ticket.user.name ?? ticket.user.email ?? "Employee"
      ).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ticket update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
