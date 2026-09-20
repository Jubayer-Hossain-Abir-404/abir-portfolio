/**
 * sitemap.xml and robots.txt, written into the built site.
 *
 * Generated rather than kept in `public/` because both need the deployed origin
 * as an absolute URL, and because the route list has to follow the content: a
 * new entry in `systems.json` should appear in the sitemap without anyone
 * remembering to add it.
 *
 * The route list mirrors `prerender()` in `react-router.config.ts`. Those two
 * must agree — a URL in the sitemap that the build never generated is a soft
 * 404 served to a crawler.
 */

import { readFile, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const clientDir = new URL('build/client/', root)

const origin = (process.env.VITE_SITE_URL ?? 'https://abir-portfolio.netlify.app').replace(
  /\/+$/,
  '',
)

async function readData(name) {
  return JSON.parse(await readFile(fileURLToPath(new URL(`src/data/${name}.json`, root)), 'utf8'))
}

/**
 * Last-modified date for a route, taken from the mtime of the HTML the build
 * just wrote. Honest by construction: it is the file's own timestamp, not a
 * hand-maintained date that quietly goes stale.
 */
async function lastmod(path) {
  const file = new URL(`.${path === '/' ? '/index.html' : `${path}/index.html`}`, clientDir)

  try {
    return (await stat(file)).mtime.toISOString().slice(0, 10)
  } catch {
    return null
  }
}

async function main() {
  if (!existsSync(fileURLToPath(clientDir))) {
    throw new Error('build/client not found — run `react-router build` before generate-sitemap.')
  }

  const [systems, notes] = await Promise.all([readData('systems'), readData('notes')])

  const paths = [
    { path: '/', priority: '1.0' },
    { path: '/work', priority: '0.9' },
    { path: '/notes', priority: '0.7' },
    ...systems.map((system) => ({ path: `/work/${system.slug}`, priority: '0.8' })),
    ...notes
      .filter((note) => note.published)
      .map((note) => ({ path: `/notes/${note.slug}`, priority: '0.6' })),
  ]

  const entries = await Promise.all(
    paths.map(async ({ path, priority }) => {
      const date = await lastmod(path)

      return (
        `  <url>\n` +
        `    <loc>${origin}${path}</loc>\n` +
        (date ? `    <lastmod>${date}</lastmod>\n` : '') +
        `    <priority>${priority}</priority>\n` +
        `  </url>`
      )
    }),
  )

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join('\n') +
    `\n</urlset>\n`

  const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n')

  await writeFile(new URL('sitemap.xml', clientDir), sitemap)
  await writeFile(new URL('robots.txt', clientDir), robots)

  console.log(`generate-sitemap: ${paths.length} URLs at ${origin}`)
}

await main()
