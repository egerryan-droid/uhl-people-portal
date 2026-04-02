import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Clock, Plane } from "lucide-react"
import { prisma } from "@/lib/db"

const defaultHolidays = [
  { name: "New Year's Day", date: "January 1" },
  { name: "Memorial Day", date: "Last Monday in May" },
  { name: "Independence Day", date: "July 4" },
  { name: "Labor Day", date: "First Monday in September" },
  { name: "Thanksgiving Day", date: "Fourth Thursday in November" },
  { name: "Christmas Day", date: "December 25" },
]

const values = [
  {
    name: "Ownership",
    description: "We take responsibility for our work and outcomes.",
  },
  {
    name: "Transparency",
    description: "We communicate openly and honestly.",
  },
  {
    name: "Results",
    description: "We focus on delivering measurable impact.",
  },
  {
    name: "Growth",
    description: "We invest in continuous learning and development.",
  },
  {
    name: "Trust",
    description: "We build trust through consistency and integrity.",
  },
]

export default async function CompanyPage() {
  let holidays = defaultHolidays
  try {
    const dbHolidays = await prisma.holiday.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    })
    if (dbHolidays.length > 0) {
      holidays = dbHolidays.map((h) => ({ name: h.name, date: h.date }))
    }
  } catch {
    // Fall back to hardcoded list
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Company</h1>
        <p className="text-muted-foreground">
          USA Home Listings culture, holidays, and key contacts.
        </p>
      </div>

      {/* Values */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase text-muted-foreground">
          Our Values
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <Card key={v.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{v.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{v.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Holidays */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            2026 Company Holidays
          </h2>
        </div>
        <Card>
          <CardContent className="py-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {holidays.map((h) => (
                <div
                  key={h.name}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted"
                >
                  <span className="text-sm font-medium">{h.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {h.date}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              UHL also supports personal observances for religious and cultural
              holidays. Speak with your manager to arrange time off.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Contacts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            Key Contacts
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ryan Eger</CardTitle>
              <CardDescription>Chief of Staff / CSO</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Primary HR contact for accommodations, personnel files,
                workplace reporting, employment verification, benefits
                questions, and all day-to-day HR matters.
              </p>
              <p className="mt-2 text-sm">ryan@usahomelistings.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Eric Wirks</CardTitle>
              <CardDescription>CEO</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Escalation contact if a concern involves Ryan or if Ryan is
                unavailable.
              </p>
              <p className="mt-2 text-sm">eric@usahomelistings.com</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* PTO Quick Reference */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            PTO Quick Reference
          </h2>
        </div>
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Flexible PTO</p>
                <p className="text-xs text-muted-foreground">
                  Not accrued — take what you need, within guidelines
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Minimum 15 days/year</p>
                <p className="text-xs text-muted-foreground">
                  Including at least 5 consecutive days
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">1-2 days off</p>
                <p className="text-xs text-muted-foreground">
                  3 days notice required
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">3+ days off</p>
                <p className="text-xs text-muted-foreground">
                  2 weeks notice required
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Extended vacations (5+ days) require 90 days of employment unless
              pre-approved. Sick leave is unlimited and requires notification
              only, not approval.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Travel Quick Reference */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            Travel & Expenses
          </h2>
        </div>
        <Card>
          <CardContent className="py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Per diem</p>
                <p className="text-xs text-muted-foreground">$100/day</p>
              </div>
              <div>
                <p className="text-sm font-medium">Receipt deadline</p>
                <p className="text-xs text-muted-foreground">
                  Within 14 days of travel via Dext
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
