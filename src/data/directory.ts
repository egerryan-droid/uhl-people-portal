export interface TeamMember {
  name: string
  email: string
  title: string
  department: string
  type: "W2" | "Contractor"
  reportsTo?: string
}

export const departments = [
  "Leadership",
  "Sales",
  "Engineering",
  "Customer Success",
  "Marketing",
  "Operations & Support",
] as const

export const teamDirectory: TeamMember[] = [
  // Leadership
  {
    name: "Eric Wirks",
    email: "eric@usahomelistings.com",
    title: "CEO / Founder",
    department: "Leadership",
    type: "W2",
  },
  {
    name: "Ryan Eger",
    email: "ryan@usahomelistings.com",
    title: "Chief of Staff / CSO",
    department: "Leadership",
    type: "W2",
    reportsTo: "Eric Wirks",
  },
  {
    name: "Carley Lahiff",
    email: "carley@usahomelistings.com",
    title: "COO",
    department: "Leadership",
    type: "W2",
    reportsTo: "Eric Wirks",
  },
  {
    name: "Marcus Henning",
    email: "marcus@usahomelistings.com",
    title: "CTO",
    department: "Leadership",
    type: "W2",
    reportsTo: "Eric Wirks",
  },

  // Sales
  {
    name: "Hunter Monroe",
    email: "hunter@usahomelistings.com",
    title: "VP of Sales",
    department: "Sales",
    type: "W2",
    reportsTo: "Ryan Eger",
  },
  {
    name: "Hannah Underwood",
    email: "hannah@usahomelistings.com",
    title: "Senior Account Executive",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Monroe",
  },
  {
    name: "Dee Frazier",
    email: "dee@usahomelistings.com",
    title: "Senior Account Executive",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Monroe",
  },
  {
    name: "Eddie Szymczak",
    email: "eddie@usahomelistings.com",
    title: "Account Executive",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Monroe",
  },
  {
    name: "Brandon Runkel",
    email: "brandon@usahomelistings.com",
    title: "Account Executive",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Monroe",
  },

  // Engineering
  {
    name: "Matt McCammon",
    email: "matt@usahomelistings.com",
    title: "Lead Developer",
    department: "Engineering",
    type: "W2",
    reportsTo: "Marcus Henning",
  },
  {
    name: "Beau Eads",
    email: "beau@usahomelistings.com",
    title: "Sr. Full-Stack Developer",
    department: "Engineering",
    type: "W2",
    reportsTo: "Marcus Henning",
  },
  {
    name: "AJ Chavarriaga",
    email: "aj@usahomelistings.com",
    title: "UI / Frontend Developer",
    department: "Engineering",
    type: "W2",
    reportsTo: "Marcus Henning",
  },
  {
    name: "Kyler Ray",
    email: "kyler@usahomelistings.com",
    title: "Jr. Developer",
    department: "Engineering",
    type: "W2",
    reportsTo: "Marcus Henning",
  },

  // Customer Success
  {
    name: "Maggie Campbell",
    email: "maggie@usahomelistings.com",
    title: "Customer Success Manager",
    department: "Customer Success",
    type: "W2",
    reportsTo: "Carley Lahiff",
  },
  {
    name: "Darryl Darius",
    email: "darryl@usahomelistings.com",
    title: "Backend / Data Developer",
    department: "Customer Success",
    type: "W2",
    reportsTo: "Maggie Campbell",
  },

  // Marketing
  {
    name: "Ella Kobak",
    email: "ella.kobak@usahomelistings.com",
    title: "Jr. Marketing Analyst",
    department: "Marketing",
    type: "W2",
    reportsTo: "Carley Lahiff",
  },

  // Operations & Support
  {
    name: "CB Bautista",
    email: "cb@usahomelistings.com",
    title: "Project Manager",
    department: "Operations & Support",
    type: "Contractor",
    reportsTo: "Ryan Eger",
  },
  {
    name: "Elle Hucal",
    email: "elle@usahomelistings.com",
    title: "Tier 1 Support",
    department: "Operations & Support",
    type: "Contractor",
    reportsTo: "Maggie Campbell",
  },
]
