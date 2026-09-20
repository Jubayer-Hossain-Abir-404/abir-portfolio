import { cn } from 'cn'
import type { Figure } from '@/types'

type FigureRowProps = {
  figures: Figure[]
  /** Case studies show provenance inline; the homepage keeps it to a tooltip. */
  showSource?: boolean
  className?: string
}

/**
 * Substantiated numbers. Renders nothing at all when a system has none, which
 * is the entire point — a system without cleared figures shows no figures
 * rather than padded ones.
 */
export function FigureRow({ figures, showSource = false, className }: FigureRowProps) {
  if (figures.length === 0) return null

  return (
    <ul className={cn('grid grid-cols-3 gap-4 border-t border-rule pt-6', className)}>
      {figures.map((figure) => (
        <li key={figure.label}>
          <p
            className="font-mono text-h3 tracking-tight tabular-nums"
            title={showSource ? undefined : `Source: ${figure.source}`}
          >
            {figure.value}
          </p>
          <p className="mt-1.5 meta text-muted normal-case">{figure.label}</p>
          {showSource ? <p className="mt-2 meta text-muted">Source: {figure.source}</p> : null}
        </li>
      ))}
    </ul>
  )
}
