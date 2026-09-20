import { cn } from 'cn'
import { DrawOnView } from '@/components/motion/DrawOnView'
import { layoutDiagram, type Orientation, type PlacedEdge, type PlacedNode } from './layout'
import type { DiagramNodeKind, DiagramSpec } from './spec'

/**
 * Renders a diagram spec as inline SVG, in both layouts at once.
 *
 * Both orientations are in the markup and a media query picks one. The
 * alternative — measuring the viewport and rendering the winner — cannot work
 * in a static build: the prerendered HTML would have to commit to one layout
 * and be wrong for everyone else until hydration.
 *
 * Colour comes entirely from Tailwind classes resolving to the editorial
 * tokens, so both themes are handled by the same markup with no JavaScript and
 * no second palette.
 */

const NODE_FILL: Record<DiagramNodeKind, string> = {
  core: 'fill-surface',
  store: 'fill-surface',
  external: 'fill-bg',
}

function Node({ placed }: { placed: PlacedNode }) {
  const { node, x, y, w, h } = placed
  const labelY = y + (node.detail?.length ? h * 0.4 : h / 2 + 4.5)

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        strokeWidth={1}
        strokeDasharray={node.kind === 'external' ? '3 3' : undefined}
        className={cn(NODE_FILL[node.kind], node.emphasis ? 'stroke-accent' : 'stroke-rule')}
      />

      {/* A ruled band across the top reads as a table header — enough of a cue
          to separate a datastore from a service without a clip-art cylinder. */}
      {node.kind === 'store' ? (
        <line x1={x + 1} y1={y + 13} x2={x + w - 1} y2={y + 13} className="stroke-rule" />
      ) : null}

      <text
        x={x + w / 2}
        y={labelY}
        textAnchor="middle"
        fontSize={12.5}
        className={cn('font-medium', node.kind === 'external' ? 'fill-muted' : 'fill-fg')}
      >
        {node.label}
      </text>

      {node.detail?.map((line, i) => (
        <text
          key={line}
          x={x + w / 2}
          y={y + h * 0.4 + 14 + i * 11}
          textAnchor="middle"
          fontSize={8.5}
          letterSpacing="0.07em"
          className="fill-muted font-mono uppercase"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function Edge({ edge }: { edge: PlacedEdge }) {
  return (
    <g>
      <path
        data-draw
        d={edge.d}
        fill="none"
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray={edge.dashed ? '3 4' : undefined}
        // Plain `opacity` rather than a `stroke-muted/70` utility: the opacity
        // modifier compiles to `color-mix()`, and this markup has to survive
        // being pulled out of the page and rendered by something simpler than a
        // browser — which is the only way these diagrams get proofread.
        opacity={edge.dashed ? 0.7 : undefined}
        className="stroke-muted"
      />

      <path
        data-draw
        d="M -6 -3.5 L 0 0 L -6 3.5"
        transform={`translate(${edge.tipX} ${edge.tipY}) rotate(${edge.tipAngle})`}
        fill="none"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-muted"
      />

      {edge.label ? (
        <text
          x={edge.labelX}
          y={edge.labelY}
          textAnchor={edge.labelAnchor}
          fontSize={8.5}
          letterSpacing="0.07em"
          className="fill-muted font-mono uppercase"
        >
          {edge.label}
        </text>
      ) : null}
    </g>
  )
}

function Svg({
  spec,
  orientation,
  className,
}: {
  spec: DiagramSpec
  orientation: Orientation
  className: string
}) {
  const { width, height, nodes, edges } = layoutDiagram(spec, orientation)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      // Never scaled past 1:1 in the wide layout. A short diagram stretched to
      // fill a 1280px column renders its 12px labels at 22px, which looks like
      // a mistake rather than a drawing. The stacked layout is allowed to grow,
      // because on a phone filling the column is the point.
      style={orientation === 'wide' ? { maxWidth: width } : undefined}
      // The caption below is the text alternative, so the drawing itself has
      // nothing to add and announcing it twice helps nobody.
      aria-hidden
      focusable="false"
      className={cn('h-auto w-full', className)}
    >
      {/* Connectors first so a box always sits on top of a line that runs past it. */}
      {edges.map((edge) => (
        <Edge key={edge.key} edge={edge} />
      ))}
      {nodes.map((placed) => (
        <Node key={placed.node.id} placed={placed} />
      ))}
    </svg>
  )
}

function Annotation({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn('border-rule py-3 meta text-muted normal-case', className)}>
      <span aria-hidden className="mr-2 text-accent">
        ┄
      </span>
      {text}
    </p>
  )
}

export function FlowDiagram({ spec, className }: { spec: DiagramSpec; className?: string }) {
  const top = spec.annotations?.filter((item) => item.position === 'top') ?? []
  const bottom = spec.annotations?.filter((item) => item.position === 'bottom') ?? []

  return (
    <figure className={cn('border-y border-rule py-8 lg:py-10', className)}>
      {top.map((item) => (
        <Annotation key={item.text} text={item.text} className="mb-6 border-b" />
      ))}

      <DrawOnView>
        <Svg spec={spec} orientation="wide" className="mx-auto hidden md:block" />
        <Svg spec={spec} orientation="stacked" className="mx-auto max-w-[19rem] md:hidden" />
      </DrawOnView>

      {bottom.map((item) => (
        <Annotation key={item.text} text={item.text} className="mt-6 border-t" />
      ))}

      <figcaption className="mt-8 max-w-2xl text-sm text-pretty text-muted">
        {spec.description}
      </figcaption>
    </figure>
  )
}
