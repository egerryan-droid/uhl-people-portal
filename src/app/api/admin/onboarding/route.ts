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

  const tasks = await prisma.onboardingTask.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  })

  return NextResponse.json({ tasks })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, description, category, order } = body

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category required" }, { status: 400 })
    }

    const task = await prisma.onboardingTask.create({
      data: {
        title,
        description: description || null,
        category,
        order: order ?? 0,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Onboarding task create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  await prisma.onboardingTask.delete({ where: { id: body.id } })

  return NextResponse.json({ success: true })
}
