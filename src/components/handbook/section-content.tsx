"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import type { HandbookSection } from "@/data/handbook/sections"

interface SectionContentProps {
  section: HandbookSection
  selectedState?: string
}

export function SectionContent({
  section,
  selectedState,
}: SectionContentProps) {
  const blocks = useMemo(() => parseMarkdown(section.content), [section.content])

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          Section {section.number}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {section.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{section.category}</Badge>
          {section.stateSpecific?.map((state) => (
            <Badge
              key={state}
              variant={state === selectedState ? "default" : "outline"}
            >
              {state}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground">
            Last updated: {section.lastUpdated}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {blocks.map((block, i) => (
          <RenderBlock key={i} block={block} />
        ))}
      </div>
    </article>
  )
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "blockquote"; lines: string[] }

function parseMarkdown(md: string): Block[] {
  const lines = md.split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() })
      i++
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() })
      i++
    } else if (line.startsWith("|")) {
      const rowLines: string[] = []
      while (i < lines.length && lines[i].startsWith("|")) {
        rowLines.push(lines[i])
        i++
      }
      // The |---|---| row only separates header from body; it carries no text.
      const isSeparator = (row: string) => /^\|\s*:?-{3,}/.test(row)
      const cells = (row: string) =>
        row.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim())
      const [header, ...rest] = rowLines.filter((row) => !isSeparator(row))
      blocks.push({
        type: "table",
        header: header ? cells(header) : [],
        rows: rest.map(cells),
      })
    } else if (line.startsWith(">")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, "").trim())
        i++
      }
      blocks.push({ type: "blockquote", lines: quoteLines.filter(Boolean) })
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim())
        i++
      }
      blocks.push({ type: "list", items, ordered: false })
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, "").trim())
        i++
      }
      blocks.push({ type: "list", items, ordered: true })
    } else if (line.trim()) {
      blocks.push({ type: "paragraph", text: line.trim() })
      i++
    } else {
      i++
    }
  }

  return blocks
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-8 mb-3 text-xl font-semibold">
          <InlineText text={block.text} />
        </h2>
      )
    case "h3":
      return (
        <h3 className="mt-6 mb-2 text-lg font-semibold">
          <InlineText text={block.text} />
        </h3>
      )
    case "paragraph":
      return (
        <p className="leading-relaxed text-foreground/90">
          <InlineText text={block.text} />
        </p>
      )
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {block.header.map((cell, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold">
                    <InlineText text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b last:border-0">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="px-3 py-2 align-top leading-relaxed text-foreground/90"
                    >
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "blockquote":
      return (
        <div className="space-y-2 rounded-md border-l-4 border-primary/60 bg-muted/40 px-4 py-3">
          {block.lines.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              <InlineText text={line} />
            </p>
          ))}
        </div>
      )
    case "list": {
      const Tag = block.ordered ? "ol" : "ul"
      return (
        <Tag
          className={`space-y-1 pl-6 ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed text-foreground/90">
              <InlineText text={item} />
            </li>
          ))}
        </Tag>
      )
    }
  }
}
