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

/**
 * Id of the heading that names a spine section.
 *
 * A `<section>` is only exposed as a landmark when it has an accessible name,
 * so without this the homepage is one long region and the spine — the whole
 * organising idea of the page — is invisible to anyone navigating by landmark.
 * Derived rather than written out so the id cannot drift from the section's.
 */
export function sectionHeadingId(id: SectionId) {
  return `${id}-heading`
}

export const routes = {
  home: () => '/',
  /** A homepage anchor, addressable from any route. */
  section: (id: SectionId) => `/#${id}`,
  work: () => '/work',
  system: (slug: string) => `/work/${slug}`,
  notes: () => '/notes',
  note: (slug: string) => `/notes/${slug}`,
} as const

/**
 * Static files served from `public/`, not route-table entries.
 *
 * Social-card images are not here — they are per-page and generated at build
 * time, so their paths are built by `ogImagePath` in `lib/seo.ts` alongside the
 * script that writes them.
 */
export const assets = {
  resume: '/resume.pdf',
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
