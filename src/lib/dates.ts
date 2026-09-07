// PTO, holiday, and report dates are Prisma `@db.Date` columns. They carry a
// calendar day, not an instant, and Prisma hands them back as UTC midnight.
//
// The rule: a calendar day is represented as a "YYYY-MM-DD" key everywhere it
// is compared, stored, or displayed. Reading such a value through local-time
// accessors (`toLocaleDateString`, `getDay`, `new Date(y, m, d)`) shifts it a
// day for any viewer whose offset is west of UTC, which is every US timezone.

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** Calendar-day key ("2026-08-10") for a Date or ISO string, read in UTC. */
export function toDateKey(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${d.getUTCFullYear()}-${m}-${day}`
}

/** Build a key from calendar parts. `month` is 0-indexed, matching Date. */
export function dateKeyFromParts(
  year: number,
  month: number,
  day: number
): string {
  const m = String(month + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

/**
 * Coerce any accepted form to a bare key. A "YYYY-MM-DD" string passes through
 * untouched; a Date or full ISO timestamp is read in UTC. Without this, an ISO
 * string would split on the wrong "-" boundaries and yield NaN parts.
 */
function normalizeKey(value: Date | string): string {
  if (value instanceof Date) return toDateKey(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return toDateKey(value)
}

/** "Aug 10, 2026". Accepts a key or a Date; never routes through local time. */
export function formatDateOnly(value: Date | string): string {
  const key = normalizeKey(value)
  const [y, m, d] = key.split("-").map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return key
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** "Aug 10 — Aug 14, 2026", collapsing a shared year and month. */
export function formatDateRange(
  start: Date | string,
  end: Date | string
): string {
  const a = normalizeKey(start)
  const b = normalizeKey(end)
  if (!a || !b) return `${a}${b ? ` — ${b}` : ""}`
  if (a === b) return formatDateOnly(a)
  const [ay, am] = a.split("-").map(Number)
  const [by, bm] = b.split("-").map(Number)
  if (ay === by && am === bm) {
    const ad = Number(a.split("-")[2])
    return `${MONTHS[am - 1]} ${ad} — ${Number(b.split("-")[2])}, ${ay}`
  }
  if (ay === by) {
    return `${MONTHS[am - 1]} ${Number(a.split("-")[2])} — ${MONTHS[bm - 1]} ${Number(b.split("-")[2])}, ${ay}`
  }
  return `${formatDateOnly(a)} — ${formatDateOnly(b)}`
}

/** True when the key is a real calendar date in "YYYY-MM-DD" form. */
export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const [y, m, d] = value.split("-").map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  // Reject overflow like 2026-02-30, which Date would silently roll forward.
  const probe = new Date(Date.UTC(y, m - 1, d))
  return probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d
}

/** A Date at UTC midnight, the form Prisma expects for a `@db.Date` column. */
export function dateKeyToUtcDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/**
 * Inclusive count of Mon–Fri days between two keys. Day-of-week is read with
 * `getUTCDay` against a UTC-constructed date, so the two never disagree.
 */
export function businessDaysBetween(startKey: string, endKey: string): number {
  if (!isValidDateKey(startKey) || !isValidDateKey(endKey)) return 0
  const end = dateKeyToUtcDate(endKey)
  const cursor = dateKeyToUtcDate(startKey)
  if (cursor > end) return 0
  let count = 0
  while (cursor <= end) {
    const day = cursor.getUTCDay()
    if (day !== 0 && day !== 6) count++
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return count
}

/**
 * Today in the viewer's own timezone. Correct for a date picker's `min`, where
 * "today" means the user's calendar day rather than UTC's.
 */
export function todayLocalKey(): string {
  const now = new Date()
  return dateKeyFromParts(now.getFullYear(), now.getMonth(), now.getDate())
}
