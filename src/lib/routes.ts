/**
 * Every internal URL in the app, in one place.
 *
 * Nothing else interpolates a path. A template literal spread across twenty
 * components is a rename waiting to break silently at runtime — React Router's
 * `<Link to>` takes a plain string, so a typo is not a type error. Centralising
 * the builders makes renaming a route a single-file edit.
 *
 * Distinct from `src/routes.ts`, which is React Router's route *table*. This is
 * the address book the app links against.
 */

/** Homepage section anchors. Shared so the nav and the sections cannot drift. */
export const SECTION_IDS = {
  intro: 'intro',
  systems: 'systems',
  engineering: 'engineering',
  experience: 'experience',
  notes: 'notes',
  about: 'about',
  contact: 'contact',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

export const routes = {
  home: () => '/',
  /** A homepage anchor, addressable from any route. */
  section: (id: SectionId) => `/#${id}`,
  work: () => '/work',
  system: (slug: string) => `/work/${slug}`,
  notes: () => '/notes',
  note: (slug: string) => `/notes/${slug}`,
} as const

/** Static files served from `public/`, not route-table entries. */
export const assets = {
  resume: '/resume.pdf',
  ogImage: '/og/default.png',
} as const

export function mailto(email: string) {
  return `mailto:${email}`
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

/**
 * Spread onto an anchor so external links never open without `rel`.
 *
 * Local PDFs count: the résumé is a document people skim and come back from,
 * and letting it replace the page means the visitor has to hit Back to return
 * to the portfolio — or, in a browser that hands the PDF to a native viewer,
 * loses it altogether.
 */
export function externalLinkProps(href: string) {
  const opensAway = isExternal(href) || href.endsWith('.pdf')

  return opensAway ? ({ target: '_blank', rel: 'noreferrer noopener' } as const) : {}
}
