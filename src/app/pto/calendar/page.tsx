import { PtoCalendar } from "@/components/pto-calendar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PtoCalendarPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pto">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            PTO Calendar
          </h1>
          <p className="text-muted-foreground">
            See who is out. Admins see all team PTO; employees see their own.
          </p>
        </div>
      </div>

      <PtoCalendar />
    </div>
  )
}
