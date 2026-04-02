import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get("ref")

  if (!ref) {
    return NextResponse.json(
      { error: "Reference ID is required" },
      { status: 400 }
    )
  }

  try {
    const report = await prisma.anonymousReport.findUnique({
      where: { referenceId: ref.toUpperCase() },
      select: {
        status: true,
        category: true,
        reportDate: true,
        // Do NOT return description or admin notes to this endpoint
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: report.status,
      category: report.category,
      reportDate: report.reportDate.toISOString(),
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
