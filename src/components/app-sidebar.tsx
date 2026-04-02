"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Heart,
  ShieldAlert,
  ExternalLink,
  FileText,
  Building2,
  MessageSquare,
  LayoutDashboard,
  Ticket,
  Settings,
  Megaphone,
  FolderOpen,
  ClipboardList,
  GraduationCap,
  DollarSign,
  CalendarDays,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/handbook", label: "Handbook", icon: BookOpen },
  { href: "/benefits", label: "Benefits", icon: Heart },
  { href: "/tools", label: "Quick Links", icon: ExternalLink },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/directory", label: "Team Directory", icon: Users },
  { href: "/pto", label: "Request PTO", icon: CalendarDays },
  { href: "/growth", label: "Growth & Training", icon: GraduationCap },
  { href: "/tickets", label: "HR Tickets", icon: Ticket },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
]

const reportNav = [
  { href: "/report", label: "Anonymous Report", icon: ShieldAlert },
]

const adminNav = [
  { href: "/admin/reports", label: "Manage Reports", icon: ClipboardList },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/documents", label: "Manage Docs", icon: FolderOpen },
  { href: "/admin/tickets", label: "Manage Tickets", icon: Ticket },
  { href: "/admin/pto", label: "PTO Requests", icon: CalendarDays },
  { href: "/admin/growth", label: "Dev Requests", icon: DollarSign },
  { href: "/admin/feedback", label: "View Feedback", icon: MessageSquare },
]

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}

export function AppSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <ScrollArea className="h-full py-4">
      <div className="flex flex-col gap-1 px-3">
        <div className="mb-2 flex items-center gap-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#042C53]">
            <span className="text-xs font-bold text-white">UHL</span>
          </div>
          <span className="font-semibold">People Portal</span>
        </div>

        <Separator className="mb-2" />

        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>

        <Separator className="my-2" />

        <p className="px-3 text-xs font-medium uppercase text-muted-foreground">
          Reporting
        </p>
        <nav className="flex flex-col gap-1">
          {reportNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>

        {userRole === "admin" && (
          <>
            <Separator className="my-2" />
            <p className="px-3 text-xs font-medium uppercase text-muted-foreground">
              Admin
            </p>
            <nav className="flex flex-col gap-1">
              {adminNav.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  isActive={isActive(item.href)}
                />
              ))}
            </nav>
          </>
        )}
      </div>
    </ScrollArea>
  )
}
