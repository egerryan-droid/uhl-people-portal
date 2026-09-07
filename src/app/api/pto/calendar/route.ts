import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const now = new Date()
  const year = Number(searchParams.get("year") ?? now.getUTCFullYear())
  const month = Number(searchParams.get("month") ?? now.getUTCMonth() + 1)

  // Rejected explicitly: a non-numeric param used to become NaN, then an
  // Invalid Date, then an opaque 500 out of Prisma.
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    year < 1970 ||
    year > 2200 ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json(
      { error: "year and month must be integers (month 1-12)." },
      { status: 400 }
    )
  }

  // Built in UTC to match the `@db.Date` columns, which are stored at UTC
  // midnight. Local construction only agreed with them on a UTC host.
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1))
  const endOfMonth = new Date(Date.UTC(year, month, 0))

  try {
    const isAdmin = session.user.role === "admin"

    const requests = await prisma.ptoRequest.findMany({
      where: {
        ...(!isAdmin && { userEmail: session.user.email! }),
        status: { in: ["approved", "pending"] },
        startDate: { lte: endOfMonth },
        endDate: { gte: startOfMonth },
      },
      select: {
        id: true,
        userName: true,
        userEmail: true,
        startDate: true,
        endDate: true,
        status: true,
      },
      orderBy: { startDate: "asc" },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("PTO calendar error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
