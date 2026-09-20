import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { assets, externalLinkProps, mailto, routes } from '@/lib/routes'
import type { Profile, SectionCopy } from '@/types'

type IntroProps = {
  index: number
  section: SectionCopy
  profile: Profile
}

/**
 * The page's only <h1>. No top rule here — the sticky header already draws one,
 * and two hairlines a row apart read as a mistake.
 */
export function Intro({ index, section, profile }: IntroProps) {
  return (
    <section id={section.id} className="scroll-mt-20 pt-16 sm:pt-24">
      <Reveal as="p" className="meta">
        <span className="text-accent tabular-nums">{String(index).padStart(2, '0')}</span>
        <span aria-hidden className="text-muted">
          {' / '}
        </span>
        <span className="text-muted">{section.label}</span>
      </Reveal>

      <Reveal
        as="h1"
        delay={60}
        className="mt-8 max-w-5xl text-h1 font-medium tracking-tight text-balance"
      >
        {profile.headline}
      </Reveal>

      <Reveal as="p" delay={120} className="mt-8 max-w-2xl text-lead text-pretty text-muted">
        {profile.lead}
      </Reveal>

      <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="meta text-muted">{profile.location}</span>
        <span aria-hidden className="size-1 rounded-full bg-rule" />
        <span className="meta text-accent">{profile.availability}</span>
      </Reveal>

      <Reveal as="p" delay={220} className="mt-4 max-w-xl text-muted">
        {profile.experienceSummary}
      </Reveal>

      <Reveal delay={280} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          to={routes.work()}
          className="group flex items-center gap-2 border-b border-fg pb-1.5 meta transition-colors hover:border-accent hover:text-accent"
        >
          Selected work
          <ArrowRight
            aria-hidden
            className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>

        <a
          href={assets.resume}
          {...externalLinkProps(assets.resume)}
          className="group flex items-center gap-2 border-b border-transparent pb-1.5 meta text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Résumé
          <ArrowUpRight aria-hidden className="size-3" />
        </a>

        <a
          href={mailto(profile.email)}
          className="group flex items-center gap-2 border-b border-transparent pb-1.5 meta text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {profile.email}
        </a>
      </Reveal>
    </section>
  )
}
