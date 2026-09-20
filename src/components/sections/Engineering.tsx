import { SectionHeader } from '@/components/layout/SectionHeader'
import { sectionHeadingId } from '@/lib/routes'
import { Reveal } from '@/components/motion/Reveal'
import type { EngineeringGroup, SectionCopy } from '@/types'

type EngineeringProps = {
  index: number
  section: SectionCopy
  groups: EngineeringGroup[]
}

/**
 * Grouped capability rather than a skill dump — and deliberately no proficiency
 * bars, stars or percentages. A number against "PostgreSQL" is unfalsifiable
 * and reads as padding to the engineers who make the hiring call.
 */
export function Engineering({ index, section, groups }: EngineeringProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={sectionHeadingId(section.id)}
      className="scroll-mt-20 pt-section"
    >
      <SectionHeader
        headingId={sectionHeadingId(section.id)}
        index={index}
        label={section.label}
        title={section.title}
        lede={section.lede}
      />

      <dl className="mt-12">
        {groups.map((group, position) => (
          <Reveal
            key={group.group}
            delay={position * 40}
            className="grid gap-4 border-t border-rule py-7 md:grid-cols-12 md:gap-10"
          >
            <dt className="meta text-muted md:col-span-3">{group.group}</dt>
            <dd className="md:col-span-9">
              <ul className="flex flex-wrap gap-x-2 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-editorial border border-rule bg-surface/60 px-2.5 py-1.5 meta text-fg normal-case"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
