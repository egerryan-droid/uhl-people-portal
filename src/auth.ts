import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      })
      session.user.role = dbUser?.role ?? "employee"
      session.user.id = user.id
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
})
