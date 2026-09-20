import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Config } from '@react-router/dev/config'

/**
 * Static site generation.
 *
 * `ssr: false` + `prerender` emits a real HTML file per route at build time, so
 * every case study and note ships indexable content and its own OG tags rather
 * than an empty SPA shell. There is no server at runtime — the output is plain
 * static files for Netlify.
 *
 * This file is build tooling loaded outside the app's path-alias setup, so it
 * reads the content files from disk instead of importing the repository. Adding
 * an entry to the JSON is still all it takes for a new page to be generated.
 */

async function readData<T>(name: string): Promise<T> {
  const path = fileURLToPath(new URL(`./src/data/${name}.json`, import.meta.url))

  return JSON.parse(await readFile(path, 'utf8')) as T
}

export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    const [systems, notes] = await Promise.all([
      readData<{ slug: string }[]>('systems'),
      readData<{ slug: string; published: boolean }[]>('notes'),
    ])

    return [
      '/',
      '/work',
      '/notes',
      ...systems.map((system) => `/work/${system.slug}`),
      ...notes.filter((note) => note.published).map((note) => `/notes/${note.slug}`),
    ]
  },
} satisfies Config
