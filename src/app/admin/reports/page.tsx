import { prisma } from "@/lib/db"
import { AdminReportsList } from "./reports-list"

export default async function AdminReportsPage() {
  let reports: {
    id: string
    reportDate: Date
    category: string
    description: string
    status: string
    adminNotes: string | null
    referenceId: string
    updatedAt: Date
  }[] = []

  try {
    reports = await prisma.anonymousReport.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // DB might not be connected
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Anonymous Reports
        </h1>
        <p className="text-muted-foreground">
          Manage anonymous workplace reports. Reporter identity is not stored.
        </p>
      </div>
      <AdminReportsList initialReports={reports} />
    </div>
  )
}
