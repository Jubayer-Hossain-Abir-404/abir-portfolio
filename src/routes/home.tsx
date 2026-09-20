import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Engineering } from '@/components/sections/Engineering'
import { Experience } from '@/components/sections/Experience'
import { Intro } from '@/components/sections/Intro'
import { NotesTeaser } from '@/components/sections/NotesTeaser'
import { SelectedSystems } from '@/components/sections/SelectedSystems'
import {
  getEngineering,
  getExperience,
  getFeaturedSystems,
  getNotes,
  getProfile,
  getProjects,
  getResearch,
  getSections,
  getSocial,
} from '@/lib/content'
import { routes } from '@/lib/routes'
import { ogKeys, pageMeta, personJsonLd } from '@/lib/seo'
import type { Route } from './+types/home'

export async function loader() {
  const [profile, social, systems, engineering, experience, notes, projects, research, sections] =
    await Promise.all([
      getProfile(),
      getSocial(),
      getFeaturedSystems(),
      getEngineering(),
      getExperience(),
      getNotes(),
      getProjects(),
      getResearch(),
      getSections(),
    ])

  // A section with nothing to show is dropped rather than rendered empty, and
  // the spine numbers off this filtered list — so the numerals stay contiguous
  // without anybody maintaining them. Filtered here rather than in the
  // component so the unused copy never ships in the hydration payload either.
  const visibleSections = sections.filter((section) => section.id !== 'notes' || notes.length > 0)

  return {
    profile,
    social,
    systems,
    engineering,
    experience,
    notes,
    projects,
    research,
    sections: visibleSections,
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { profile, social } = loaderData

  return [
    ...pageMeta({
      title: `${profile.name} — ${profile.role}`,
      description: profile.lead,
      path: routes.home(),
      siteName: profile.name,
      ogKey: ogKeys.home,
    }),
    personJsonLd(profile, social),
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { profile, social, systems, engineering, experience, notes, projects, research, sections } =
    loaderData

  return (
    <main id="main" className="mx-auto max-w-[88rem] px-gutter">
      {sections.map((section, position) => {
        const index = position + 1

        switch (section.id) {
          case 'intro':
            return <Intro key={section.id} index={index} section={section} profile={profile} />

          case 'systems':
            return (
              <SelectedSystems
                key={section.id}
                index={index}
                section={section}
                systems={systems}
                projects={projects}
              />
            )

          case 'engineering':
            return (
              <Engineering key={section.id} index={index} section={section} groups={engineering} />
            )

          case 'experience':
            return (
              <Experience key={section.id} index={index} section={section} entries={experience} />
            )

          case 'notes':
            return <NotesTeaser key={section.id} index={index} section={section} notes={notes} />

          case 'about':
            return (
              <About
                key={section.id}
                index={index}
                section={section}
                profile={profile}
                research={research}
              />
            )

          case 'contact':
            return (
              <Contact
                key={section.id}
                index={index}
                section={section}
                profile={profile}
                social={social}
              />
            )

          default: {
            // Exhaustiveness guard. Without it the switch falls through to
            // `undefined`, React renders nothing, and a section added to
            // SECTION_IDS and sections.json but never given a case here
            // disappears from the page silently. Assigning to `never` turns
            // that into a compile error at the moment the id is added.
            const unhandled: never = section.id

            throw new Error(`home.tsx: no renderer for section "${String(unhandled)}"`)
          }
        }
      })}
    </main>
  )
}
