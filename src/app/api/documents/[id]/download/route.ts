import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { get } from "@vercel/blob"

// Blobs are stored with `access: "private"`, so they cannot be linked directly.
// Every download is brokered here, where the session and the document's
// visibility are checked before any bytes are streamed. Linking straight to the
// blob URL previously left HR documents readable by anyone who guessed a
// filename, because `visibility` only ever filtered the listing page.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const doc = await prisma.document.findUnique({ where: { id } })
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const isAdmin = session.user.role === "admin"
  if (doc.visibility !== "all" && !isAdmin) {
    // 404 rather than 403: a 403 would confirm the document exists.
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const result = await get(doc.fileUrl, { access: "private" })
    if (!result) {
      return NextResponse.json({ error: "File missing" }, { status: 404 })
    }

    const filename = doc.fileName.replace(/"/g, "")
    return new Response(result.stream, {
      headers: {
        "Content-Type":
          result.headers?.get("content-type") ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        // Private material must not be retained by shared caches.
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Document download error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
