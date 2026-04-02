import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import crypto from "crypto"

function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = crypto.randomBytes(8)
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length]
  }
  return result
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, description } = body

    if (!category || !description || description.length < 20) {
      return NextResponse.json(
        { error: "Category and description (min 20 chars) are required." },
        { status: 400 }
      )
    }

    const referenceId = generateReferenceId()

    await prisma.anonymousReport.create({
      data: {
        reportDate: new Date(),
        category,
        description,
        status: "new",
        referenceId,
      },
    })

    // Return ONLY the reference ID — no other data
    return NextResponse.json({ referenceId })
  } catch (error) {
    console.error("Report submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
