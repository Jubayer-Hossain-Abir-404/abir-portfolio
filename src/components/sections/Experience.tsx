import { SectionHeader } from '@/components/layout/SectionHeader'
import { Reveal } from '@/components/motion/Reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Experience as ExperienceEntry, SectionCopy } from '@/types'

type ExperienceProps = {
  index: number
  section: SectionCopy
  entries: ExperienceEntry[]
}

function Role({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-4">
        <h3 className="font-medium tracking-tight text-balance">{entry.org}</h3>
        <p className="mt-2 meta text-accent">{entry.role}</p>
        <p className="mt-1.5 meta text-muted">{entry.period}</p>
        <p className="mt-1.5 meta text-muted">{entry.location}</p>
      </div>

      <ul className="space-y-3 md:col-span-8">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-pretty">
            <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-rule" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Experience({ index, section, entries }: ExperienceProps) {
  const primary = entries.filter((entry) => !entry.secondary)
  const secondary = entries.filter((entry) => entry.secondary)

  return (
    <section id={section.id} className="scroll-mt-20 pt-section">
      <SectionHeader
        index={index}
        label={section.label}
        title={section.title}
        lede={section.lede}
      />

      <div className="mt-12">
        {primary.map((entry, position) => (
          <Reveal
            key={`${entry.org}-${entry.period}`}
            delay={position * 40}
            className="border-t border-rule py-10"
          >
            <Role entry={entry} />
          </Reveal>
        ))}
      </div>

      {/* Early-career roles stay on the page but out of the way: relevant for
          completeness, not worth the vertical space of the senior roles. */}
      {secondary.length > 0 ? (
        <Reveal>
          <Accordion>
            <AccordionItem value="early-career" className="border-t border-rule">
              <AccordionTrigger className="py-5 meta text-muted">
                Earlier roles ({secondary.length})
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-10 pt-2">
                  {secondary.map((entry) => (
                    <Role key={`${entry.org}-${entry.period}`} entry={entry} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Reveal>
      ) : null}
    </section>
  )
}
