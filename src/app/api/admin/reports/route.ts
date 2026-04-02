import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function PATCH(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json({ error: "Report ID required" }, { status: 400 })
    }

    await prisma.anonymousReport.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Report update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
