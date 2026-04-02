import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get("year") ?? new Date().getFullYear().toString())
  const month = parseInt(searchParams.get("month") ?? (new Date().getMonth() + 1).toString())

  // Get first/last day of month for filtering
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0) // last day of month

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
