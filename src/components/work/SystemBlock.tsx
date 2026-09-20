import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { externalLinkProps, routes } from '@/lib/routes'
import type { System } from '@/types'
import { ConfidentialNotice } from './ConfidentialNotice'
import { FigureRow } from './FigureRow'
import { MetadataSlab } from './MetadataSlab'

type SystemBlockProps = {
  system: System
  /** Zero-based position in the list; drives both the numeral and the side. */
  position: number
}

export function SystemBlock({ system, position }: SystemBlockProps) {
  // Blocks alternate sides so the section never settles into a card grid.
  // Below `md` everything stacks and the prose always leads.
  const flipped = position % 2 === 1

  return (
    <article className="grid gap-8 border-t border-rule py-12 md:grid-cols-12 md:gap-10 lg:py-16">
      <Reveal className={flipped ? 'md:order-2 md:col-span-7 md:col-start-6' : 'md:col-span-7'}>
        <p className="meta text-accent tabular-nums">{String(position + 1).padStart(2, '0')}</p>

        <h3 className="mt-4 text-h2 font-medium tracking-tight text-balance">{system.name}</h3>
        <p className="mt-2 text-lead text-pretty text-muted">{system.subtitle}</p>
        <p className="mt-6 max-w-xl text-pretty">{system.summary}</p>

        {system.confidential ? <ConfidentialNotice className="mt-6" /> : null}

        <FigureRow figures={system.figures} className="mt-6" />

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to={routes.system(system.slug)}
            className="group flex items-center gap-2 border-b border-fg pb-1.5 meta transition-colors hover:border-accent hover:text-accent"
          >
            Read the case study
            <ArrowRight
              aria-hidden
              className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>

          {system.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...externalLinkProps(link.href)}
              className="flex items-center gap-2 border-b border-transparent pb-1.5 meta text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
              <ArrowUpRight aria-hidden className="size-3" />
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal
        delay={80}
        className={
          flipped
            ? 'md:order-1 md:col-span-5 md:col-start-1 md:row-start-1 md:self-start'
            : 'md:col-span-5 md:self-start'
        }
      >
        <MetadataSlab system={system} />
      </Reveal>
    </article>
  )
}
