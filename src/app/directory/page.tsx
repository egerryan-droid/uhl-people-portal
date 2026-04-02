import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Users } from "lucide-react"
import { teamDirectory, departments } from "@/data/directory"

const departmentIcons: Record<string, string> = {
  Leadership: "👑",
  Sales: "📈",
  Engineering: "⚙️",
  "Customer Success": "🤝",
  Marketing: "📣",
  "Operations & Support": "🔧",
}

export default function DirectoryPage() {
  const grouped = departments.map((dept) => ({
    name: dept,
    icon: departmentIcons[dept] ?? "📁",
    members: teamDirectory.filter((m) => m.department === dept),
  }))

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Team Directory
        </h1>
        <p className="text-muted-foreground">
          {teamDirectory.length} team members across {departments.length}{" "}
          departments.
        </p>
      </div>

      {grouped.map((dept) => (
        <div key={dept.name} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{dept.icon}</span>
            <h2 className="text-sm font-medium uppercase text-muted-foreground">
              {dept.name}
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {dept.members.length}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dept.members.map((member) => (
              <Card key={member.email} className="h-full">
                <CardContent className="py-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                    {member.reportsTo && (
                      <p className="text-[10px] text-muted-foreground">
                        Reports to {member.reportsTo}
                      </p>
                    )}
                    {member.type === "Contractor" && (
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                      >
                        Contractor
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
