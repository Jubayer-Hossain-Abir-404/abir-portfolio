import { SECTION_IDS, type SectionId } from '@/lib/routes'

/**
 * Editorial copy for one entry in the homepage spine.
 *
 * The number is not stored: it is the section's position at render time, so
 * cutting a section (as Optimization passes was) renumbers the rest instead of
 * leaving a hole. `label` is the mono marker; `title` and `lede` are optional
 * because the intro supplies its own from the profile.
 */
export type SectionCopy = {
  id: SectionId
  label: string
  title?: string
  lede?: string
}

/**
 * JSON imports widen string literals, so `id` arrives as plain `string`.
 * Narrowing through a guard keeps an unknown id a build failure rather than a
 * section that silently fails to match its anchor.
 */
export function isSectionId(value: string): value is SectionId {
  return Object.values(SECTION_IDS).includes(value as SectionId)
}
