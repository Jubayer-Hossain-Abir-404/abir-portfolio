import type { DiagramSpec } from '../spec'

/**
 * Microzen's diagram is a *flow*, not a topology, because the hard part of the
 * system is the approval path rather than the deployment. Drawing boxes for
 * Laravel and MySQL would say nothing the stack line has not already said.
 *
 * The three steps and the return paths come from `microzen.problem`:
 * "proposed at a branch, reviewed at a region, approved at a head office, and
 * any step can return it, reject it or amend it."
 *
 * The two annotations are concerns that apply at every step — notification
 * routing and configuration versioning — so they are stated as bands rather
 * than drawn as nodes. Attaching them to one box would be a claim that they
 * belong to that step alone, which is the opposite of what the approach says.
 */
export const microzenDiagram: DiagramSpec = {
  title: 'Microzen approval flow',
  description:
    'A change is proposed at a branch, reviewed at a region and approved at head office. Every step can also send it back — a return to the previous level or an outright rejection — so the flow is a graph with real reverse edges rather than a status column counting upward.',
  nodes: [
    { id: 'branch', label: 'Branch', detail: ['proposes'], kind: 'core', col: 0, row: 0 },
    { id: 'region', label: 'Region', detail: ['reviews'], kind: 'core', col: 1, row: 0 },
    {
      id: 'head',
      label: 'Head office',
      detail: ['approves'],
      kind: 'core',
      col: 2,
      row: 0,
      emphasis: true,
    },
  ],
  edges: [
    { from: 'branch', to: 'region', label: 'submit' },
    { from: 'region', to: 'head', label: 'approve' },
    { from: 'region', to: 'branch', label: 'return', dashed: true },
    { from: 'head', to: 'region', label: 'return · reject', dashed: true },
  ],
  annotations: [
    {
      position: 'top',
      text: 'Notifications resolve against the organisation hierarchy, so a pending step reaches the level that can act on it rather than a role that has to claim it.',
    },
    {
      position: 'bottom',
      text: 'Each record resolves against the configuration version in force when it was created, and edit and delete rights are evaluated against the step the record is on, not the role alone.',
    },
  ],
}
