import { cn } from 'cn'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'

type PassageProps = {
  id: string
  label: string
  children: ReactNode
  className?: string
}

/**
 * One titled block of a case study.
 *
 * The heading is the mono marker rather than display type, because a case study
 * has one subject and it is named in the `<h1>`. Six large headings underneath
 * it would compete with the title and turn a single argument into six unrelated
 * ones. `aria-labelledby` keeps each block a properly named region regardless
 * of how quiet it looks.
 */
export function Passage({ id, label, children, className }: PassageProps) {
  return (
    <section aria-labelledby={id} className={cn('border-t border-rule pt-6', className)}>
      <Reveal as="h2" id={id} className="meta text-muted">
        {label}
      </Reveal>
      {children}
    </section>
  )
}

/** Body copy at a measure that stays readable — never the full page width. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal as="p" delay={60} className={cn('mt-6 max-w-2xl text-pretty', className)}>
      {children}
    </Reveal>
  )
}
