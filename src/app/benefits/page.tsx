import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  medicalPlanA,
  medicalPlanB,
  employeeCosts,
  dentalPlan,
  visionPlan,
  lifeDisability,
  retirement,
  professionalDevelopment,
} from "@/data/benefits"
import { ArrowRight, Heart, Eye, Shield, Landmark, BookOpen } from "lucide-react"

export default function BenefitsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Benefits</h1>
        <p className="text-muted-foreground">
          Your 2026 benefits package. UHL pays 75% of medical, dental & vision
          and 100% of life, STD & LTD.
        </p>
      </div>

      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="py-3">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Benefits are effective May 1, 2026. Open enrollment runs ~2-3 weeks
            before that date.
          </p>
        </CardContent>
      </Card>

      {/* Medical Plan Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Medical — Anthem Blue Open Access POS
          </h2>
          <Link href="/benefits/plan-picker">
            <Button variant="outline" size="sm">
              Which plan is right for me?
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Plan A */}
          <Card className="border-blue-500/50">
            <CardHeader className="pb-3">
              <Badge className="w-fit bg-blue-600">Plan A</Badge>
              <CardTitle className="text-lg">{medicalPlanA.name}</CardTitle>
              <CardDescription>{medicalPlanA.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DetailRow label="Deductible" value={medicalPlanA.details.deductible} />
              <DetailRow label="Doctor visit" value={medicalPlanA.details.doctorVisit} />
              <DetailRow label="Specialist" value={medicalPlanA.details.specialist} />
              <DetailRow label="Urgent care" value={medicalPlanA.details.urgentCare} />
              <DetailRow label="ER" value={medicalPlanA.details.er} />
              <DetailRow
                label="Rx (generic/pref/non/spec)"
                value={`${medicalPlanA.details.rxGeneric}/${medicalPlanA.details.rxPreferred}/${medicalPlanA.details.rxNonPreferred}/${medicalPlanA.details.rxSpecialty}`}
              />
              <DetailRow label="OOP max" value={`${medicalPlanA.details.oopMax} / ${medicalPlanA.details.oopMaxFamily} family`} />
              <DetailRow
                label="After copays"
                value={medicalPlanA.details.afterCopays}
                highlight
              />
              <Separator />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {medicalPlanA.bestFor}
              </p>
            </CardContent>
          </Card>

          {/* Plan B */}
          <Card>
            <CardHeader className="pb-3">
              <Badge variant="outline" className="w-fit border-green-600 text-green-600">
                Plan B
              </Badge>
              <CardTitle className="text-lg">{medicalPlanB.name}</CardTitle>
              <CardDescription>{medicalPlanB.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DetailRow label="Deductible" value={`${medicalPlanB.details.deductible} / ${medicalPlanB.details.deductibleFamily} family`} />
              <DetailRow label="After deductible" value={medicalPlanB.details.afterDeductible} highlight />
              <DetailRow label="Rx" value={medicalPlanB.details.rx} />
              <DetailRow label="OOP max" value={`${medicalPlanB.details.oopMax} / ${medicalPlanB.details.oopMaxFamily} family`} />
              <DetailRow label="UHL HSA contribution" value={medicalPlanB.details.hsaContribution} highlight />
              <DetailRow label="Premiums vs Plan A" value={medicalPlanB.details.premiumSavings} />
              <Separator />
              <p className="text-xs text-green-600 dark:text-green-400">
                {medicalPlanB.bestFor}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rx Warning */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-3">
            <p className="text-sm">
              <strong>Rx heads-up:</strong> On Plan A, a generic is $10 from day
              one. On Plan B, every prescription hits the $7,500 deductible
              first. If you take regular medications, Plan A is almost certainly
              the better choice.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          What You Pay (Your 25%)
        </h2>
        <p className="text-sm text-muted-foreground">{employeeCosts.note}</p>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coverage tier</TableHead>
                <TableHead className="text-right text-blue-600">
                  Plan A / mo
                </TableHead>
                <TableHead className="text-right text-blue-600">
                  Per paycheck
                </TableHead>
                <TableHead className="text-right text-green-600">
                  Plan B / mo
                </TableHead>
                <TableHead className="text-right text-green-600">
                  Per paycheck
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeCosts.tiers.map((t) => (
                <TableRow key={t.tier}>
                  <TableCell className="font-medium">{t.tier}</TableCell>
                  <TableCell className="text-right">{t.planA.monthly}</TableCell>
                  <TableCell className="text-right">{t.planA.perPaycheck}</TableCell>
                  <TableCell className="text-right text-green-600">{t.planB.monthly}</TableCell>
                  <TableCell className="text-right text-green-600">{t.planB.perPaycheck}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <p className="text-xs text-green-600 dark:text-green-400">
          Plan B saves $76-$233/mo depending on tier ($915-$2,791/yr)
        </p>
      </div>

      {/* Other Benefits Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Dental */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{dentalPlan.name}</CardTitle>
            </div>
            <CardDescription>UHL pays {dentalPlan.erContribution}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(dentalPlan.details).map(([k, v]) => (
              <DetailRow key={k} label={formatLabel(k)} value={v} />
            ))}
          </CardContent>
        </Card>

        {/* Vision */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{visionPlan.name}</CardTitle>
            </div>
            <CardDescription>UHL pays {visionPlan.erContribution}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(visionPlan.details).map(([k, v]) => (
              <DetailRow key={k} label={formatLabel(k)} value={v} />
            ))}
          </CardContent>
        </Card>

        {/* Life & Disability */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">100% Company-Paid</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <DetailRow label="Life & AD&D" value={lifeDisability.life.coverage} />
            <DetailRow label="STD" value={`${lifeDisability.std.benefit}, ${lifeDisability.std.duration}`} />
            <DetailRow label="LTD" value={lifeDisability.ltd.benefit} />
            <DetailRow label="STD starts" value={lifeDisability.std.startDay} />
            <DetailRow label="LTD starts" value={lifeDisability.ltd.startDay} />
          </CardContent>
        </Card>
      </div>

      {/* 401(k) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            {retirement.name} — {retirement.provider}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Employer Match</CardTitle>
              <CardDescription>{retirement.match.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>You contribute</TableHead>
                    <TableHead className="text-right">UHL matches</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retirement.match.table.map((row) => (
                    <TableRow key={row.youContribute}>
                      <TableCell>{row.youContribute}</TableCell>
                      <TableCell className="text-right font-medium">
                        {row.uhlMatches}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-2 text-xs text-muted-foreground">
                Matched each pay period. Max employer contribution: 3.5% of
                compensation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow label="Plan effective" value={retirement.effectiveDate} />
              <DetailRow label="Deferrals start" value={retirement.deferralStartDate} />
              <DetailRow label="Auto-enroll" value={retirement.contributions.autoEnroll} />
              <DetailRow label="Auto-escalate" value={retirement.contributions.autoEscalate} />
              <DetailRow label="Roth option" value="Available" />
              <DetailRow label="Vesting" value={retirement.vesting.description} />
              <DetailRow label="Eligibility" value={`Age ${retirement.eligibility.age}, ${retirement.eligibility.service} of service`} />
              <DetailRow label="Loans" value={retirement.loans.allowed ? `Yes (${retirement.loans.maxOutstanding} max)` : "No"} />
              <DetailRow label="Hardship withdrawals" value={retirement.hardshipWithdrawals ? "Available" : "No"} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Development */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Professional Development</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {professionalDevelopment.description}
          </p>
          <div className="mt-2 flex gap-4">
            <Badge variant="secondary">{professionalDevelopment.annualAllowance}/year</Badge>
            <Badge variant="secondary">{professionalDevelopment.bookBenefit}</Badge>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        This is a summary. Official plan documents govern in case of any
        conflict.
      </p>
    </div>
  )
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-medium" : ""}>{value}</span>
    </div>
  )
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
