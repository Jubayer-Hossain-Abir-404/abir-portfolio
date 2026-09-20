import type { Link } from './common'

export type Portrait = {
  src: string
  alt: string
  caption?: string
}

export type Education = {
  degree: string
  institution: string
  period: string
}

export type Profile = {
  name: string
  shortName: string
  role: string
  headline: string
  lead: string
  location: string
  availability: string
  experienceSummary: string
  email: string
  resumePath: string
  portrait: Portrait
  about: string[]
  education: Education
}

export type Social = Link & {
  handle?: string
  /** Primary links surface in the header; the rest only in the footer. */
  primary?: boolean
}
