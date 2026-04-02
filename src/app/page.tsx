import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import {
  BookOpen,
  Heart,
  ShieldAlert,
  ExternalLink,
  FileText,
  Building2,
  MessageSquare,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const quickActions = [
  {
    href: "/handbook",
    label: "Employee Handbook",
    description: "Browse policies, PTO, leave, and more",
    icon: BookOpen,
  },
  {
    href: "/benefits",
    label: "Benefits",
    description: "Medical plans, 401(k), dental, vision",
    icon: Heart,
  },
  {
    href: "/report",
    label: "Anonymous Report",
    description: "Submit a confidential workplace concern",
    icon: ShieldAlert,
  },
  {
    href: "/tools",
    label: "Quick Links",
    description: "ADP, 15Five, Monday.com, and more",
    icon: ExternalLink,
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Download handbooks and forms",
    icon: FileText,
  },
  {
    href: "/company",
    label: "Company Info",
    description: "Holidays, contacts, values",
    icon: Building2,
  },
  {
    href: "/feedback",
    label: "Feedback",
    description: "Share suggestions and ideas",
    icon: MessageSquare,
  },
]

const values = ["Ownership", "Transparency", "Results", "Growth", "Trust"]

export default async function DashboardPage() {
  const session = await auth()
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  let announcements: {
    id: string
    title: string
    content: string
    createdAt: Date
  }[] = []
  try {
    announcements = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    })
  } catch {
    // DB may not be connected yet during initial setup
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Your hub for policies, benefits, and company resources.
        </p>
      </div>

      {announcements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            Announcements
          </h2>
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{action.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Our values:
        </span>
        {values.map((v) => (
          <Badge key={v} variant="secondary">
            {v}
          </Badge>
        ))}
      </div>
    </div>
  )
}
