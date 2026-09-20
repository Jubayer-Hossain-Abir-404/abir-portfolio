import { FlowDiagram } from './FlowDiagram'
import type { DiagramSpec } from './spec'
import { conneczenDiagram } from './specs/conneczen'
import { microzenDiagram } from './specs/microzen'
import { wordpressSiteManagerDiagram } from './specs/wordpressSiteManager'

/**
 * `systems.json → diagram` keys into this registry.
 *
 * An unknown key renders nothing rather than throwing. A diagram is an
 * illustration, and losing one should never take a case study down with it —
 * the prose is the substance and stands on its own.
 *
 * Only three systems have one. Workshop Management and Scholarship Prediction
 * carry `"diagram": null` because their source material describes an outcome,
 * not an architecture, and a drawing invented to fill the space would be a
 * confident-looking claim about somebody's real production system. They get one
 * when Abir confirms the shape.
 */
const REGISTRY: Record<string, DiagramSpec> = {
  conneczen: conneczenDiagram,
  microzen: microzenDiagram,
  'wordpress-site-manager': wordpressSiteManagerDiagram,
}

export function SystemDiagram({
  diagram,
  className,
}: {
  diagram: string | null
  className?: string
}) {
  const spec = diagram ? REGISTRY[diagram] : undefined

  if (!spec) return null

  return <FlowDiagram spec={spec} className={className} />
}
