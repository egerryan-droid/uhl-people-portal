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

  const holidays = await prisma.holiday.findMany({
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ holidays })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, date, year } = body

    if (!name || !date) {
      return NextResponse.json({ error: "Name and date required" }, { status: 400 })
    }

    const holiday = await prisma.holiday.create({
      data: { name, date, year: year ?? 2026 },
    })

    return NextResponse.json({ holiday })
  } catch (error) {
    console.error("Holiday create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  await prisma.holiday.delete({ where: { id: body.id } })

  return NextResponse.json({ success: true })
}
