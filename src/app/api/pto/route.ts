import { NextResponse, after } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notifyPtoRequested } from "@/lib/slack"
import {
  businessDaysBetween,
  dateKeyToUtcDate,
  isValidDateKey,
} from "@/lib/dates"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { startDate, endDate, reason } = body

    // Validated as calendar-day keys. Previously an unparseable date became an
    // Invalid Date, slipped past the `end < start` guard because NaN
    // comparisons are false, and surfaced as an opaque 500 from Prisma.
    if (!isValidDateKey(startDate) || !isValidDateKey(endDate)) {
      return NextResponse.json(
        { error: "Start and end date must be valid dates (YYYY-MM-DD)." },
        { status: 400 }
      )
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 }
      )
    }

    // Derived here rather than taken from the request, so a hand-crafted body
    // cannot record a day count that disagrees with the dates.
    const totalDays = businessDaysBetween(startDate, endDate)

    if (totalDays < 2) {
      return NextResponse.json(
        { error: "Use this form for 2+ day absences. For single days, notify your manager directly." },
        { status: 400 }
      )
    }

    const start = dateKeyToUtcDate(startDate)
    const end = dateKeyToUtcDate(endDate)

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

    // Notify after the response so a slow Slack call never delays the submit.
    // The raw "YYYY-MM-DD" strings are passed through untouched to avoid the
    // UTC-vs-local shift that Date objects introduce for date-only values.
    after(() =>
      notifyPtoRequested({
        employeeName: session.user.name ?? session.user.email!,
        startDate,
        endDate,
        totalDays,
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PTO request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
