export interface TrainingResource {
  id: string
  title: string
  description: string
  type: "video" | "book" | "course" | "article" | "tool"
  url: string
  category: string
  addedBy?: string
}

export interface AdminTrainingPost {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
}

export const resourceCategories = [
  "Sales & Business Development",
  "Customer Success",
  "Leadership & Management",
  "SaaS & Product",
  "Marketing",
  "Technical Skills",
  "Communication",
  "Personal Development",
]

export const youtubeVideos: TrainingResource[] = [
  {
    id: "yt-1",
    title: "How to Build a Winning SaaS Sales Team",
    description: "Framework for hiring, onboarding, and scaling a SaaS sales org from 3 to 20 reps.",
    type: "video",
    url: "https://www.youtube.com/results?search_query=building+saas+sales+team",
    category: "Sales & Business Development",
  },
  {
    id: "yt-2",
    title: "Customer Success Strategy for SaaS",
    description: "Best practices for onboarding, retention, expansion, and reducing churn.",
    type: "video",
    url: "https://www.youtube.com/results?search_query=customer+success+strategy+saas",
    category: "Customer Success",
  },
  {
    id: "yt-3",
    title: "The Art of Consultative Selling",
    description: "How to move from transactional selling to trusted advisor relationships.",
    type: "video",
    url: "https://www.youtube.com/results?search_query=consultative+selling+b2b",
    category: "Sales & Business Development",
  },
  {
    id: "yt-4",
    title: "Remote Team Leadership",
    description: "Managing distributed teams effectively — communication, accountability, and culture.",
    type: "video",
    url: "https://www.youtube.com/results?search_query=remote+team+leadership+management",
    category: "Leadership & Management",
  },
  {
    id: "yt-5",
    title: "OKR Goal Setting Masterclass",
    description: "How to set and track Objectives and Key Results that drive real outcomes.",
    type: "video",
    url: "https://www.youtube.com/results?search_query=okr+goal+setting+masterclass",
    category: "Leadership & Management",
  },
]

export const amazonBooks: TrainingResource[] = [
  {
    id: "book-1",
    title: "The Challenger Sale",
    description: "Why the best salespeople don't just build relationships — they challenge customers to think differently.",
    type: "book",
    url: "https://www.amazon.com/dp/1591844355",
    category: "Sales & Business Development",
  },
  {
    id: "book-2",
    title: "Customer Success: How Innovative Companies Are Reducing Churn",
    description: "The definitive guide to building a customer success organization that drives retention and growth.",
    type: "book",
    url: "https://www.amazon.com/dp/1119167965",
    category: "Customer Success",
  },
  {
    id: "book-3",
    title: "Radical Candor",
    description: "How to be a great boss without losing your humanity — caring personally while challenging directly.",
    type: "book",
    url: "https://www.amazon.com/dp/1250235375",
    category: "Leadership & Management",
  },
  {
    id: "book-4",
    title: "Obviously Awesome",
    description: "How to nail product positioning so customers get it, want it, and buy it.",
    type: "book",
    url: "https://www.amazon.com/dp/1999023005",
    category: "SaaS & Product",
  },
  {
    id: "book-5",
    title: "Measure What Matters",
    description: "John Doerr's guide to OKRs — the goal-setting system that drives alignment and results.",
    type: "book",
    url: "https://www.amazon.com/dp/0525536221",
    category: "Leadership & Management",
  },
  {
    id: "book-6",
    title: "Never Split the Difference",
    description: "Negotiation tactics from a former FBI hostage negotiator — applicable to sales, deals, and daily life.",
    type: "book",
    url: "https://www.amazon.com/dp/0062407805",
    category: "Sales & Business Development",
  },
  {
    id: "book-7",
    title: "Atomic Habits",
    description: "Small changes, remarkable results — a proven framework for building good habits and breaking bad ones.",
    type: "book",
    url: "https://www.amazon.com/dp/0735211299",
    category: "Personal Development",
  },
  {
    id: "book-8",
    title: "The Hard Thing About Hard Things",
    description: "Ben Horowitz on the real challenges of running a startup — no sugarcoating.",
    type: "book",
    url: "https://www.amazon.com/dp/0062273205",
    category: "Leadership & Management",
  },
]
