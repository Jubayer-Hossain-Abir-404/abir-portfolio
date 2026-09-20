import {
  getEngineering,
  getExperience,
  getFeaturedSystems,
  getNotes,
  getProfile,
  getProjects,
  getResearch,
  getSocial,
} from '@/lib/content'
import type { Route } from './+types/home'

export async function loader() {
  const [profile, social, systems, engineering, experience, notes, projects, research] =
    await Promise.all([
      getProfile(),
      getSocial(),
      getFeaturedSystems(),
      getEngineering(),
      getExperience(),
      getNotes(),
      getProjects(),
      getResearch(),
    ])

  return { profile, social, systems, engineering, experience, notes, projects, research }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const profile = loaderData?.profile

  return [
    { title: `${profile?.name ?? 'Portfolio'} — ${profile?.role ?? ''}` },
    { name: 'description', content: profile?.lead },
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { profile } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">{profile.headline}</h1>
      <p className="text-lead text-muted">{profile.lead}</p>
    </main>
  )
}
