import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    return null
  }
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ announcements })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { title, content } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: { title: title.trim(), content: content.trim() },
  })

  return NextResponse.json({ announcement })
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { id, active, title, content } = body

  await prisma.announcement.update({
    where: { id },
    data: {
      ...(active !== undefined && { active }),
      ...(title && { title }),
      ...(content && { content }),
    },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  await prisma.announcement.delete({ where: { id: body.id } })

  return NextResponse.json({ success: true })
}
