import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Reveal } from '@/components/motion/Reveal'
import { externalLinkProps, mailto } from '@/lib/routes'
import type { Profile, SectionCopy, Social } from '@/types'

type ContactProps = {
  index: number
  section: SectionCopy
  profile: Profile
  social: Social[]
}

export function Contact({ index, section, profile, social }: ContactProps) {
  return (
    <section id={section.id} className="scroll-mt-20 pt-section">
      <SectionHeader
        index={index}
        label={section.label}
        title={section.title}
        lede={section.lede}
      />

      <Reveal className="mt-12 border-t border-rule pt-10">
        {/* The email is the payload of this section, so it is set at display
            size rather than buried in a button. */}
        <a
          href={mailto(profile.email)}
          className="group inline-block max-w-full font-mono text-h3 tracking-tight break-all transition-colors hover:text-accent"
        >
          {profile.email}
          <span
            aria-hidden
            className="ml-3 inline-block text-muted transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </a>

        <p className="mt-8 meta text-muted">{profile.location}</p>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-12 grid gap-x-10 gap-y-6 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {social.map((item) => (
          <a key={item.href} href={item.href} {...externalLinkProps(item.href)} className="group">
            <span className="flex items-center gap-1.5 meta text-muted transition-colors group-hover:text-accent">
              {item.label}
              <ArrowUpRight aria-hidden className="size-3" />
            </span>
            {item.handle ? (
              <span className="mt-2 block truncate text-sm text-muted transition-colors group-hover:text-fg">
                {item.handle}
              </span>
            ) : null}
          </a>
        ))}
      </Reveal>
    </section>
  )
}
