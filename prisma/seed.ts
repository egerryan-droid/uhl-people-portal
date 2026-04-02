import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Seed admin users — these will be matched by email when they first sign in via Google
  const admins = [
    { email: "ryan@usahomelistings.com", name: "Ryan Eger", role: "admin" },
    { email: "eric@usahomelistings.com", name: "Eric Wirks", role: "admin" },
  ]

  for (const admin of admins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: admin.role },
      create: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
    console.log(`Seeded admin: ${admin.name} (${admin.email})`)
  }

  // Seed a welcome announcement
  await prisma.announcement.upsert({
    where: { id: "welcome-announcement" },
    update: {},
    create: {
      id: "welcome-announcement",
      title: "Welcome to the UHL People Portal!",
      content:
        "This is your new one-stop hub for company policies, benefits information, quick links to tools, and more. We're launching in alpha — your feedback helps us improve. Use the Feedback page to share your thoughts!",
      active: true,
    },
  })
  console.log("Seeded welcome announcement")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
