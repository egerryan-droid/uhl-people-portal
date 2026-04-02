import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

const defaultTasks = [
  { title: "Complete I-9 and W-4 in ADP", category: "before-start", order: 0 },
  { title: "Sign offer letter and restrictive covenant", category: "before-start", order: 1 },
  { title: "Set up Google Workspace account", category: "before-start", order: 2 },
  { title: "Attend orientation with Ryan", category: "first-day", order: 0 },
  { title: "Set up Slack and join channels", category: "first-day", order: 1 },
  { title: "Review Employee Handbook in People Portal", category: "first-day", order: 2 },
  { title: "Set up equipment via Electric", category: "first-day", order: 3 },
  { title: "Complete 15Five profile", category: "first-week", order: 0 },
  { title: "Meet your team members", category: "first-week", order: 1 },
  { title: "Review your role's OKRs with manager", category: "first-week", order: 2 },
  { title: "Set up Monday.com access", category: "first-week", order: 3 },
  { title: "Complete benefits enrollment in ADP", category: "first-month", order: 0 },
  { title: "Set up 401(k) via TAG Resources", category: "first-month", order: 1 },
  { title: "Submit first 15Five check-in", category: "first-month", order: 2 },
  { title: "Complete any role-specific training", category: "first-month", order: 3 },
]

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

    // Fall back to defaults if no tasks in DB
    if (tasks.length === 0) {
      tasks = defaultTasks.map((t, i) => ({
        id: `default-${i}`,
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

    const progressMap: Record<string, boolean> = {}
    for (const p of progress) {
      progressMap[p.taskId] = p.completed
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

    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
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
