import { cn } from 'cn'

type StackLineProps = {
  items: string[]
  className?: string
}

/**
 * Technical metadata is always monospace, always dot-separated. The separators
 * are real elements rather than a `join('·')` so they can be hidden from
 * assistive tech — a screen reader should hear the stack, not the punctuation.
 */
export function StackLine({ items, className }: StackLineProps) {
  return (
    <span className={cn('flex flex-wrap gap-x-2 gap-y-1 meta', className)}>
      {items.map((item, i) => (
        <span key={item}>
          {item}
          {i < items.length - 1 ? (
            <span aria-hidden className="ml-2 text-muted">
              ·
            </span>
          ) : null}
        </span>
      ))}
    </span>
  )
}
