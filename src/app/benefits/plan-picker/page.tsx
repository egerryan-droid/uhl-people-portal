"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { employeeCosts } from "@/data/benefits"

type Step = 0 | 1 | 2 | 3 | 4

interface Answers {
  doctorFrequency?: "rarely" | "sometimes" | "frequently"
  prescriptions?: "none" | "generic" | "multiple"
  tier?: number // index into employeeCosts.tiers
  hsaInterest?: "yes" | "no" | "unsure"
}

export default function PlanPickerPage() {
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<Answers>({})

  const handleAnswer = (key: keyof Answers, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((s) => Math.min(s + 1, 4) as Step)
  }

  const recommendation = getRecommendation(answers)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/benefits"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Benefits
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Which Plan Is Right for Me?
        </h1>
        <p className="text-muted-foreground">
          Answer a few quick questions and we&apos;ll help you decide.
        </p>
      </div>

      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <QuestionCard
          question="How often do you visit doctors?"
          options={[
            { label: "Rarely (1-2x/year or less)", value: "rarely" },
            { label: "A few times a year", value: "sometimes" },
            { label: "Frequently (monthly+)", value: "frequently" },
          ]}
          onSelect={(v) => handleAnswer("doctorFrequency", v)}
        />
      )}

      {step === 1 && (
        <QuestionCard
          question="Do you take regular prescriptions?"
          options={[
            { label: "No prescriptions", value: "none" },
            { label: "1-2 generic medications", value: "generic" },
            { label: "Multiple or specialty drugs", value: "multiple" },
          ]}
          onSelect={(v) => handleAnswer("prescriptions", v)}
        />
      )}

      {step === 2 && (
        <QuestionCard
          question="What coverage tier do you need?"
          options={employeeCosts.tiers.map((t, i) => ({
            label: t.tier,
            value: String(i),
          }))}
          onSelect={(v) => handleAnswer("tier", parseInt(v))}
        />
      )}

      {step === 3 && (
        <QuestionCard
          question="Interested in HSA tax savings?"
          description="An HSA lets you save pre-tax money for medical expenses. Funds roll over year to year and are yours forever."
          options={[
            { label: "Yes, I want tax-free savings", value: "yes" },
            { label: "No, I prefer predictable costs", value: "no" },
            { label: "Not sure", value: "unsure" },
          ]}
          onSelect={(v) => handleAnswer("hsaInterest", v)}
        />
      )}

      {step === 4 && recommendation && (
        <Card
          className={
            recommendation.plan === "A"
              ? "border-blue-500/50"
              : "border-green-500/50"
          }
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`h-5 w-5 ${
                  recommendation.plan === "A"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              />
              <CardTitle>
                We recommend Plan {recommendation.plan}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {recommendation.reason}
            </p>

            {answers.tier !== undefined && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">
                  Your estimated monthly cost ({employeeCosts.tiers[answers.tier].tier}):
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Plan A</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {employeeCosts.tiers[answers.tier].planA.monthly}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plan B</p>
                    <p className="text-lg font-semibold text-green-600">
                      {employeeCosts.tiers[answers.tier].planB.monthly}
                    </p>
                  </div>
                </div>
                {recommendation.plan === "B" && (
                  <Badge variant="secondary" className="text-green-600">
                    You save{" "}
                    {getMonthlySavings(answers.tier)}/mo with Plan B
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0)
                  setAnswers({})
                }}
              >
                Start over
              </Button>
              <Link href="/benefits">
                <Button>View full benefits details</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  description,
  options,
  onSelect,
}: {
  question: string
  description?: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant="outline"
            className="justify-start h-auto py-3 text-left"
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

function getRecommendation(answers: Answers) {
  if (!answers.doctorFrequency || !answers.prescriptions || !answers.hsaInterest) {
    return null
  }

  let planAPoints = 0
  let planBPoints = 0

  // Doctor frequency
  if (answers.doctorFrequency === "frequently") planAPoints += 3
  else if (answers.doctorFrequency === "sometimes") planAPoints += 1
  else planBPoints += 2

  // Prescriptions
  if (answers.prescriptions === "multiple") planAPoints += 4
  else if (answers.prescriptions === "generic") planAPoints += 2
  else planBPoints += 1

  // HSA interest
  if (answers.hsaInterest === "yes") planBPoints += 2
  else if (answers.hsaInterest === "no") planAPoints += 1

  if (planAPoints >= planBPoints) {
    return {
      plan: "A" as const,
      reason:
        "Based on your healthcare usage and prescription needs, Plan A's $0 deductible and predictable copays will likely save you money. You'll pay $10 for generic prescriptions from day one, versus hitting a $7,500 deductible on Plan B first.",
    }
  }
  return {
    plan: "B" as const,
    reason:
      "Since you rarely visit doctors and don't take regular medications, Plan B's lower premiums will save you money month-to-month. Plus, UHL contributes $1,500-$2,000/year to your HSA, and those funds grow tax-free and roll over forever.",
  }
}

function getMonthlySavings(tierIndex: number): string {
  const tier = employeeCosts.tiers[tierIndex]
  const planAMonthly = parseFloat(tier.planA.monthly.replace(/[$,]/g, ""))
  const planBMonthly = parseFloat(tier.planB.monthly.replace(/[$,]/g, ""))
  const savings = Math.round(planAMonthly - planBMonthly)
  return `$${savings}`
}
