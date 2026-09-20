export const PAGE_IDS = ['work', 'notes'] as const

export type PageId = (typeof PAGE_IDS)[number]

/**
 * Editorial copy for a standalone index page.
 *
 * Separate from `SectionCopy`, which belongs to the homepage spine and carries
 * a position-derived numeral. These pages have no spine and no numeral — they
 * just need a title and a lede that are content rather than markup, so they can
 * be corrected without touching a component.
 */
export type PageCopy = {
  title: string
  lede: string
}
