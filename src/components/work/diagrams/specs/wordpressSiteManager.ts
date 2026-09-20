import type { DiagramSpec } from '../spec'

/**
 * Drawn from `wordpress-site-manager.approach`:
 *
 * - "A Laravel and Inertia.js application drives remote Docker hosts over SSH
 *   using phpseclib"  → ui, app, host, and the transport on that edge
 * - "Provisioning is expressed as a Docker Compose structure applied to the
 *   target server"  → sites
 * - "Long-running work goes through queues"  → worker
 * - "a monitoring subsystem reports on site state"  → the return edge
 *
 * The one system on the site whose source is public, so this diagram is the
 * one a reviewer can check against the repository.
 */
export const wordpressSiteManagerDiagram: DiagramSpec = {
  title: 'WordPress Site Manager control plane',
  description:
    'The Laravel and Inertia application never touches a remote host directly on the request path. Provisioning is queued, then applied over SSH with phpseclib as a Docker Compose structure on the target server, and a monitoring subsystem reports site state back rather than leaving it to be discovered.',
  nodes: [
    { id: 'ui', label: 'Inertia UI', kind: 'core', col: 0, row: 0 },
    { id: 'app', label: 'Laravel app', kind: 'core', col: 1, row: 0, emphasis: true },
    {
      id: 'worker',
      label: 'Queue worker',
      detail: ['provisioning jobs'],
      kind: 'core',
      col: 2,
      row: 0,
    },
    { id: 'host', label: 'Remote host', detail: ['docker'], kind: 'external', col: 3, row: 0 },
    {
      id: 'sites',
      label: 'WordPress sites',
      detail: ['compose services'],
      kind: 'external',
      col: 4,
      row: 0,
    },
  ],
  edges: [
    { from: 'ui', to: 'app' },
    { from: 'app', to: 'worker', label: 'enqueue' },
    { from: 'worker', to: 'host', label: 'ssh' },
    { from: 'host', to: 'sites', label: 'compose' },
    { from: 'host', to: 'app', label: 'site state', dashed: true },
  ],
}
