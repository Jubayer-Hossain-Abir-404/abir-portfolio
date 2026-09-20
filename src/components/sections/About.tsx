import { ArrowUpRight } from 'lucide-react'
import { Portrait } from '@/components/layout/Portrait'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Reveal } from '@/components/motion/Reveal'
import { externalLinkProps, sectionHeadingId } from '@/lib/routes'
import type { Profile, Research, SectionCopy } from '@/types'

type AboutProps = {
  index: number
  section: SectionCopy
  profile: Profile
  research: Research[]
}

function ResearchEntry({ entry }: { entry: Research }) {
  return (
    <li className="border-t border-rule py-6">
      <p className="meta text-muted">
        {entry.kind} · {entry.year} · {entry.venue}
      </p>
      <h4 className="mt-3 font-medium tracking-tight text-balance">{entry.title}</h4>
      <p className="mt-2 text-sm text-pretty text-muted">{entry.description}</p>

      {entry.links?.length ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {entry.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...externalLinkProps(link.href)}
              className="flex items-center gap-1.5 meta text-muted transition-colors hover:text-accent"
            >
              {link.label}
              <ArrowUpRight aria-hidden className="size-3" />
            </a>
          ))}
        </div>
      ) : null}
    </li>
  )
}

export function About({ index, section, profile, research }: AboutProps) {
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

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <Portrait portrait={profile.portrait} />

          <dl className="mt-8 border-t border-rule pt-6">
            <dt className="meta text-muted">Education</dt>
            <dd className="mt-3">
              <p className="font-medium tracking-tight text-pretty">{profile.education.degree}</p>
              <p className="mt-2 meta text-muted">{profile.education.institution}</p>
              <p className="mt-1.5 meta text-muted">{profile.education.period}</p>
            </dd>
          </dl>
        </Reveal>

        <Reveal delay={80} className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <div className="space-y-6 text-lead text-pretty">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          {research.length > 0 ? (
            <div className="mt-12">
              <h3 className="meta text-muted">Research</h3>
              <ul className="mt-4">
                {research.map((entry) => (
                  <ResearchEntry key={entry.title} entry={entry} />
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
