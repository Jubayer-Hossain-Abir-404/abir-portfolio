import type { MetaDescriptor } from 'react-router'
import type { Profile, Social } from '@/types'
import { isExternal } from './routes'

/**
 * Absolute URLs and social-card metadata.
 *
 * Everything a crawler or a link unfurler reads has to be an *absolute* URL —
 * a relative `og:image` is silently dropped by every major scraper — so the
 * site's own origin has to be known at build time. It is not derivable from
 * inside a static build, hence the env var.
 *
 * `VITE_SITE_URL` is supplied by `netlify.toml`, which passes Netlify's own
 * `$URL`. The fallback below only ever applies to a local `npm run build`, and
 * exists so that building without the env var produces obviously-wrong URLs
 * rather than subtly broken relative ones.
 *
 * Content is *not* imported here. This module composes metadata out of values
 * its callers pass in, so the repository stays the only thing that knows where
 * content lives.
 */

const FALLBACK_ORIGIN = 'https://abir-portfolio.netlify.app'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || FALLBACK_ORIGIN).replace(/\/+$/, '')

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Facebook's minimum for a large card; also what Twitter/X and LinkedIn expect. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

/**
 * Social-card image for a page.
 *
 * `key` matches the file `scripts/generate-og.mjs` writes. **The two have to
 * agree**: the script builds the same `og/<key>.png` name from the same slugs,
 * and it cannot import this module because it runs outside the path aliases.
 * Change the shape here and change it there.
 */
export function ogImagePath(key = 'default') {
  return `/og/${key}.png`
}

/** Case studies and notes namespace their keys so slugs cannot collide. */
export const ogKeys = {
  home: 'default',
  work: 'work',
  notes: 'notes',
  system: (slug: string) => `work-${slug}`,
  note: (slug: string) => `notes-${slug}`,
} as const

/** `<title>` for any page that is not the homepage. */
export function titleFor(page: string, owner: string) {
  return `${page} — ${owner}`
}

type PageMetaInput = {
  /** The complete document title, already composed. */
  title: string
  description: string
  /** Route path, leading slash, no origin. */
  path: string
  /** Owner's name — `og:site_name`, and the image's alt text. */
  siteName: string
  ogKey?: string
  type?: 'website' | 'article'
}

/**
 * The full metadata block for one page: title, description, canonical, Open
 * Graph and Twitter.
 *
 * Returned as one array rather than assembled per route so a page cannot ship
 * with, say, an `og:title` and no `og:image` — the commonest way a link
 * preview ends up blank.
 */
export function pageMeta({
  title,
  description,
  path,
  siteName,
  ogKey,
  type = 'website',
}: PageMetaInput): MetaDescriptor[] {
  const url = absoluteUrl(path)
  const image = absoluteUrl(ogImagePath(ogKey))

  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },

    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(OG_IMAGE_SIZE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE_SIZE.height) },
    { property: 'og:image:alt', content: title },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
}

/**
 * `Person` structured data for the homepage.
 *
 * Only facts already published on the page go in — name, role, location,
 * education, and the profiles linked in the footer. Nothing is asserted here
 * that a reader cannot also see, which is both the schema.org guidance and the
 * only version that stays true when the page copy changes.
 */
export function personJsonLd(profile: Profile, social: Social[]): MetaDescriptor {
  const sameAs = social.filter((entry) => isExternal(entry.href)).map((entry) => entry.href)

  return {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.lead,
      url: absoluteUrl('/'),
      image: absoluteUrl(profile.portrait.src),
      email: `mailto:${profile.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: profile.education.institution,
      },
      sameAs,
    },
  }
}
