// Roster synced from the 15Five org chart on 2026-08-03 (21 people); Dee Frazier and
// Darryl Darius removed on 2026-09-08 after termination; Elizabeth Ropati added the
// same day (20 people).
// This file is hardcoded, so it drifts on every hire, departure, and title change.

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
    title: "President / Chief Strategy Officer",
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
  {
    name: "Elizabeth Ropati",
    email: "learning@usahomelistings.com",
    title: "Director of People",
    department: "Leadership",
    type: "W2",
    reportsTo: "Ryan Eger",
  },

  // Sales
  {
    name: "Hunter Munroe",
    email: "hunter@usahomelistings.com",
    title: "Sales Manager",
    department: "Sales",
    type: "W2",
    reportsTo: "Ryan Eger",
  },
  {
    name: "Glen Johnson",
    email: "glen@usahomelistings.com",
    title: "Account Executive",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Munroe",
  },
  {
    name: "Hannah Underwood",
    email: "hannah@usahomelistings.com",
    title: "Biz Dev / Sales Rep",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Munroe",
  },
  {
    name: "Eddie Szymczak",
    email: "eddie@usahomelistings.com",
    title: "Sales Rep",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Munroe",
  },
  {
    name: "Brandon Runkel",
    email: "brandon@usahomelistings.com",
    title: "Sales Rep",
    department: "Sales",
    type: "W2",
    reportsTo: "Hunter Munroe",
  },

  // Engineering
  {
    name: "Matt McCammon",
    email: "matt@usahomelistings.com",
    title: "Lead Software Engineer",
    department: "Engineering",
    type: "W2",
    reportsTo: "Marcus Henning",
  },
  {
    name: "AJ Chavarriaga",
    email: "aj@usahomelistings.com",
    title: "Frontend Developer",
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
    reportsTo: "Ryan Eger",
  },
  {
    name: "Joyce Cao",
    email: "joyce@usahomelistings.com",
    title: "Customer Success",
    department: "Customer Success",
    type: "W2",
    reportsTo: "Maggie Campbell",
  },
  {
    name: "Kristen Carroll",
    email: "kristen@usahomelistings.com",
    title: "Customer Success",
    department: "Customer Success",
    type: "W2",
    reportsTo: "Maggie Campbell",
  },
  {
    name: "Marissa McMillan",
    email: "marissa@usahomelistings.com",
    title: "Customer Success",
    department: "Customer Success",
    type: "W2",
    reportsTo: "Maggie Campbell",
  },
  {
    name: "Jeffy Lising",
    email: "jeffy@usahomelistings.com",
    title: "Customer Service / Virtual Assistant",
    department: "Customer Success",
    type: "Contractor",
    reportsTo: "Maggie Campbell",
  },

  // Marketing
  {
    name: "Ella Kobak",
    email: "ella.kobak@usahomelistings.com",
    title: "Jr. Marketing Analyst",
    department: "Marketing",
    type: "W2",
    reportsTo: "Ryan Eger",
  },
  {
    name: "Munib Fuyad",
    email: "munib@usahomelistings.com",
    title: "Graphic & Motion Designer",
    department: "Marketing",
    type: "Contractor",
    reportsTo: "Maggie Campbell",
  },

  // Operations & Support
  {
    name: "CB Bautista",
    email: "cb@usahomelistings.com",
    title: "Project Manager",
    department: "Operations & Support",
    type: "Contractor",
    reportsTo: "Marcus Henning",
  },
  {
    name: "Elle Hucal",
    email: "elle@usahomelistings.com",
    title: "GVA / General Virtual Assistant",
    department: "Operations & Support",
    type: "Contractor",
    reportsTo: "Maggie Campbell",
  },
]
