import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { GrowthClient } from "./growth-client"
import { youtubeVideos, amazonBooks } from "@/data/growth"

export default async function GrowthPage() {
  const session = await auth()

  let trainingPosts: {
    id: string
    title: string
    content: string
    category: string
    url: string | null
    createdAt: Date
  }[] = []

  let myRequests: {
    id: string
    title: string
    amount: number
    category: string
    status: string
    createdAt: Date
  }[] = []

  try {
    trainingPosts = await prisma.trainingPost.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    })

    if (session?.user?.email) {
      myRequests = await prisma.devBenefitRequest.findMany({
        where: { userEmail: session.user.email },
        orderBy: { createdAt: "desc" },
      })
    }
  } catch {
    // DB might not be connected
  }

  return (
    <GrowthClient
      trainingPosts={trainingPosts}
      myRequests={myRequests}
      youtubeVideos={youtubeVideos}
      amazonBooks={amazonBooks}
      isAdmin={session?.user?.role === "admin"}
    />
  )
}
