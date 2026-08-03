import { NextResponse, after } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notifyFeedbackSubmitted } from "@/lib/slack"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { category, message } = body

    if (!category || !message?.trim()) {
      return NextResponse.json(
        { error: "Category and message are required." },
        { status: 400 }
      )
    }

    await prisma.feedback.create({
      data: {
        userEmail: session.user.email,
        userName: session.user.name,
        category,
        message: message.trim(),
      },
    })

    after(() =>
      notifyFeedbackSubmitted({
        employeeName: session.user.name ?? session.user.email!,
        category,
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
