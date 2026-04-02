"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Video,
  BookOpen,
  GraduationCap,
  DollarSign,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Megaphone,
} from "lucide-react"
import { toast } from "sonner"
import type { TrainingResource } from "@/data/growth"
import { resourceCategories } from "@/data/growth"

interface GrowthClientProps {
  trainingPosts: {
    id: string
    title: string
    content: string
    category: string
    url: string | null
    createdAt: Date
  }[]
  myRequests: {
    id: string
    title: string
    amount: number
    category: string
    status: string
    createdAt: Date
  }[]
  youtubeVideos: TrainingResource[]
  amazonBooks: TrainingResource[]
  isAdmin: boolean
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 text-yellow-500" />,
  approved: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  denied: <XCircle className="h-3 w-3 text-red-500" />,
}

export function GrowthClient({
  trainingPosts,
  myRequests,
  youtubeVideos,
  amazonBooks,
  isAdmin,
}: GrowthClientProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Growth & Training
        </h1>
        <p className="text-muted-foreground">
          Invest in your development. UHL provides $2,000/year for courses,
          books, certifications, and conferences — plus a quarterly book benefit.
        </p>
      </div>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="py-3 flex items-start gap-3">
          <DollarSign className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium">
              $2,000 Professional Development Benefit
            </p>
            <p className="text-xs text-muted-foreground">
              Use it for courses, certifications, conferences, books, and
              learning resources. Submit a request below to get approval before
              purchasing.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="resources">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="training">From Leadership</TabsTrigger>
          <TabsTrigger value="request">Request Benefit</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6 mt-4">
          {/* YouTube Videos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-medium uppercase text-muted-foreground">
                Recommended Videos
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{video.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {video.description}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground mt-1" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px]"
                      >
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          <Separator />

          {/* Amazon Bookshelf */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-medium uppercase text-muted-foreground">
                Recommended Reading
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {amazonBooks.map((book) => (
                <a
                  key={book.id}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{book.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {book.description}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground mt-1" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px]"
                      >
                        {book.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium uppercase text-muted-foreground">
              Training & Development Posts
            </h2>
          </div>

          {trainingPosts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No training posts yet. Leadership will share resources here.
                </p>
              </CardContent>
            </Card>
          ) : (
            trainingPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {post.category}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Resource
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {isAdmin && <AdminPostForm />}
        </TabsContent>

        <TabsContent value="request" className="mt-4">
          <BenefitRequestForm />
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4 mt-4">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            Your Benefit Requests
          </h2>
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No requests submitted yet.
              </CardContent>
            </Card>
          ) : (
            myRequests.map((req) => (
              <Card key={req.id}>
                <CardContent className="flex items-center gap-4 py-3">
                  {statusIcons[req.status]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{req.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.category} &middot;{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${req.amount.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        req.status === "approved"
                          ? "default"
                          : req.status === "denied"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BenefitRequestForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !amount || !category) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/growth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          category,
          url: url || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success("Request submitted! HR will review it.")
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <p className="mt-3 text-sm font-medium">Request Submitted</p>
          <p className="text-xs text-muted-foreground mt-1">
            HR will review your request and follow up. Check the &quot;My
            Requests&quot; tab for status updates.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSubmitted(false)
              setTitle("")
              setDescription("")
              setAmount("")
              setCategory("")
              setUrl("")
            }}
          >
            Submit another
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Request Professional Development Benefit
        </CardTitle>
        <CardDescription>
          Submit a request to use your $2,000 annual professional development
          benefit. Get approval before purchasing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>What do you want to use the benefit for?</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AWS Solutions Architect certification"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Course / Certification",
                    "Conference / Event",
                    "Book",
                    "Software / Tool",
                    "Other",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Why is this valuable for your role?</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how this will help you grow in your role..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Link (optional)
            </Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              !title.trim() ||
              !description.trim() ||
              !amount ||
              !category ||
              submitting
            }
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AdminPostForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/growth/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, url: url || undefined }),
      })
      if (!res.ok) throw new Error()
      toast.success("Training post published!")
      setTitle("")
      setContent("")
      setCategory("")
      setUrl("")
      window.location.reload()
    } catch {
      toast.error("Failed to publish post.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Post Training Content</CardTitle>
        <CardDescription>
          Share training resources, tips, or development opportunities with the
          team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
          <Select
            value={category}
            onValueChange={(val) => setCategory(val ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category..." />
            </SelectTrigger>
            <SelectContent>
              {resourceCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share training info, tips, or recommendations..."
            rows={4}
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Link (optional)"
          />
          <Button type="submit" disabled={!title.trim() || !content.trim() || !category || submitting}>
            <Plus className="mr-1 h-4 w-4" />
            {submitting ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
