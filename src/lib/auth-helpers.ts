import { auth } from "@/auth"

export async function getSession() {
  return await auth()
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return session
}

export function isAdmin(role?: string) {
  return role === "admin"
}

export function isManager(role?: string) {
  return role === "manager" || role === "admin"
}
