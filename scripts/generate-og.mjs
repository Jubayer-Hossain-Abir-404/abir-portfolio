/**
 * Social-card images, one per page, written into the built site.
 *
 * Runs after `react-router build` because it writes into `build/client`. The
 * cards are build output, not source, so they are not committed and not in
 * `public/` — which also means they do not exist under `npm run dev`. That is
 * fine: nothing unfurls a localhost link.
 *
 * Text is measured with resvg's own bounding box rather than a font-metrics
 * library, so the measurement comes from the same shaper that renders the final
 * PNG. An estimate would drift from the render and clip a long title.
 *
 * The fonts are committed as TTF under `scripts/fonts/` on purpose. The app
 * itself loads woff2 through Fontsource, but resvg cannot read woff2, and a
 * build that downloads a typeface is a build that breaks the day a CDN does.
 *
 * `og/<key>.png` has to match `ogImagePath`/`ogKeys` in `src/lib/seo.ts`. This
 * script runs outside the app's path aliases and cannot import them, so the two
 * are kept in step by hand — the same arrangement as `react-router.config.ts`.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = new URL('../', import.meta.url)
const outDir = fileURLToPath(new URL('build/client/og/', root))

const FONTS = ['Geist-Regular.ttf', 'Geist-Medium.ttf', 'JetBrainsMono-Regular.ttf'].map((name) =>
  fileURLToPath(new URL(`scripts/fonts/${name}`, root)),
)

const fontOptions = { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Geist' }

/* The light half of the editorial palette, in sync with src/styles/index.css. */
const C = {
  bg: '#fafaf8',
  fg: '#111111',
  muted: '#6b6b66',
  rule: '#e2e1dc',
  accent: '#b9481a',
}

const W = 1200
const H = 630
const PAD = 72
const CONTENT = W - PAD * 2

const escapeXml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[ch],
  )

/** Width of one line, in user units, as resvg will actually shape it. */
function measure(text, { size, weight = 400, family = 'Geist', tracking = 0 }) {
  if (!text) return 0

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 4}" height="${size * 4}">` +
    `<text x="0" y="${size * 2}" font-family="${family}" font-weight="${weight}" ` +
    `font-size="${size}" letter-spacing="${tracking}">${escapeXml(text)}</text></svg>`

  return new Resvg(svg, { font: fontOptions }).getBBox()?.width ?? 0
}

/** Greedy wrap. Returns null when any single word cannot fit the column. */
function wrap(text, maxWidth, style) {
  const lines = []
  let line = ''

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word

    if (measure(candidate, style) <= maxWidth) {
      line = candidate
      continue
    }

    if (!line) return null // a single unbreakable word is wider than the column
    lines.push(line)
    line = word
  }

  if (line) lines.push(line)

  return lines
}

/**
 * Largest size from `sizes` at which the title fits the column in `maxLines`.
 *
 * Falling back to the smallest size rather than throwing is deliberate: a card
 * that is slightly tight still unfurls, whereas a failed build blocks a deploy
 * over a piece of decoration.
 */
function fitTitle(text, { sizes, maxLines, weight }) {
  for (const size of sizes) {
    const lines = wrap(text, CONTENT, { size, weight })

    if (lines && lines.length <= maxLines) return { size, lines }
  }

  const size = sizes.at(-1)

  return { size, lines: wrap(text, CONTENT, { size, weight })?.slice(0, maxLines) ?? [text] }
}

/** The favicon mark, scaled onto the card so the two read as one identity. */
function monogram(x, y, tile) {
  const scale = tile / 32

  return (
    `<g transform="translate(${x} ${y}) scale(${scale})">` +
    `<rect width="32" height="32" rx="2" fill="${C.accent}"/>` +
    `<g fill="none" stroke="${C.bg}" stroke-linecap="butt" stroke-linejoin="miter">` +
    `<path d="M6.5 25 L16 7.5 L25.5 25" stroke-width="3.8"/>` +
    `<path d="M10.2 19.5 H21.8" stroke-width="3.2"/></g></g>`
  )
}

const META = { family: 'JetBrains Mono', size: 19, tracking: 1.7 }

function metaText(text, x, y, { anchor = 'start', fill = C.muted } = {}) {
  return (
    `<text x="${x}" y="${y}" font-family="${META.family}" font-size="${META.size}" ` +
    `letter-spacing="${META.tracking}" text-anchor="${anchor}" fill="${fill}">` +
    `${escapeXml(text.toUpperCase())}</text>`
  )
}

function card({ owner, title, sub, footerLeft, footerRight }) {
  const TILE = 54
  const footerBaseline = H - PAD
  const ruleY = footerBaseline - 42

  /* Title sits on the rule and grows upward, so the gap above the footer is the
     same on a one-line card and a three-line one. */
  const subLines = sub ? (wrap(sub, CONTENT, { size: 27 }) ?? []).slice(0, 2) : []
  const subBlock = subLines.length * 38
  const { size, lines } = fitTitle(title, { sizes: [66, 58, 50, 44], maxLines: 3, weight: 500 })
  const titleLead = size * 1.14
  const titleBottom = ruleY - 62 - subBlock

  const titleSvg = lines
    .map((line, i) => {
      const y = titleBottom - (lines.length - 1 - i) * titleLead

      return (
        `<text x="${PAD}" y="${y}" font-family="Geist" font-weight="500" font-size="${size}" ` +
        `fill="${C.fg}">${escapeXml(line)}</text>`
      )
    })
    .join('')

  const subSvg = subLines
    .map(
      (line, i) =>
        `<text x="${PAD}" y="${titleBottom + 44 + i * 38}" font-family="Geist" font-size="27" ` +
        `fill="${C.muted}">${escapeXml(line)}</text>`,
    )
    .join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${C.bg}"/>` +
    monogram(PAD, PAD - 6, TILE) +
    metaText(owner, PAD + TILE + 18, PAD + 26, { fill: C.fg }) +
    titleSvg +
    subSvg +
    `<line x1="${PAD}" y1="${ruleY}" x2="${W - PAD}" y2="${ruleY}" stroke="${C.rule}" stroke-width="1"/>` +
    `<line x1="${PAD}" y1="${ruleY}" x2="${PAD + 64}" y2="${ruleY}" stroke="${C.accent}" stroke-width="3"/>` +
    metaText(footerLeft, PAD, footerBaseline) +
    metaText(footerRight, W - PAD, footerBaseline, { anchor: 'end' }) +
    `</svg>`
  )
}

async function readData(name) {
  return JSON.parse(await readFile(fileURLToPath(new URL(`src/data/${name}.json`, root)), 'utf8'))
}

async function main() {
  if (!existsSync(fileURLToPath(new URL('build/client/', root)))) {
    throw new Error('build/client not found — run `react-router build` before generate-og.')
  }

  const [profile, pages, systems, notes] = await Promise.all([
    readData('profile'),
    readData('pages'),
    readData('systems'),
    readData('notes'),
  ])

  const origin = (process.env.VITE_SITE_URL ?? 'https://abir-portfolio.netlify.app').replace(
    /\/+$/,
    '',
  )
  const host = origin.replace(/^https?:\/\//, '')
  const owner = profile.name

  const cards = [
    {
      key: 'default',
      title: profile.headline,
      sub: profile.role,
      footerLeft: 'Portfolio',
    },
    {
      key: 'work',
      title: pages.work.title,
      footerLeft: `Work · ${systems.length} systems`,
    },
    { key: 'notes', title: pages.notes.title, footerLeft: 'Notes' },
    ...systems.map((system) => ({
      key: `work-${system.slug}`,
      title: system.name,
      sub: system.subtitle,
      footerLeft: `Case study · ${system.role}`,
    })),
    ...notes
      .filter((note) => note.published)
      .map((note) => ({ key: `notes-${note.slug}`, title: note.title, footerLeft: 'Note' })),
  ]

  await mkdir(outDir, { recursive: true })

  /* Rendering stays sequential — it is CPU-bound and synchronous, so running
     the cards in parallel would only hold every bitmap in memory at once. The
     writes are the part worth overlapping. */
  const writes = []

  for (const entry of cards) {
    const svg = card({ owner, footerRight: host, ...entry })
    const png = new Resvg(svg, { font: fontOptions, fitTo: { mode: 'width', value: W } })
      .render()
      .asPng()

    writes.push(writeFile(new URL(`${entry.key}.png`, `file://${outDir}`), png))
  }

  await Promise.all(writes)

  /* iOS home-screen icon. Same mark as the favicon, rasterized once here rather
     than committed as a derived binary. */
  const touch = new Resvg(
    await readFile(fileURLToPath(new URL('public/favicon.svg', root)), 'utf8'),
    { fitTo: { mode: 'width', value: 180 } },
  )
    .render()
    .asPng()

  await writeFile(fileURLToPath(new URL('build/client/apple-touch-icon.png', root)), touch)

  console.log(`generate-og: ${cards.length} cards + apple-touch-icon → build/client`)
}

await main()
