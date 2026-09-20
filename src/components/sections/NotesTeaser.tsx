import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Reveal } from '@/components/motion/Reveal'
import { routes, sectionHeadingId } from '@/lib/routes'
import type { Note, SectionCopy } from '@/types'

type NotesTeaserProps = {
  index: number
  section: SectionCopy
  notes: Note[]
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * Only ever rendered when something is published — the homepage drops this
 * section entirely while `notes.json` holds nothing but drafts. An empty
 * "Engineering notes" heading advertises abandonment; no heading says nothing.
 */
export function NotesTeaser({ index, section, notes }: NotesTeaserProps) {
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

      <ul className="mt-12">
        {notes.map((note, position) => (
          <li key={note.slug}>
            <Reveal delay={position * 40}>
              <Link
                to={routes.note(note.slug)}
                className="group grid gap-3 border-t border-rule py-8 md:grid-cols-12 md:gap-10"
              >
                <div className="md:col-span-3">
                  <time dateTime={note.date} className="meta text-muted">
                    {DATE_FORMAT.format(new Date(note.date))}
                  </time>
                  <p className="mt-1.5 meta text-muted">{note.readingMinutes} min read</p>
                </div>

                <div className="md:col-span-9">
                  <h3 className="text-h3 font-medium tracking-tight text-balance transition-colors group-hover:text-accent">
                    {note.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-pretty text-muted">{note.summary}</p>
                  <p className="mt-4 meta text-muted">{note.tags.join(' · ')}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="border-t border-rule pt-8">
        <Link
          to={routes.notes()}
          className="group flex items-center gap-2 border-b border-fg pb-1.5 meta transition-colors hover:border-accent hover:text-accent"
        >
          All notes
          <ArrowRight
            aria-hidden
            className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </Reveal>
    </section>
  )
}
