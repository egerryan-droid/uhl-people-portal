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
    const { title, description, amount, category, url } = body

    if (!title?.trim() || !description?.trim() || !amount || !category) {
      return NextResponse.json(
        { error: "Title, description, amount, and category are required." },
        { status: 400 }
      )
    }

    if (amount <= 0 || amount > 2000) {
      return NextResponse.json(
        { error: "Amount must be between $0 and $2,000." },
        { status: 400 }
      )
    }

    await prisma.devBenefitRequest.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        title: title.trim(),
        description: description.trim(),
        amount,
        category,
        url: url || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Benefit request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
