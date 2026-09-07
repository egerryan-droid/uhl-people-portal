// Canonical onboarding checklist, shared by prisma/seed.ts and the onboarding
// API so the two can never drift apart.
//
// The ids are fixed and meaningful: the API used to synthesise these same
// "default-N" ids in memory whenever OnboardingTask was empty, and employees
// accumulated OnboardingProgress rows against them. Seeding real rows under the
// identical ids turns those existing progress rows into valid references
// instead of orphans, so no data migration is needed.

export interface DefaultOnboardingTask {
  id: string
  title: string
  category: "before-start" | "first-day" | "first-week" | "first-month"
  order: number
}

export const defaultOnboardingTasks: DefaultOnboardingTask[] = [
  { id: "default-0", title: "Complete I-9 and W-4 in ADP", category: "before-start", order: 0 },
  { id: "default-1", title: "Sign offer letter and restrictive covenant", category: "before-start", order: 1 },
  { id: "default-2", title: "Set up Google Workspace account", category: "before-start", order: 2 },
  { id: "default-3", title: "Attend orientation with Ryan", category: "first-day", order: 0 },
  { id: "default-4", title: "Set up Slack and join channels", category: "first-day", order: 1 },
  { id: "default-5", title: "Review Employee Handbook in People Portal", category: "first-day", order: 2 },
  { id: "default-6", title: "Set up equipment via Electric", category: "first-day", order: 3 },
  { id: "default-7", title: "Complete 15Five profile", category: "first-week", order: 0 },
  { id: "default-8", title: "Meet your team members", category: "first-week", order: 1 },
  { id: "default-9", title: "Review your role's OKRs with manager", category: "first-week", order: 2 },
  { id: "default-10", title: "Set up Monday.com access", category: "first-week", order: 3 },
  { id: "default-11", title: "Complete benefits enrollment in ADP", category: "first-month", order: 0 },
  { id: "default-12", title: "Set up 401(k) via TAG Resources", category: "first-month", order: 1 },
  { id: "default-13", title: "Submit first 15Five check-in", category: "first-month", order: 2 },
  { id: "default-14", title: "Complete any role-specific training", category: "first-month", order: 3 },
]
