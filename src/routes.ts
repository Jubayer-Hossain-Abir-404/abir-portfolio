import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('work', 'routes/work.tsx'),
  route('work/:slug', 'routes/system.tsx'),
  route('notes', 'routes/notes.tsx'),
  route('notes/:slug', 'routes/note.tsx'),
] satisfies RouteConfig
