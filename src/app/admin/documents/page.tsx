"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Trash2, Upload, FileText } from "lucide-react"
import { toast } from "sonner"

interface Doc {
  id: string
  title: string
  description: string | null
  category: string
  fileName: string
  visibility: string
  uploadedAt: string
}

const categories = ["hr", "benefits", "agreements", "other"]
const visibilities = [
  { value: "all", label: "All employees" },
  { value: "sales", label: "Sales team" },
  { value: "cs", label: "CS team" },
  { value: "admin", label: "Admins only" },
]

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("hr")
  const [visibility, setVisibility] = useState("all")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then((data) => setDocs(data.documents ?? []))
      .catch(() => toast.error("Failed to load documents"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("category", category)
      formData.append("visibility", visibility)

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error()

      const data = await res.json()
      setDocs((prev) => [data.document, ...prev])
      setTitle("")
      setDescription("")
      setFile(null)
      toast.success("Document uploaded")
    } catch {
      toast.error("Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const deleteDoc = async (id: string) => {
    try {
      await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setDocs((prev) => prev.filter((d) => d.id !== id))
      toast.success("Document deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Manage Documents
        </h1>
        <p className="text-muted-foreground">
          Upload and manage documents in the employee document library.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v ?? visibility)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilities.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" disabled={!file || !title.trim() || uploading}>
              <Upload className="mr-1 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : (
          docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4 py-3">
                <FileText className="h-6 w-6 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.fileName} &middot; {doc.category} &middot; {doc.visibility}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDoc(doc.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
