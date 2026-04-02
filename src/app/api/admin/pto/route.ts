import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const requests = await prisma.ptoRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ requests })
}

export async function PATCH(request: Request) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    await prisma.ptoRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        reviewedBy: session.user.name ?? session.user.email,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PTO update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
