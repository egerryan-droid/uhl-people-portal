"use client"

import { cn } from "@/lib/utils"
import { handbookSections } from "@/data/handbook/sections"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const categoryLabels: Record<string, string> = {
  general: "General",
  leave: "Leave & Time Off",
  benefits: "Benefits & Development",
  conduct: "Conduct & Policies",
  operations: "Operations",
  "state-addendum": "State Addendums",
}

const categoryOrder = [
  "general",
  "leave",
  "benefits",
  "conduct",
  "operations",
  "state-addendum",
]

interface SidebarNavProps {
  activeSectionId: string
  onSelectSection: (id: string) => void
}

export function HandbookSidebarNav({
  activeSectionId,
  onSelectSection,
}: SidebarNavProps) {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat] ?? cat,
    sections: handbookSections.filter((s) => s.category === cat),
  }))

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-2">
        {grouped.map((group) => (
          <div key={group.category}>
            <p className="mb-1 px-3 text-xs font-medium uppercase text-muted-foreground">
              {group.label}
            </p>
            {group.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                  activeSectionId === section.id
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {section.number}.
                </span>
                <span className="truncate">{section.title}</span>
                {section.stateSpecific && section.stateSpecific.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-auto shrink-0 text-[10px] px-1 py-0"
                  >
                    State
                  </Badge>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
