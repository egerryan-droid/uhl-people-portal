export { auth as middleware } from "./src/auth"

export const config = {
  matcher: [
    "/((?!sign-in|report|api/report|api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
