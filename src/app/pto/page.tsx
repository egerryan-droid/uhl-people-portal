import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { PtoClient } from "./pto-client"

export default async function PtoPage() {
  const session = await auth()

  let myRequests: {
    id: string
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
    if (session?.user?.email) {
      myRequests = await prisma.ptoRequest.findMany({
        where: { userEmail: session.user.email },
        orderBy: { createdAt: "desc" },
      })
    }
  } catch {
    // DB might not be connected
  }

  return <PtoClient myRequests={myRequests} />
}
