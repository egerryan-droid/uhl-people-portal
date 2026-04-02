import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
