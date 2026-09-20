import { cn } from 'cn'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'

type SectionHeaderProps = {
  /** Position in the spine. Rendered zero-padded; computed, never hardcoded. */
  index: number
  label: string
  title?: ReactNode
  lede?: string
  className?: string
  /**
   * Lands on whichever element ends up being the <h2>, so the enclosing
   * <section> can point `aria-labelledby` at it and become a named landmark.
   */
  headingId?: string
}

/**
 * The numbered spine. A hairline rule, the mono marker, then optional display
 * type — repeated identically down the page so the sections read as one
 * document rather than a stack of unrelated blocks.
 *
 * Exactly one <h2> comes out either way: the display title when there is one,
 * otherwise the marker itself. A section is never left without a heading, and
 * never given two.
 */
export function SectionHeader({
  index,
  label,
  title,
  lede,
  className,
  headingId,
}: SectionHeaderProps) {
  const marker = (
    <>
      <span className="text-accent tabular-nums">{String(index).padStart(2, '0')}</span>
      <span aria-hidden className="text-muted">
        {' / '}
      </span>
      <span className="text-muted">{label}</span>
    </>
  )

  return (
    <header className={cn('border-t border-rule pt-5', className)}>
      {title ? (
        <>
          <Reveal as="p" className="meta">
            {marker}
          </Reveal>
          <Reveal
            as="h2"
            id={headingId}
            delay={60}
            className="mt-8 max-w-4xl text-h2 font-medium tracking-tight text-balance"
          >
            {title}
          </Reveal>
        </>
      ) : (
        <Reveal as="h2" id={headingId} className="meta">
          {marker}
        </Reveal>
      )}

      {lede ? (
        <Reveal as="p" delay={120} className="mt-5 max-w-2xl text-lead text-pretty text-muted">
          {lede}
        </Reveal>
      ) : null}
    </header>
  )
}
