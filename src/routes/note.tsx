import { getNoteBySlug } from '@/lib/content'
import type { Route } from './+types/note'

/**
 * A `clientLoader` rather than a `loader` only because no note is published
 * yet: with `ssr: false`, a parameterised route may export `loader` only if the
 * build prerenders at least one instance of it, and `prerender` skips drafts.
 *
 * Switch this to `loader` the moment the first note ships — that is what puts
 * the article text into the prerendered HTML instead of leaving it to hydration.
 */
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const note = await getNoteBySlug(params.slug)

  if (!note) {
    throw new Response('Not found', { status: 404 })
  }

  return { note }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const note = loaderData?.note

  return [
    { title: `${note?.title ?? 'Note'} — Md. Jubayer Hossain Abir` },
    { name: 'description', content: note?.summary },
  ]
}

export default function NoteRoute({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData

  return (
    <main id="main" className="px-gutter">
      <h1 className="text-h1">{note.title}</h1>
      <p className="text-lead text-muted">{note.summary}</p>
    </main>
  )
}
