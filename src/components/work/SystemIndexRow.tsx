import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { routes } from '@/lib/routes'
import type { System } from '@/types'
import { ConfidentialNotice } from './ConfidentialNotice'
import { StackLine } from './StackLine'

type SystemIndexRowProps = {
  system: System
  /** Zero-based position in the index. Drives the numeral only. */
  position: number
}

/**
 * A row on `/work`.
 *
 * The whole row is one link rather than a title link with a paragraph beside
 * it, so the click target is the size of the thing being pointed at. That rules
 * out nesting the external repository link here — it lives on the case study,
 * one step further in, where it is not competing with the row that contains it.
 */
export function SystemIndexRow({ system, position }: SystemIndexRowProps) {
  return (
    <li>
      <Reveal>
        <Link
          to={routes.system(system.slug)}
          className="group grid items-start gap-x-10 gap-y-4 border-t border-rule py-8 md:grid-cols-12 lg:py-10"
        >
          <p className="meta text-accent tabular-nums md:col-span-1">
            {String(position + 1).padStart(2, '0')}
          </p>

          <div className="md:col-span-4">
            <h2 className="text-h3 font-medium tracking-tight text-balance transition-colors group-hover:text-accent">
              {system.name}
            </h2>
            <p className="mt-2 text-pretty text-muted">{system.subtitle}</p>
            <p className="mt-4 meta text-muted">
              {system.org}
              <span aria-hidden className="mx-2">
                ·
              </span>
              {system.period}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-6">
            <p className="max-w-xl text-pretty">{system.summary}</p>
            <StackLine items={system.stack} className="mt-5 text-muted" />
            {system.confidential ? <ConfidentialNotice className="mt-4" /> : null}
          </div>

          <ArrowRight
            aria-hidden
            className="hidden size-4 justify-self-end text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none md:col-span-1 md:block"
          />
        </Link>
      </Reveal>
    </li>
  )
}
