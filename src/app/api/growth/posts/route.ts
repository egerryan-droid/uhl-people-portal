import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, content, category, url } = body

    if (!title?.trim() || !content?.trim() || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required." },
        { status: 400 }
      )
    }

    const post = await prisma.trainingPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
        url: url || null,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Training post error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
