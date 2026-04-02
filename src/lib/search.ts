import { handbookSections, type HandbookSection } from "@/data/handbook/sections"

export interface SearchResult {
  section: HandbookSection
  excerpt: string
}

export function searchHandbook(query: string): SearchResult[] {
  if (!query.trim()) return []

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)

  const results: { section: HandbookSection; score: number; excerpt: string }[] = []

  for (const section of handbookSections) {
    const titleLower = section.title.toLowerCase()
    const contentLower = section.content.toLowerCase()

    let score = 0

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10
      if (contentLower.includes(term)) {
        const count = contentLower.split(term).length - 1
        score += Math.min(count, 5)
      }
    }

    if (score > 0) {
      const excerpt = getExcerpt(section.content, terms[0])
      results.push({ section, score, excerpt })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 15).map(({ section, excerpt }) => ({ section, excerpt }))
}

function getExcerpt(content: string, term: string): string {
  const idx = content.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return content.slice(0, 150) + "..."

  const start = Math.max(0, idx - 60)
  const end = Math.min(content.length, idx + term.length + 90)
  let excerpt = content.slice(start, end)

  if (start > 0) excerpt = "..." + excerpt
  if (end < content.length) excerpt = excerpt + "..."

  return excerpt.replace(/[#*_\[\]]/g, "").replace(/\n+/g, " ")
}
