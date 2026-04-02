"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Send } from "lucide-react"
import { toast } from "sonner"

interface TicketDetailClientProps {
  ticketId: string
  isAdmin: boolean
}

export function TicketDetailClient({
  ticketId,
  isAdmin,
}: TicketDetailClientProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [internal, setInternal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, internal: isAdmin ? internal : false }),
      })

      if (!res.ok) throw new Error("Failed to post comment")

      setMessage("")
      setInternal(false)
      toast.success("Comment posted")
      router.refresh()
    } catch {
      toast.error("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add a response</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response..."
            rows={3}
          />

          <div className="flex items-center justify-between">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={internal}
                  onCheckedChange={(checked: boolean) => setInternal(checked)}
                />
                <Label className="text-xs text-muted-foreground">
                  Internal note (not visible to employee)
                </Label>
              </div>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || submitting}
              className="ml-auto"
            >
              <Send className="mr-1 h-3 w-3" />
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
