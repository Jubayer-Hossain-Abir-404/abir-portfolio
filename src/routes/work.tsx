import { Link } from 'react-router'
import { getSystems } from '@/lib/content'
import type { Route } from './+types/work'

export async function loader() {
  return { systems: await getSystems() }
}

export function meta() {
  return [
    { title: 'Work — Md. Jubayer Hossain Abir' },
    {
      name: 'description',
      content:
        'Systems built across telecom messaging, microfinance, workshop and fleet operations.',
    },
  ]
}

export default function Work({ loaderData }: Route.ComponentProps) {
  const { systems } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">Work</h1>
      <ul>
        {systems.map((system) => (
          <li key={system.slug}>
            <Link to={`/work/${system.slug}`}>{system.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
