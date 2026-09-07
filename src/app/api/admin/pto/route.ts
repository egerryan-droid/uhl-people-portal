import { NextResponse, after } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notifyPtoApproval } from "@/lib/slack"
import { formatDateOnly } from "@/lib/dates"

const PTO_STATUSES = ["pending", "approved", "denied"] as const

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

    // Rejected rather than written through: an unrecognised status matches no
    // filter, so the request would vanish from every view in the admin UI.
    if (status !== undefined && !PTO_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${PTO_STATUSES.join(", ")}` },
        { status: 400 }
      )
    }

    const ptoRequest = await prisma.ptoRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        // Only stamped on a decision, so editing notes does not reattribute
        // who reviewed the request.
        ...(status && { reviewedBy: session.user.name ?? session.user.email }),
      },
    })

    if (status === "approved" || status === "denied") {
      after(() =>
        notifyPtoApproval(
          ptoRequest.userName ?? ptoRequest.userEmail,
          formatDateOnly(ptoRequest.startDate),
          formatDateOnly(ptoRequest.endDate),
          status
        )
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PTO update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
