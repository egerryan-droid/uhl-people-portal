import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const isAdmin = session.user.role === "admin"

  try {
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

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Employees can only view their own tickets
    if (!isAdmin && ticket.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("Ticket detail error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
