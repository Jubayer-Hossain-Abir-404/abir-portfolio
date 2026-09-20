import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { externalLinkProps, routes } from '@/lib/routes'
import type { System } from '@/types'
import { ConfidentialNotice } from './ConfidentialNotice'
import { StackLine } from './StackLine'

/**
 * The opening of a case study: what it is, who built it, when, and on what.
 *
 * Deliberately not the homepage's `MetadataSlab`. The slab is a *substitute*
 * for a picture — a ruled block that gives a system block its visual
 * counterweight when there is no diagram beside it. Here the diagram follows
 * immediately, so the same facts are set as a quiet run of rows instead of
 * competing with it.
 */
export function CaseStudyHeader({ system }: { system: System }) {
  const rows = [
    { term: 'Role', value: system.role },
    { term: 'Period', value: system.period },
    { term: 'Org', value: system.org },
    ...(system.team ? [{ term: 'Team', value: system.team }] : []),
  ]

  return (
    <header className="pt-10 lg:pt-16">
      <Reveal as="p">
        <Link
          to={routes.work()}
          className="group inline-flex items-center gap-2 meta text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft
            aria-hidden
            className="size-3 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
          />
          All work
        </Link>
      </Reveal>

      <Reveal
        as="h1"
        delay={60}
        className="mt-8 max-w-4xl text-h1 font-medium tracking-tight text-balance"
      >
        {system.name}
      </Reveal>

      <Reveal as="p" delay={100} className="mt-5 max-w-2xl text-lead text-pretty text-muted">
        {system.subtitle}
      </Reveal>

      <Reveal delay={140} className="mt-10 border-t border-rule pt-6">
        <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((row) => (
            <div key={row.term}>
              <dt className="meta text-muted">{row.term}</dt>
              <dd className="mt-1.5 meta">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-rule pt-6">
          <p className="meta text-muted">Stack</p>
          <StackLine items={system.stack} className="mt-1.5" />
        </div>

        {system.confidential ? <ConfidentialNotice className="mt-6" /> : null}

        {system.links && system.links.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {system.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...externalLinkProps(link.href)}
                className="flex items-center gap-2 border-b border-fg pb-1.5 meta transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="size-3" />
              </a>
            ))}
          </div>
        ) : null}
      </Reveal>
    </header>
  )
}
