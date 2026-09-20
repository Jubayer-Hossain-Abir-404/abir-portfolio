import type { Link } from './common'

export const RESEARCH_KINDS = ['thesis', 'publication'] as const

export type ResearchKind = (typeof RESEARCH_KINDS)[number]

export type Research = {
  title: string
  kind: ResearchKind
  year: string
  venue: string
  description: string
  links?: Link[]
}

/**
 * JSON imports widen string literals, so union-typed fields arrive as plain
 * `string`. Narrowing happens through this guard rather than being asserted
 * away, which keeps a typo in the data a build failure instead of a silent bad
 * render.
 */
export function isResearchKind(value: string): value is ResearchKind {
  return (RESEARCH_KINDS as readonly string[]).includes(value)
}
