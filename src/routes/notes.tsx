import { Link } from 'react-router'
import { getNotes, getPageCopy, getProfile } from '@/lib/content'
import { routes } from '@/lib/routes'
import { ogKeys, pageMeta, titleFor } from '@/lib/seo'
import type { Route } from './+types/notes'

export async function loader() {
  const [notes, copy, profile] = await Promise.all([getNotes(), getPageCopy('notes'), getProfile()])

  return { notes, copy, profile }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { copy, profile } = loaderData

  return pageMeta({
    title: titleFor('Notes', profile.name),
    description: copy.lede,
    path: routes.notes(),
    siteName: profile.name,
    ogKey: ogKeys.notes,
  })
}

export default function Notes({ loaderData }: Route.ComponentProps) {
  const { notes, copy } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">{copy.title}</h1>
      <p className="text-lead text-muted">{copy.lede}</p>
      {notes.length === 0 ? (
        <p className="text-muted">Nothing published yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={routes.note(note.slug)}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
