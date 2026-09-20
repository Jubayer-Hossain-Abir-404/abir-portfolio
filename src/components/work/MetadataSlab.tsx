import { cn } from 'cn'
import type { System } from '@/types'
import { StackLine } from './StackLine'

type MetadataSlabProps = {
  system: System
  className?: string
}

type Row = {
  term: string
  value: string | string[]
}

/**
 * The visual counterweight to a system's prose — a ruled block of monospace
 * facts rather than an image. It stands in for the architecture diagram on the
 * homepage; the diagram itself belongs on the case study, where there is room
 * to read it.
 */
export function MetadataSlab({ system, className }: MetadataSlabProps) {
  const rows: Row[] = [
    { term: 'Role', value: system.role },
    { term: 'Period', value: system.period },
    { term: 'Org', value: system.org },
    ...(system.team ? [{ term: 'Team', value: system.team }] : []),
    { term: 'Stack', value: system.stack },
  ]

  return (
    <dl className={cn('divide-y divide-rule border-y border-rule bg-surface/60', className)}>
      {rows.map((row) => (
        <div key={row.term} className="flex gap-4 px-5 py-3">
          <dt className="w-16 shrink-0 meta text-muted">{row.term}</dt>
          <dd className="min-w-0 flex-1">
            {Array.isArray(row.value) ? (
              <StackLine items={row.value} />
            ) : (
              <span className="meta">{row.value}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
