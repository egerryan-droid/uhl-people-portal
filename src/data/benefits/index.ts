export const medicalPlanA = {
  name: "Plan A — Zero Deductible",
  subtitle: "CSP Clear Choice 40/4000",
  carrier: "Anthem Blue Open Access POS",
  bestFor:
    "Best if you take regular meds, see specialists, or want predictable costs.",
  details: {
    deductible: "$0",
    deductibleFamily: "$0",
    doctorVisit: "$40 copay",
    specialist: "$80 copay",
    urgentCare: "$80 copay",
    er: "$800 copay",
    rxGeneric: "$10",
    rxPreferred: "$60",
    rxNonPreferred: "$125",
    rxSpecialty: "$400",
    oopMax: "$4,000",
    oopMaxFamily: "$8,000",
    afterCopays: "Plan pays 100%",
  },
}

export const medicalPlanB = {
  name: "Plan B — HSA Plan",
  subtitle: "FBH Blue OA POS 7500",
  carrier: "Anthem Blue Open Access POS",
  bestFor:
    "Best if you're generally healthy, rarely see a doctor, and want to grow tax-free savings.",
  details: {
    deductible: "$7,500",
    deductibleFamily: "$15,000",
    afterDeductible: "Plan pays 100%",
    rx: "Hits deductible first",
    oopMax: "$7,500",
    oopMaxFamily: "$15,000",
    hsaContribution: "$1,500–$2,000/yr from UHL",
    premiumSavings: "Lower premiums vs Plan A",
  },
}

export const employeeCosts = {
  note: "Your 25% share — medical + dental + vision combined. UHL pays 75%.",
  tiers: [
    {
      tier: "Employee only",
      planA: { monthly: "$319.77", perPaycheck: "$159.89" },
      planB: { monthly: "$243.52", perPaycheck: "$121.76" },
    },
    {
      tier: "Employee + spouse",
      planA: { monthly: "$671.52", perPaycheck: "$335.76" },
      planB: { monthly: "$511.39", perPaycheck: "$255.69" },
    },
    {
      tier: "Employee + child(ren)",
      planA: { monthly: "$627.78", perPaycheck: "$313.89" },
      planB: { monthly: "$479.08", perPaycheck: "$239.54" },
    },
    {
      tier: "Family",
      planA: { monthly: "$981.28", perPaycheck: "$490.64" },
      planB: { monthly: "$748.70", perPaycheck: "$374.35" },
    },
  ],
}

export const dentalPlan = {
  name: "Dental — Principal Alt 2",
  erContribution: "75%",
  details: {
    deductible: "$50 / $150 family",
    annualMax: "$1,000 (rolls over)",
    preventive: "100%",
    basic: "80%",
    major: "50%",
  },
}

export const visionPlan = {
  name: "Vision — VSP",
  erContribution: "75%",
  details: {
    exam: "$10 copay / 12 months",
    lenses: "$10 copay / 12 months",
    frames: "$130 allowance / 24 months",
  },
}

export const lifeDisability = {
  life: {
    name: "Group Life & AD&D",
    coverage: "$50,000",
    erPaid: "100%",
  },
  std: {
    name: "Short-Term Disability",
    benefit: "60% of pay, up to $1,000/week",
    duration: "12 weeks",
    startDay: "Day 8",
    erPaid: "100%",
  },
  ltd: {
    name: "Long-Term Disability",
    benefit: "60% of pay, up to $6,000/month",
    startDay: "Day 91",
    erPaid: "100%",
  },
  voluntaryLife: {
    name: "Voluntary Life (Optional)",
    coverage: "Up to 5x salary, max $300,000",
    guaranteedIssue: "$100,000 (no medical questions)",
    spouseGI: "$15,000",
    childCoverage: "$1,000",
    rateLock: "24 months",
  },
}

export const retirement = {
  name: "401(k) Plan",
  provider: "TAG Resources",
  effectiveDate: "January 1, 2026",
  deferralStartDate: "April 1, 2026",
  contributions: {
    preTax: true,
    roth: true,
    autoEnroll: "3% of pay",
    autoEscalate: "Increases 1% per year up to 10%",
  },
  match: {
    type: "Traditional QACA Safe Harbor",
    formula: "100% of first 1% + 50% of next 5% = max 3.5% employer contribution",
    table: [
      { youContribute: "1%", uhlMatches: "1%" },
      { youContribute: "2%", uhlMatches: "1.5%" },
      { youContribute: "3%", uhlMatches: "2%" },
      { youContribute: "4%", uhlMatches: "2.5%" },
      { youContribute: "5%", uhlMatches: "3%" },
      { youContribute: "6%+", uhlMatches: "3.5%" },
    ],
    frequency: "Each pay period",
  },
  vesting: {
    type: "2-year cliff",
    description: "0% vested before 2 years, 100% vested at 2 years",
  },
  eligibility: {
    age: "18",
    service: "3 months",
    entryDate: "1st day of month after meeting requirements",
  },
  loans: { allowed: true, maxOutstanding: 1 },
  hardshipWithdrawals: true,
  profitSharing: "Discretionary cross-tested (determined annually by UHL)",
  payrollFrequency: "Bi-weekly",
}

export const professionalDevelopment = {
  annualAllowance: "$2,000",
  bookBenefit: "Quarterly book stipend",
  description:
    "UHL provides a $2,000 annual professional development allowance for courses, certifications, conferences, and learning resources. Additionally, a quarterly book benefit is available for professional reading.",
}
