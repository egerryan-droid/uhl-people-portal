"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try again or contact Ryan Eger
            if the problem persists.
          </p>
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  )
}
