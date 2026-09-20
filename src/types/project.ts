export type Project = {
  name: string
  repo: string
  description: string
  stack: string[]
  /** Why this repo earns its place next to the others. */
  relevance: string
}
