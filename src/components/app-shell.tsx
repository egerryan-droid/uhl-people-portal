import { auth } from "@/auth"
import { AppShellClient } from "./app-shell-client"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <AppShellClient user={session.user}>
      {children}
    </AppShellClient>
  )
}
