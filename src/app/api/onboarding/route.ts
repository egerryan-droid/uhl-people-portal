import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

import { defaultOnboardingTasks } from "@/data/onboarding-tasks"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    let tasks = await prisma.onboardingTask.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    })

    // Bootstrap only: `npm run db:seed` writes these same ids, so this fires
    // just on an unseeded database. Because the ids match, progress recorded
    // against the fallback stays valid once the rows exist.
    if (tasks.length === 0) {
      tasks = defaultOnboardingTasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: null,
        category: t.category,
        order: t.order,
        active: true,
      }))
    }

    const progress = await prisma.onboardingProgress.findMany({
      where: { userId: session.user.id },
    })

    // Restricted to the tasks actually being returned. Progress rows for
    // deleted or deactivated tasks would otherwise inflate the completion
    // count, which could read above 100% and claim "all tasks complete".
    const visibleTaskIds = new Set(tasks.map((t) => t.id))
    const progressMap: Record<string, boolean> = {}
    for (const p of progress) {
      if (visibleTaskIds.has(p.taskId)) {
        progressMap[p.taskId] = p.completed
      }
    }

    return NextResponse.json({ tasks, progress: progressMap })
  } catch (error) {
    console.error("Onboarding fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { taskId, completed } = body

    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "completed must be a boolean" },
        { status: 400 }
      )
    }

    // Checked against the real task set so arbitrary ids cannot accumulate
    // junk progress rows. The seeded defaults are covered by this.
    const task = await prisma.onboardingTask.findUnique({
      where: { id: taskId },
    })
    const isKnownDefault = defaultOnboardingTasks.some((t) => t.id === taskId)
    if (!task && !isKnownDefault) {
      return NextResponse.json({ error: "Unknown task" }, { status: 404 })
    }

    await prisma.onboardingProgress.upsert({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        userEmail: session.user.email,
        taskId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
