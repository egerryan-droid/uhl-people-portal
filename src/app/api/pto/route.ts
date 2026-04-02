import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { startDate, endDate, totalDays, reason } = body

    if (!startDate || !endDate || !totalDays) {
      return NextResponse.json(
        { error: "Start date, end date, and total days are required." },
        { status: 400 }
      )
    }

    if (totalDays < 2) {
      return NextResponse.json(
        { error: "Use this form for 2+ day absences. For single days, notify your manager directly." },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 }
      )
    }

    await prisma.ptoRequest.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        startDate: start,
        endDate: end,
        totalDays,
        reason: reason?.trim() || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PTO request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
