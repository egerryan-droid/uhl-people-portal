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

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ feedback })
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 })
    }

    await prisma.feedback.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
