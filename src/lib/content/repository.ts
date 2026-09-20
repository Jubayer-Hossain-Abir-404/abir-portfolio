import engineeringData from '@/data/engineering.json'
import experienceData from '@/data/experience.json'
import notesData from '@/data/notes.json'
import profileData from '@/data/profile.json'
import projectsData from '@/data/projects.json'
import researchData from '@/data/research.json'
import sectionsData from '@/data/sections.json'
import socialData from '@/data/social.json'
import systemsData from '@/data/systems.json'
import { isResearchKind } from '@/types/research'
import { isSectionId } from '@/types/section'
import type {
  EngineeringGroup,
  Experience,
  Note,
  Profile,
  Project,
  Research,
  SectionCopy,
  Social,
  System,
} from '@/types'

/**
 * The only module in the app that knows where content comes from.
 *
 * Every function is async even though v1 resolves from local JSON. That is
 * deliberate: when this content moves behind an API, only the bodies below
 * change — no route, loader or component is touched. Runtime validation belongs
 * here too at that point, since that is where the data stops being ours.
 */

const profile = profileData satisfies Profile
const social = socialData satisfies Social[]
const systems = systemsData satisfies System[]
const experience = experienceData satisfies Experience[]
const engineering = engineeringData satisfies EngineeringGroup[]
const projects = projectsData satisfies Project[]
const notes = notesData satisfies Note[]

/**
 * `kind` widens to `string` on import, so it is narrowed through the guard. A
 * typo in the data throws at build time rather than rendering as a wrong label.
 */
const research: Research[] = researchData.map((entry) => {
  if (!isResearchKind(entry.kind)) {
    throw new Error(`research.json: unknown kind "${entry.kind}" for "${entry.title}"`)
  }

  // Fields are listed rather than spread so the compiler checks each one
  // against the type, instead of letting a stray key through unnoticed.
  return {
    title: entry.title,
    kind: entry.kind,
    year: entry.year,
    venue: entry.venue,
    description: entry.description,
    links: entry.links,
  }
})

/** Same widening problem as `research.kind`, narrowed the same way. */
const sections: SectionCopy[] = sectionsData.map((entry) => {
  if (!isSectionId(entry.id)) {
    throw new Error(`sections.json: unknown section id "${entry.id}"`)
  }

  return {
    id: entry.id,
    label: entry.label,
    title: entry.title,
    lede: entry.lede,
  }
})

export async function getProfile(): Promise<Profile> {
  return profile
}

/**
 * Homepage spine copy, in render order. Position determines the number, so
 * reordering or cutting a section here is all it takes — nothing renumbers by
 * hand.
 */
export async function getSections(): Promise<SectionCopy[]> {
  return sections
}

export async function getSocial(): Promise<Social[]> {
  return social
}

export async function getSystems(): Promise<System[]> {
  return systems
}

export async function getFeaturedSystems(): Promise<System[]> {
  return systems.filter((system) => system.featured)
}

export async function getSystemBySlug(slug: string): Promise<System | undefined> {
  return systems.find((system) => system.slug === slug)
}

export async function getSystemSlugs(): Promise<string[]> {
  return systems.map((system) => system.slug)
}

export async function getExperience(): Promise<Experience[]> {
  return experience
}

export async function getEngineering(): Promise<EngineeringGroup[]> {
  return engineering
}

export async function getProjects(): Promise<Project[]> {
  return projects
}

export async function getResearch(): Promise<Research[]> {
  return research
}

/** Published notes only, newest first. Drafts never reach a build. */
export async function getNotes(): Promise<Note[]> {
  return notes.filter((note) => note.published).toSorted((a, b) => b.date.localeCompare(a.date))
}

export async function getNoteBySlug(slug: string): Promise<Note | undefined> {
  const note = notes.find((entry) => entry.slug === slug)

  return note?.published ? note : undefined
}

export async function getNoteSlugs(): Promise<string[]> {
  return notes.filter((note) => note.published).map((note) => note.slug)
}
