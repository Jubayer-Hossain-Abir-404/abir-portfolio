import type { Figure, Link } from './common'

export type Decision = {
  title: string
  body: string
  /** The cost that was accepted. Stating it is the point of the section. */
  tradeoff: string
}

export type System = {
  slug: string
  name: string
  subtitle: string
  org: string
  period: string
  role: string
  team?: string
  /** Featured systems appear on the homepage; the rest live on /work. */
  featured: boolean
  /** Client systems carry the "no public deployment" disclosure. */
  confidential: boolean
  stack: string[]
  /** Key into the diagram registry; null renders the case study without one. */
  diagram: string | null
  summary: string
  problem: string
  approach: string
  decisions: Decision[]
  figures: Figure[]
  /** "What I'd do differently" — omitted rather than padded. */
  lessons?: string
  links?: Link[]
}
