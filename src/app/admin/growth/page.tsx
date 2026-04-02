import { prisma } from "@/lib/db"
import { AdminGrowthList } from "./admin-growth-list"

export default async function AdminGrowthPage() {
  let requests: {
    id: string
    userName: string | null
    userEmail: string
    title: string
    description: string
    amount: number
    category: string
    url: string | null
    status: string
    adminNotes: string | null
    createdAt: Date
  }[] = []

  try {
    requests = await prisma.devBenefitRequest.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // DB might not be connected
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Development Benefit Requests
        </h1>
        <p className="text-muted-foreground">
          Review and approve employee professional development benefit requests
          ($2,000/year per employee).
        </p>
      </div>
      <AdminGrowthList initialRequests={requests} />
    </div>
  )
}
