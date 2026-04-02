"use client"

import { useState, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchHandbook, type SearchResult } from "@/lib/search"

interface SearchBarProps {
  onSelectSection: (sectionId: string) => void
}

export function HandbookSearchBar({ onSelectSection }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    const found = searchHandbook(value)
    setResults(found)
    setIsOpen(found.length > 0)
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search handbook..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-9 pr-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-lg">
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.section.id}
                  className="flex w-full flex-col gap-1 rounded-sm px-3 py-2 text-left hover:bg-accent"
                  onClick={() => {
                    onSelectSection(result.section.id)
                    setIsOpen(false)
                    setQuery("")
                    setResults([])
                  }}
                >
                  <span className="text-sm font-medium">
                    {result.section.number}. {result.section.title}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {result.excerpt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
