"use client"

import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import { signOut } from "next-auth/react"

interface AppHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Sheet>
        <SheetTrigger >
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar userRole={user?.role} />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
