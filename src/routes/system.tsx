import { CaseStudyHeader } from '@/components/work/CaseStudyHeader'
import { CaseStudyNav } from '@/components/work/CaseStudyNav'
import { DecisionList } from '@/components/work/DecisionList'
import { FigureRow } from '@/components/work/FigureRow'
import { Passage, Prose } from '@/components/work/Passage'
import { SystemDiagram } from '@/components/work/diagrams'
import { getAdjacentSystems, getSystemBySlug } from '@/lib/content'
import type { Route } from './+types/system'

export async function loader({ params }: Route.LoaderArgs) {
  const system = await getSystemBySlug(params.slug)

  if (!system) {
    throw new Response('Not found', { status: 404 })
  }

  return { system, ...(await getAdjacentSystems(params.slug)) }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const system = loaderData?.system

  return [
    { title: `${system?.name ?? 'Case study'} — Md. Jubayer Hossain Abir` },
    { name: 'description', content: system?.summary },
  ]
}

/**
 * One case study, in the order an engineer reads a system: what it is, what it
 * looks like, what was wrong, what was built, what each choice cost, what the
 * numbers are, and what should have been done differently.
 *
 * Every block below the diagram is conditional on having something to say.
 * A system with no cleared figures shows no figures section, and the only
 * system with a `lessons` entry gets the one closing block — padding either out
 * would cost more credibility than the empty space does.
 */
export default function SystemRoute({ loaderData }: Route.ComponentProps) {
  const { system, previous, next } = loaderData

  return (
    <main id="main" className="mx-auto max-w-[88rem] px-gutter pb-24">
      <article>
        <CaseStudyHeader system={system} />

        <SystemDiagram diagram={system.diagram} className="mt-14 lg:mt-20" />

        <div className="mt-16 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          <Passage id="problem" label="Problem">
            <Prose>{system.problem}</Prose>
          </Passage>

          <Passage id="approach" label="Approach">
            <Prose>{system.approach}</Prose>
          </Passage>

          {system.decisions.length > 0 ? (
            <Passage id="decisions" label="Key decisions">
              <DecisionList decisions={system.decisions} />
            </Passage>
          ) : null}

          {system.figures.length > 0 ? (
            <Passage id="figures" label="Substantiated figures">
              <FigureRow figures={system.figures} showSource className="mt-8 border-t-0 pt-0" />
            </Passage>
          ) : null}

          {system.lessons ? (
            <Passage id="lessons" label="What I'd do differently">
              <Prose>{system.lessons}</Prose>
            </Passage>
          ) : null}
        </div>
      </article>

      <CaseStudyNav previous={previous} next={next} />
    </main>
  )
}
