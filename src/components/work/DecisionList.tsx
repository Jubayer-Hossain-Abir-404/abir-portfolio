import { Reveal } from '@/components/motion/Reveal'
import type { Decision } from '@/types'

/**
 * The decisions, each with the cost that was accepted.
 *
 * The tradeoff is set apart rather than run on as another sentence, because a
 * decision stated without its cost is marketing. Making it a fixed, visible
 * slot means an entry with nothing in it would be conspicuous — which is the
 * pressure that keeps them honest.
 */
export function DecisionList({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) return null

  return (
    <ol className="mt-8">
      {decisions.map((decision, position) => (
        <li
          key={decision.title}
          className="grid gap-6 border-t border-rule py-10 md:grid-cols-12 md:gap-10 lg:py-12"
        >
          <Reveal className="md:col-span-4">
            <p className="meta text-accent tabular-nums">{String(position + 1).padStart(2, '0')}</p>
            <h3 className="mt-3 text-h3 font-medium tracking-tight text-balance">
              {decision.title}
            </h3>
          </Reveal>

          <Reveal delay={60} className="md:col-span-8 md:col-start-5">
            <p className="max-w-2xl text-pretty">{decision.body}</p>

            <div className="mt-6 border-l border-accent pl-5">
              <p className="meta text-muted">Tradeoff</p>
              <p className="mt-2 max-w-2xl text-pretty text-muted">{decision.tradeoff}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
