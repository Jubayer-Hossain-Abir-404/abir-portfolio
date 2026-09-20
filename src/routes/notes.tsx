import { Link } from 'react-router'
import { getNotes } from '@/lib/content'
import type { Route } from './+types/notes'

export async function loader() {
  return { notes: await getNotes() }
}

export function meta() {
  return [
    { title: 'Engineering notes — Md. Jubayer Hossain Abir' },
    { name: 'description', content: 'Notes on systems built and decisions made in production.' },
  ]
}

export default function Notes({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">Notes</h1>
      {notes.length === 0 ? (
        <p className="text-muted">Nothing published yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={`/notes/${note.slug}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
