import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  FileSignature,
  BookOpen,
  DollarSign,
  ArrowLeft,
} from "lucide-react"

const DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1aeg7j4jJKUj5PAa6wjyh1VLHrclgP5kM?usp=sharing"

const agreementCategories = [
  {
    title: "Employee Handbook",
    icon: BookOpen,
    description:
      "The full UHL Employee Handbook covering all company policies, leave, conduct, and more.",
    documents: [
      {
        name: "UHL Employee Handbook",
        note: "Also available as the interactive Handbook in this portal",
        portalLink: "/handbook",
      },
    ],
    summary:
      "Covers at-will employment, EEO, anti-harassment, PTO (flexible, 15-day minimum), sick leave (unlimited), 6 paid holidays, parental leave (4 weeks), bereavement, remote work policy, progressive discipline, onboarding/offboarding, and state-specific addendums.",
  },
  {
    title: "Offer Letter",
    icon: FileSignature,
    description:
      "Your offer letter outlines your role, base compensation, and employment terms.",
    documents: [
      {
        name: "Offer Letter — Non-Sales Roles",
        note: "Standard template for all non-sales employees",
      },
      {
        name: "Offer Letter — Sales Roles",
        note: "Includes commission eligibility reference",
      },
      {
        name: "Offer Letter — New Employees",
        note: "Template for new hires joining the company",
      },
    ],
    summary:
      "Key terms: Full-time exempt W2 employee, at-will employment, base compensation as stated, eligibility for performance bonus per Bonus Plan, contingent on Restrictive Covenant Agreement and Handbook acknowledgement.",
  },
  {
    title: "Restrictive Covenant Agreement",
    icon: ShieldCheck,
    description:
      "Covers non-disclosure, non-competition, non-solicitation, and IP assignment. State-specific versions exist.",
    documents: [
      { name: "Arizona (AZ)", state: "AZ" },
      { name: "Florida (FL)", state: "FL" },
      { name: "Georgia (GA)", state: "GA" },
      { name: "Idaho (ID)", state: "ID" },
      { name: "Kentucky (KY)", state: "KY" },
      { name: "Maryland (MD)", state: "MD" },
      { name: "Massachusetts (MA)", state: "MA" },
      { name: "New York (NY)", state: "NY" },
      { name: "North Carolina (NC)", state: "NC" },
      { name: "Ohio (OH)", state: "OH" },
      { name: "Tennessee (TN)", state: "TN" },
    ],
    summary:
      "Key terms: Confidentiality of all proprietary information (during and after employment), 2-year non-competition (50-mile radius of UHL operations), 2-year non-solicitation of customers and employees, non-disparagement, IP/work product assignment to UHL, and exit obligations. Includes DTSA whistleblower immunity notice. Terms vary by state — your version applies to the state listed on your agreement.",
  },
  {
    title: "Bonus Plan",
    icon: DollarSign,
    description:
      "The discretionary bonus plan covering OKR-based performance bonuses and CS retention bonuses.",
    documents: [
      {
        name: "UHL Bonus Plan (2026)",
        note: "Applies to all bonus-eligible employees",
      },
    ],
    summary:
      "Key terms: Eligibility requires 90 days of employment, good standing, and employment through the bonus period. Annual and quarterly OKR bonuses evaluated by management. CS team has additional ARR-based retention bonuses. All bonuses are discretionary and do not constitute earned wages. Payment within 30 days of period close.",
  },
]

export default function AgreementsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/documents"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Documents
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Agreements & Templates
        </h1>
        <p className="text-muted-foreground">
          Review the standard documents you signed when joining UHL. Blank
          templates are available if you need to reference the original terms.
        </p>
      </div>

      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="py-3 flex items-start gap-3">
          <FileText className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Need your signed copy?</p>
            <p className="text-xs text-muted-foreground">
              Contact Ryan Eger (ryan@usahomelistings.com) to request a copy of
              your signed agreements. The templates below are blank reference
              versions.
            </p>
          </div>
        </CardContent>
      </Card>

      {agreementCategories.map((category) => (
        <Card key={category.title}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <category.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Key Terms Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.summary}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">
                Available Templates
              </p>
              <div className="space-y-2">
                {category.documents.map((doc) => {
                  const note = "note" in doc ? doc.note : undefined
                  const state = "state" in doc ? doc.state : undefined
                  const portalLink = "portalLink" in doc ? doc.portalLink : undefined
                  return (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.name}
                          </p>
                          {note && (
                            <p className="text-xs text-muted-foreground">
                              {note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {state && (
                          <Badge variant="outline" className="text-[10px]">
                            {state}
                          </Badge>
                        )}
                        {portalLink && (
                          <Link
                            href={portalLink as string}
                            className="text-xs text-primary hover:underline"
                          >
                            View in Portal
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Open all templates in Google Drive
            </a>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-muted-foreground text-center">
        These are blank templates for reference. Your signed versions may include
        state-specific or role-specific modifications. Contact HR for questions.
      </p>
    </div>
  )
}
