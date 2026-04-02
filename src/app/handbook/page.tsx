"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { handbookSections } from "@/data/handbook/sections"
import { HandbookSearchBar } from "@/components/handbook/search-bar"
import { HandbookSidebarNav } from "@/components/handbook/sidebar-nav"
import { SectionContent } from "@/components/handbook/section-content"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { List } from "lucide-react"

const states = ["AZ", "FL", "GA", "KY", "MA", "MD", "NC", "NY", "OH", "TN"]

export default function HandbookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sectionParam = searchParams.get("section")

  const [activeSectionId, setActiveSectionId] = useState(
    sectionParam ?? handbookSections[0]?.id ?? "welcome"
  )
  const [selectedState, setSelectedState] = useState<string>("")

  useEffect(() => {
    if (sectionParam && sectionParam !== activeSectionId) {
      setActiveSectionId(sectionParam)
    }
  }, [sectionParam, activeSectionId])

  const activeSection = handbookSections.find((s) => s.id === activeSectionId) ?? handbookSections[0]

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id)
    router.push(`/handbook?section=${id}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden -m-4 lg:-m-6">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 border-r bg-card lg:block">
        <div className="p-3 space-y-3">
          <HandbookSearchBar onSelectSection={handleSelectSection} />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Your state
            </label>
            <Select value={selectedState} onValueChange={(val) => setSelectedState(val ?? "")}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <HandbookSidebarNav
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />
      </div>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b p-3 lg:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
              <List className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-3">
                <HandbookSearchBar onSelectSection={handleSelectSection} />
              </div>
              <HandbookSidebarNav
                activeSectionId={activeSectionId}
                onSelectSection={handleSelectSection}
              />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <HandbookSearchBar onSelectSection={handleSelectSection} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeSection && (
            <SectionContent
              section={activeSection}
              selectedState={selectedState}
            />
          )}
        </div>
      </div>
    </div>
  )
}
