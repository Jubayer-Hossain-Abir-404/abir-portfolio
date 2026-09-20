/**
 * Shared primitives used across more than one content module.
 *
 * Everything under `src/types` stays JSON-serializable — no JSX, no functions —
 * so the same payloads can later be served by an API without changing a single
 * component.
 */

export type Link = {
  label: string
  href: string
}

/**
 * Every published number carries the source that substantiates it. Nothing goes
 * on the site that cannot be traced to a document or an explicit confirmation.
 */
export type Figure = {
  value: string
  label: string
  source: string
}
