import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const documents = await prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
  })

  return NextResponse.json({ documents })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || null
    const category = formData.get("category") as string
    const visibility = formData.get("visibility") as string

    if (!file || !title) {
      return NextResponse.json({ error: "File and title required" }, { status: 400 })
    }

    // For now, store as a data URL or placeholder
    // In production, use Vercel Blob: const blob = await put(file.name, file, { access: 'public' })
    const fileUrl = `/api/admin/documents/placeholder/${encodeURIComponent(file.name)}`

    const document = await prisma.document.create({
      data: {
        title,
        description,
        category,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        visibility,
      },
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  await prisma.document.delete({ where: { id: body.id } })

  return NextResponse.json({ success: true })
}
