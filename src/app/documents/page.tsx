import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  FileSignature,
  Users,
  ArrowRight,
} from "lucide-react"

const categoryLabels: Record<string, string> = {
  hr: "HR & Policies",
  benefits: "Benefits",
  agreements: "Agreements",
  other: "Other",
}

export default async function DocumentsPage() {
  const session = await auth()

  let documents: {
    id: string
    title: string
    description: string | null
    category: string
    fileUrl: string
    fileName: string
    fileSize: number | null
    visibility: string
    uploadedAt: Date
  }[] = []

  try {
    documents = await prisma.document.findMany({
      where: {
        OR: [
          { visibility: "all" },
          ...(session?.user?.role === "admin"
            ? [{ visibility: "admin" }]
            : []),
        ],
      },
      orderBy: { category: "asc" },
    })
  } catch {
    // DB might not be connected
  }

  const grouped = documents.reduce(
    (acc, doc) => {
      const cat = doc.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(doc)
      return acc
    },
    {} as Record<string, typeof documents>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Company handbooks, agreements, role descriptions, and forms.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/documents/agreements">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <FileSignature className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    Agreements & Templates
                  </CardTitle>
                  <CardDescription>
                    Offer letters, restrictive covenants, bonus plan
                  </CardDescription>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Review the standard documents you signed when joining UHL.
                Blank templates available for reference.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/documents/roles">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    Role Descriptions
                  </CardTitle>
                  <CardDescription>
                    Current team roles and responsibilities
                  </CardDescription>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Browse job descriptions for all team positions.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Uploaded Documents */}
      {Object.keys(grouped).length > 0 && (
        <>
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            Uploaded Documents
          </h2>
          {Object.entries(grouped).map(([category, docs]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {categoryLabels[category] ?? category}
              </h3>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="transition-colors hover:bg-accent/50">
                      <CardContent className="flex items-center gap-4 py-3">
                        <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {doc.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.fileSize && (
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(doc.fileSize)}
                            </span>
                          )}
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
