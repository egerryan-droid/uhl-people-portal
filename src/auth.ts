import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          hd: "usahomelistings.com",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email?.endsWith("@usahomelistings.com") ?? false
    },
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: look up role from DB
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        })
        token.role = dbUser?.role ?? "employee"
        token.id = dbUser?.id ?? user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = (token.role as string) ?? "employee"
      session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
})
