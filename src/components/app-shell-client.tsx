"use client"

import { SessionProvider } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

interface AppShellClientProps {
  children: React.ReactNode
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
  }
}

export function AppShellClient({ children, user }: AppShellClientProps) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <AppSidebar userRole={user.role} />
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader user={user} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
