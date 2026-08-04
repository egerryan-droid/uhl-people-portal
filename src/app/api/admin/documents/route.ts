import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { put, del } from "@vercel/blob"

const MAX_UPLOAD_BYTES = 25_000_000
const VISIBILITIES = ["all", "admin"] as const

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

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File must be under ${MAX_UPLOAD_BYTES / 1_000_000}MB.` },
        { status: 400 }
      )
    }

    if (!(VISIBILITIES as readonly string[]).includes(visibility)) {
      return NextResponse.json(
        { error: `visibility must be one of: ${VISIBILITIES.join(", ")}` },
        { status: 400 }
      )
    }

    // private: served only through /api/documents/[id]/download, which checks
    // the session and the document's visibility first.
    // addRandomSuffix: defaults to false in this SDK version, which made blob
    // URLs the raw filename — guessable — and made a repeat upload of the same
    // filename throw BlobAlreadyExistsError as an opaque 500.
    const blob = await put(file.name, file, {
      access: "private",
      addRandomSuffix: true,
    })
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

  try {
    const body = await request.json()
    if (!body?.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 })
    }

    const doc = await prisma.document.findUnique({ where: { id: body.id } })
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Row first: if the blob delete fails afterwards we leak a stored file,
    // which is recoverable. The reverse order leaves a listed document whose
    // download is permanently broken.
    await prisma.document.delete({ where: { id: body.id } })

    if (doc.fileUrl) {
      try {
        await del(doc.fileUrl)
      } catch (e) {
        console.error("Orphaned blob after document delete:", doc.fileUrl, e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Document delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
