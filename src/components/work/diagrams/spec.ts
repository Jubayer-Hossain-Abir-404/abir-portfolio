/**
 * The shape of an architecture diagram, as data.
 *
 * Diagrams are authored as specs rather than hand-drawn SVG so that the thing
 * under review is the *architecture* — a reviewer checks a list of nodes and
 * edges, not a pile of path coordinates. One renderer turns a spec into both
 * the wide and the stacked layout, so a correction is made once.
 *
 * These live in code rather than in `src/data/*.json` on purpose: the JSON is
 * the content contract and has to stay API-portable, while a diagram is a
 * visual. `systems.json` refers to one by key; the registry resolves it.
 *
 * **Nothing in a spec may be inferred.** Every node and edge has to be
 * supported by the system's own `approach` text, because a diagram reads as an
 * authoritative statement about a real production system. Where the source
 * material is too thin to draw, the system carries `"diagram": null` and the
 * case study renders without one.
 */

export type DiagramNodeKind =
  /** Something we built and run. */
  | 'core'
  /** Persistence. */
  | 'store'
  /** Outside the boundary — a client, a provider, a machine we do not own. */
  | 'external'

export type DiagramNode = {
  id: string
  label: string
  /** Up to two short lines under the label. Authored, never wrapped by code. */
  detail?: string[]
  kind: DiagramNodeKind
  /** Grid position. Column is flow order; row is the branch lane. */
  col: number
  row: number
  /** The subject of the case study gets the accent outline. At most one. */
  emphasis?: boolean
}

export type DiagramEdge = {
  from: string
  to: string
  /** Kept to a word or two — the caption carries the explanation. */
  label?: string
  /** Secondary flows: replication, telemetry, returns, status callbacks. */
  dashed?: boolean
  /**
   * Which side a backwards edge routes around in the wide layout. Only
   * consulted when the target sits to the left of the source.
   */
  route?: 'above' | 'below'
}

export type DiagramAnnotation = {
  position: 'top' | 'bottom'
  /** A concern that applies to every node, so drawing it as one would lie. */
  text: string
}

export type DiagramSpec = {
  /** Accessible name. Announced in place of the drawing. */
  title: string
  /** Read by screen readers *and* printed as the visible caption. */
  description: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  annotations?: DiagramAnnotation[]
  /**
   * Node order for the stacked layout, by id.
   *
   * Flattening the grid by column-then-row is the obvious default and it is
   * wrong whenever a diagram branches: a side branch sorts into the middle of
   * the main path, and a phone reader gets the monitoring hop served between
   * two steps that feed each other. The main flow is the thing that has to read
   * top to bottom, so it is declared rather than derived.
   */
  stackOrder?: string[]
}
