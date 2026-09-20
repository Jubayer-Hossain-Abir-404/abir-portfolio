export type Experience = {
  org: string
  role: string
  period: string
  location: string
  current?: boolean
  /** Early-career roles render collapsed inside the accordion. */
  secondary?: boolean
  bullets: string[]
}

export type EngineeringGroup = {
  group: string
  items: string[]
}
