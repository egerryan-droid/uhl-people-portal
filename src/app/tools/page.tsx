import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

const toolGroups = [
  {
    label: "Day-to-Day",
    tools: [
      {
        name: "Google Workspace",
        url: "https://workspace.google.com",
        description: "Email, Calendar, Drive, Meet",
      },
      {
        name: "Slack",
        url: "https://usahomelistings.slack.com",
        description: "Team messaging and channels",
      },
      {
        name: "Monday.com",
        url: "https://usahomelistings.monday.com",
        description: "Project management and task tracking",
      },
      {
        name: "HubSpot",
        url: "https://app.hubspot.com",
        description: "CRM, sales pipeline, customer management",
      },
    ],
  },
  {
    label: "HR & Payroll",
    tools: [
      {
        name: "ADP",
        url: "https://workforcenow.adp.com",
        description: "Payroll, paystubs, tax forms, direct deposit, benefits enrollment",
      },
      {
        name: "Dext",
        url: "https://app.dext.com",
        description: "Expense submission — upload receipts within 14 days of travel",
      },
    ],
  },
  {
    label: "Performance",
    tools: [
      {
        name: "15Five",
        url: "https://my.15five.com",
        description: "Performance reviews, check-ins, professional development tracking",
      },
    ],
  },
  {
    label: "IT Support",
    tools: [
      {
        name: "Electric",
        url: "https://electric.ai",
        description: "IT support, equipment requests, tech issues",
      },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quick Links</h1>
        <p className="text-muted-foreground">
          All your company tools in one place.
        </p>
      </div>

      {toolGroups.map((group) => (
        <div key={group.label} className="space-y-3">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
