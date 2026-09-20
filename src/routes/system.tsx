import { getSystemBySlug } from '@/lib/content'
import type { Route } from './+types/system'

export async function loader({ params }: Route.LoaderArgs) {
  const system = await getSystemBySlug(params.slug)

  if (!system) {
    throw new Response('Not found', { status: 404 })
  }

  return { system }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const system = loaderData?.system

  return [
    { title: `${system?.name ?? 'Case study'} — Md. Jubayer Hossain Abir` },
    { name: 'description', content: system?.summary },
  ]
}

export default function SystemRoute({ loaderData }: Route.ComponentProps) {
  const { system } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">{system.name}</h1>
      <p className="text-lead text-muted">{system.subtitle}</p>
    </main>
  )
}
