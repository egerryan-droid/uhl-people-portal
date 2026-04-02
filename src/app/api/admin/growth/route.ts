import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notifyBenefitRequestUpdate } from "@/lib/slack"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const requests = await prisma.devBenefitRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ requests })
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    const benefitRequest = await prisma.devBenefitRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    })

    if (status === "approved" || status === "denied") {
      notifyBenefitRequestUpdate(
        benefitRequest.title,
        status,
        benefitRequest.userName ?? benefitRequest.userEmail
      ).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Benefit request update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
