import { prisma } from "@/lib/db"
import { AdminPtoList } from "./admin-pto-list"

export default async function AdminPtoPage() {
  let requests: {
    id: string
    userName: string | null
    userEmail: string
    startDate: Date
    endDate: Date
    totalDays: number
    reason: string | null
    status: string
    adminNotes: string | null
    reviewedBy: string | null
    createdAt: Date
  }[] = []

  try {
    requests = await prisma.ptoRequest.findMany({
      orderBy: { startDate: "asc" },
    })
  } catch {}

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">PTO Requests</h1>
        <p className="text-muted-foreground">
          Review and approve employee time-off requests.
        </p>
      </div>
      <AdminPtoList initialRequests={requests} />
    </div>
  )
}
