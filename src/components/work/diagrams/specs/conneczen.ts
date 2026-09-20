import type { DiagramSpec } from '../spec'

/**
 * Every element here is stated in `systems.json → conneczen.approach`:
 *
 * - "A NestJS service sits between client applications and the downstream
 *   providers, owning authentication, rate limiting … and delivery tracking."
 *   → clients, api, providers, and the status path back
 * - "PostgreSQL holds both operational state and the message log, with the log
 *   partitioned"  → postgres
 * - "Replication separates reporting reads from the write path, and load
 *   balancing spreads the API across instances deployed on Docker Swarm."
 *   → replica, balancer
 * - "Monitoring and log analysis are treated as part of the service"
 *   → monitoring
 *
 * **No queue node.** An earlier draft put one between the API and the
 * providers, on the strength of the word "queueing" in the approach text.
 * Abir corrected it on 2026-09-21: a single SMS is not queued. The word in the
 * prose still needs resolving — see `docs/PROGRESS.md`.
 *
 * Nothing else is drawn. No inferred cache, no inferred gateway.
 */
export const conneczenDiagram: DiagramSpec = {
  title: 'Conneczen message path',
  description:
    'Client applications reach a load-balanced NestJS API running across Docker Swarm instances, which authenticates and rate-limits each message, hands it to the telecom providers and tracks the delivery status that comes back. PostgreSQL holds operational state alongside a partitioned message log, and reporting reads are served from a replica so they never compete with delivery.',
  nodes: [
    { id: 'clients', label: 'Client apps', kind: 'external', col: 0, row: 1 },
    { id: 'balancer', label: 'Load balancer', detail: ['instances'], kind: 'core', col: 1, row: 1 },
    {
      id: 'api',
      label: 'NestJS API',
      detail: ['auth · rate limit', 'delivery tracking'],
      kind: 'core',
      col: 2,
      row: 1,
      emphasis: true,
    },
    { id: 'providers', label: 'Telecom providers', kind: 'external', col: 3, row: 0 },
    {
      id: 'postgres',
      label: 'PostgreSQL',
      detail: ['partitioned', 'message log'],
      kind: 'store',
      col: 3,
      row: 2,
    },
    { id: 'replica', label: 'Read replica', detail: ['reporting'], kind: 'store', col: 4, row: 2 },
    {
      id: 'monitoring',
      label: 'Monitoring',
      detail: ['logs · analysis'],
      kind: 'core',
      col: 2,
      row: 2,
    },
  ],
  edges: [
    { from: 'clients', to: 'balancer' },
    { from: 'balancer', to: 'api' },
    { from: 'api', to: 'providers', label: 'send' },
    { from: 'providers', to: 'api', label: 'delivery status', dashed: true, route: 'above' },
    { from: 'api', to: 'postgres' },
    { from: 'postgres', to: 'replica', label: 'replication', dashed: true },
    { from: 'api', to: 'monitoring', label: 'logs', dashed: true },
  ],
  // The main path top to bottom, with the two branches after it.
  stackOrder: ['clients', 'balancer', 'api', 'providers', 'postgres', 'replica', 'monitoring'],
}
