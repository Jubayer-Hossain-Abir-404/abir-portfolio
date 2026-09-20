import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '@/lib/routes'
import type { System } from '@/types'

type CaseStudyNavProps = {
  previous?: System
  next?: System
}

/**
 * Where to go after a case study.
 *
 * Both ends are always occupied: whichever side has no neighbour falls back to
 * the index, so a reader is never left at the bottom of a long page with the
 * browser's Back button as the only way out.
 */
export function CaseStudyNav({ previous, next }: CaseStudyNavProps) {
  return (
    <nav
      aria-label="More work"
      className="mt-20 grid gap-px border-t border-rule bg-rule sm:grid-cols-2 lg:mt-28"
    >
      <Link
        to={previous ? routes.system(previous.slug) : routes.work()}
        className="group flex flex-col gap-2 bg-bg px-1 py-8 sm:px-6"
      >
        <span className="flex items-center gap-2 meta text-muted">
          <ArrowLeft
            aria-hidden
            className="size-3 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
          />
          {previous ? 'Previous' : 'All work'}
        </span>
        <span className="text-h3 font-medium tracking-tight text-balance transition-colors group-hover:text-accent">
          {previous?.name ?? 'Every system'}
        </span>
      </Link>

      <Link
        to={next ? routes.system(next.slug) : routes.work()}
        className="group flex flex-col gap-2 bg-bg px-1 py-8 sm:items-end sm:px-6 sm:text-right"
      >
        <span className="flex items-center gap-2 meta text-muted">
          {next ? 'Next' : 'All work'}
          <ArrowRight
            aria-hidden
            className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
        <span className="text-h3 font-medium tracking-tight text-balance transition-colors group-hover:text-accent">
          {next?.name ?? 'Every system'}
        </span>
      </Link>
    </nav>
  )
}
