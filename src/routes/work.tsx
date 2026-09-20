import { Reveal } from '@/components/motion/Reveal'
import { OpenSourceStrip } from '@/components/work/OpenSourceStrip'
import { SystemIndexRow } from '@/components/work/SystemIndexRow'
import { getPageCopy, getProfile, getProjects, getSystems } from '@/lib/content'
import { routes } from '@/lib/routes'
import { ogKeys, pageMeta, titleFor } from '@/lib/seo'
import type { Route } from './+types/work'

export async function loader() {
  const [systems, projects, copy, profile] = await Promise.all([
    getSystems(),
    getProjects(),
    getPageCopy('work'),
    getProfile(),
  ])

  return { systems, projects, copy, profile }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { copy, profile } = loaderData

  return pageMeta({
    title: titleFor('Work', profile.name),
    description: copy.lede,
    path: routes.work(),
    siteName: profile.name,
    ogKey: ogKeys.work,
  })
}

/**
 * The full set, in the order `systems.json` lists them — newest first.
 *
 * No split between the systems the homepage features and the ones it does not.
 * `featured` decides what earns space on a first screen that has to work in
 * fifteen seconds; here there is room for all of it, and dividing the page into
 * a first and second class would only draw attention to the distinction.
 */
export default function Work({ loaderData }: Route.ComponentProps) {
  const { systems, projects, copy } = loaderData

  return (
    <main id="main" className="mx-auto max-w-[88rem] px-gutter pb-24">
      <header className="pt-10 lg:pt-16">
        <Reveal as="p" className="meta text-muted">
          Work
        </Reveal>

        <Reveal
          as="h1"
          delay={60}
          className="mt-8 max-w-4xl text-h1 font-medium tracking-tight text-balance"
        >
          {copy.title}
        </Reveal>

        <Reveal as="p" delay={120} className="mt-6 max-w-2xl text-lead text-pretty text-muted">
          {copy.lede}
        </Reveal>
      </header>

      <ul className="mt-14 lg:mt-20">
        {systems.map((system, position) => (
          <SystemIndexRow key={system.slug} system={system} position={position} />
        ))}
      </ul>

      <OpenSourceStrip projects={projects} />
    </main>
  )
}
