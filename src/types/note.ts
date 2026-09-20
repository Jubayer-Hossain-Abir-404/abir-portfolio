export type Note = {
  slug: string
  title: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  summary: string
  tags: string[]
  readingMinutes: number
  /** Drafts are excluded from the build; nothing half-written ships. */
  published: boolean
}
