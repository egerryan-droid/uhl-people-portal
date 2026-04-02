import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      profile: profile ?? null,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      state,
      phone,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      startDate,
      birthday,
      pronouns,
      timezone,
    } = body

    const profile = await prisma.employeeProfile.upsert({
      where: { userId: session.user.id },
      update: {
        state,
        phone,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        startDate,
        birthday,
        pronouns,
        timezone,
      },
      create: {
        userId: session.user.id,
        state,
        phone,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        startDate,
        birthday,
        pronouns,
        timezone,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
