import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { put, del } from "@vercel/blob"

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

    const blob = await put(file.name, file, { access: "public" })
    const fileUrl = blob.url

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

  // Clean up the blob before deleting from DB
  const doc = await prisma.document.findUnique({ where: { id: body.id } })
  if (doc?.fileUrl) {
    try {
      await del(doc.fileUrl)
    } catch (e) {
      console.error("Failed to delete blob:", e)
    }
  }

  await prisma.document.delete({ where: { id: body.id } })

  return NextResponse.json({ success: true })
}
