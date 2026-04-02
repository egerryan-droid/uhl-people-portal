"use client"

import { jobDescriptions } from "@/data/job-descriptions"
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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Briefcase, MapPin, Building2, Users, Mail } from "lucide-react"

const departmentOrder = ["Leadership", "Sales", "Customer Success", "Engineering"]

function groupByDepartment() {
  const grouped: Record<string, typeof jobDescriptions> = {}
  for (const job of jobDescriptions) {
    if (!grouped[job.department]) {
      grouped[job.department] = []
    }
    grouped[job.department].push(job)
  }
  return grouped
}

export default function RolesPage() {
  const grouped = groupByDepartment()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Team Roles
        </h1>
        <p className="text-muted-foreground">
          These are our current team roles. For compensation details, contact
          Ryan Eger (
          <a
            href="mailto:ryan@usahomelistings.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            ryan@usahomelistings.com
          </a>
          ).
        </p>
      </div>

      <Card>
        <CardContent className="flex items-start gap-3 py-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p>
              Compensation: Competitive salary + benefits. Contact HR for
              details. All full-time W2 roles include medical, dental, vision,
              401(k), unlimited PTO, and professional development stipends.
            </p>
          </div>
        </CardContent>
      </Card>

      {departmentOrder.map((dept) => {
        const roles = grouped[dept]
        if (!roles || roles.length === 0) return null

        return (
          <div key={dept} className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {dept}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {roles.length} {roles.length === 1 ? "role" : "roles"}
              </Badge>
            </div>

            <Accordion>
              {roles.map((job) => (
                <AccordionItem key={job.id} value={job.id}>
                  <AccordionTrigger>
                    <div className="flex flex-1 flex-col gap-1 pr-4">
                      <span className="font-medium">{job.title}</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Reports to {job.reportsTo}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-5 pl-1">
                      <div>
                        <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          About This Role
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {job.summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Compensation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Competitive salary + benefits. Contact HR for details.
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {job.responsibilities.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm leading-relaxed"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Requirements
                        </h4>
                        <ul className="space-y-1.5">
                          {job.requirements.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm leading-relaxed"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {job.niceToHave && job.niceToHave.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Nice to Have
                            </h4>
                            <ul className="space-y-1.5">
                              {job.niceToHave.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex gap-2 text-sm leading-relaxed"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
