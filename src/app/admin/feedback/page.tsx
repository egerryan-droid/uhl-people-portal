import { prisma } from "@/lib/db"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminFeedbackPage() {
  let feedback: {
    id: string
    userEmail: string
    userName: string | null
    category: string
    message: string
    status: string
    createdAt: Date
  }[] = []

  try {
    feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // DB might not be connected
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Employee Feedback
        </h1>
        <p className="text-muted-foreground">
          View all feedback and suggestions submitted by employees.
        </p>
      </div>

      {feedback.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No feedback submitted yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {f.userName ?? f.userEmail}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-md">
                    {f.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
