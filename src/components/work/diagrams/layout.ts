import type { DiagramEdge, DiagramNode, DiagramSpec } from './spec'

/**
 * Geometry for the diagrams. Pure functions, no React, no DOM.
 *
 * Two layouts come out of one spec. `wide` is the left-to-right flow; `stacked`
 * collapses the same graph into a single column for narrow screens, because a
 * 960-unit-wide flow scaled down to a 328px phone is a diagram nobody can read,
 * and a horizontally scrolling one is worse.
 *
 * Both are rendered and the unused one is hidden by a media query rather than
 * chosen in JavaScript. Choosing in JS means the prerendered HTML has to pick
 * one and be wrong for half the visitors until hydration.
 */

export type Orientation = 'wide' | 'stacked'

export type PlacedNode = {
  node: DiagramNode
  x: number
  y: number
  w: number
  h: number
}

export type PlacedEdge = {
  key: string
  d: string
  dashed: boolean
  label?: string
  labelX: number
  labelY: number
  labelAnchor: 'start' | 'middle'
  /**
   * Where the arrowhead goes and which way it faces, in degrees clockwise from
   * east. Carried here rather than left to an SVG `marker` because a marker
   * renders at full opacity the instant the path exists — dash-based drawing
   * does not hide it — so every arrow tip would be sitting at its destination
   * before its line arrived.
   */
  tipX: number
  tipY: number
  tipAngle: number
}

export type DiagramLayout = {
  width: number
  height: number
  nodes: PlacedNode[]
  edges: PlacedEdge[]
}

const CORNER = 9

const WIDE = { nodeW: 140, nodeH: 58, colGap: 66, rowGap: 26, rail: 15, railPad: 34, pad: 14 }
const STACKED = { nodeW: 200, nodeH: 62, gap: 44, railBase: 13, railStep: 11, pad: 3 }

/** Keeps the emitted path data short and free of float noise. */
function n(value: number) {
  return Number(value.toFixed(1))
}

/** A right-angle turn with rounded corners, in whichever direction is needed. */
function elbow(sx: number, sy: number, ex: number, ey: number) {
  const mx = (sx + ex) / 2
  const dx = Math.sign(ex - sx) || 1
  const dy = Math.sign(ey - sy) || 1
  const r = Math.min(CORNER, Math.abs(ey - sy) / 2, Math.abs(ex - sx) / 2)

  return [
    `M ${n(sx)} ${n(sy)}`,
    `H ${n(mx - dx * r)}`,
    `Q ${n(mx)} ${n(sy)} ${n(mx)} ${n(sy + dy * r)}`,
    `V ${n(ey - dy * r)}`,
    `Q ${n(mx)} ${n(ey)} ${n(mx + dx * r)} ${n(ey)}`,
    `H ${n(ex)}`,
  ].join(' ')
}

/**
 * A flow that doubles back — a delivery receipt, a rejected approval, a health
 * report. It leaves one box, runs along a rail clear of everything else, and
 * re-enters the target on the same face it left, which is what makes it read as
 * a return rather than as another forward step.
 */
function railRoute(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  rail: number,
  axis: 'x' | 'y',
  toRail: 1 | -1,
) {
  const r = CORNER

  if (axis === 'y') {
    const dx = Math.sign(ex - sx) || -1

    return [
      `M ${n(sx)} ${n(sy)}`,
      `V ${n(rail + toRail * r)}`,
      `Q ${n(sx)} ${n(rail)} ${n(sx + dx * r)} ${n(rail)}`,
      `H ${n(ex - dx * r)}`,
      `Q ${n(ex)} ${n(rail)} ${n(ex)} ${n(rail + toRail * r)}`,
      `V ${n(ey)}`,
    ].join(' ')
  }

  const dy = Math.sign(ey - sy) || -1

  return [
    `M ${n(sx)} ${n(sy)}`,
    `H ${n(rail + toRail * r)}`,
    `Q ${n(rail)} ${n(sy)} ${n(rail)} ${n(sy + dy * r)}`,
    `V ${n(ey - dy * r)}`,
    `Q ${n(rail)} ${n(ey)} ${n(rail + toRail * r)} ${n(ey)}`,
    `H ${n(ex)}`,
  ].join(' ')
}

function edgeKey(edge: DiagramEdge, index: number) {
  return `${edge.from}-${edge.to}-${index}`
}

function wideLayout(spec: DiagramSpec): DiagramLayout {
  const { nodeW, nodeH, colGap, rowGap, rail, railPad, pad } = WIDE

  const index = new Map(spec.nodes.map((node) => [node.id, node]))
  const backwards = spec.edges.filter((edge) => {
    const from = index.get(edge.from)
    const to = index.get(edge.to)

    return from && to && to.col < from.col
  })

  const padTop = backwards.some((edge) => edge.route === 'above') ? railPad : pad
  const padBottom = backwards.some((edge) => edge.route !== 'above') ? railPad : pad

  const maxCol = Math.max(...spec.nodes.map((node) => node.col))
  const maxRow = Math.max(...spec.nodes.map((node) => node.row))

  const placed: PlacedNode[] = spec.nodes.map((node) => ({
    node,
    x: pad + node.col * (nodeW + colGap),
    y: padTop + node.row * (nodeH + rowGap),
    w: nodeW,
    h: nodeH,
  }))

  const byId = new Map(placed.map((item) => [item.node.id, item]))

  const edges = spec.edges.flatMap((edge, i): PlacedEdge[] => {
    const a = byId.get(edge.from)
    const b = byId.get(edge.to)

    if (!a || !b) {
      throw new Error(`diagram "${spec.title}": edge references unknown node`)
    }

    const key = edgeKey(edge, i)
    const dashed = edge.dashed ?? false
    const acx = a.x + a.w / 2
    const acy = a.y + a.h / 2
    const bcx = b.x + b.w / 2
    const bcy = b.y + b.h / 2

    // Same column: a straight drop or climb between lanes.
    if (a.node.col === b.node.col) {
      const down = b.node.row > a.node.row
      const sy = down ? a.y + a.h : a.y
      const ey = down ? b.y : b.y + b.h

      return [
        {
          key,
          dashed,
          d: `M ${n(acx)} ${n(sy)} V ${n(ey)}`,
          label: edge.label,
          labelX: acx + 8,
          labelY: (sy + ey) / 2,
          labelAnchor: 'start',
          tipX: acx,
          tipY: ey,
          tipAngle: down ? 90 : -90,
        },
      ]
    }

    if (b.node.col > a.node.col) {
      const sx = a.x + a.w
      const ex = b.x
      const straight = a.node.row === b.node.row

      return [
        {
          key,
          dashed,
          d: straight ? `M ${n(sx)} ${n(acy)} H ${n(ex)}` : elbow(sx, acy, ex, bcy),
          label: edge.label,
          labelX: (sx + ex) / 2,
          labelY: (straight ? acy : Math.min(acy, bcy)) - 9,
          labelAnchor: 'middle',
          tipX: ex,
          tipY: straight ? acy : bcy,
          tipAngle: 0,
        },
      ]
    }

    const above = edge.route === 'above'
    const railY = above ? Math.min(a.y, b.y) - rail : Math.max(a.y + a.h, b.y + b.h) + rail

    // A return leaves on the face it is heading towards and re-enters on the
    // face it came from. Without the offset, two returns that share a box — the
    // middle step of an approval chain both rejects upward and is rejected from
    // above — would stack their verticals on the same pixel column and read as
    // one ambiguous line.
    const dx = Math.sign(bcx - acx) || -1
    const exitX = acx + dx * 18
    const entryX = bcx - dx * 18

    return [
      {
        key,
        dashed,
        d: railRoute(
          exitX,
          above ? a.y : a.y + a.h,
          entryX,
          above ? b.y : b.y + b.h,
          railY,
          'y',
          above ? 1 : -1,
        ),
        label: edge.label,
        labelX: (exitX + entryX) / 2,
        labelY: railY - 6,
        labelAnchor: 'middle',
        tipX: entryX,
        tipY: above ? b.y : b.y + b.h,
        tipAngle: above ? 90 : -90,
      },
    ]
  })

  return {
    width: pad * 2 + (maxCol + 1) * nodeW + maxCol * colGap,
    height: padTop + padBottom + (maxRow + 1) * nodeH + maxRow * rowGap,
    nodes: placed,
    edges,
  }
}

function stackedLayout(spec: DiagramSpec): DiagramLayout {
  const { nodeW, nodeH, gap, railBase, railStep, pad } = STACKED

  // Authored order where the spec gives one, otherwise flow order first and
  // branch lane second — the same reading order as the wide layout, flattened.
  const byDeclaredOrder = spec.stackOrder
  const order = byDeclaredOrder
    ? byDeclaredOrder.map((id) => {
        const node = spec.nodes.find((candidate) => candidate.id === id)

        if (!node) throw new Error(`diagram "${spec.title}": stackOrder names unknown node "${id}"`)

        return node
      })
    : [...spec.nodes].sort((a, b) => a.col - b.col || a.row - b.row)

  if (order.length !== spec.nodes.length) {
    throw new Error(`diagram "${spec.title}": stackOrder must list every node exactly once`)
  }
  const position = new Map(order.map((node, i) => [node.id, i]))

  // Rails are allocated before anything is placed, because how many there are
  // on each side decides how much room the column needs beside it.
  const rails = new Map<string, { side: 'left' | 'right'; slot: number }>()
  let left = 0
  let right = 0

  spec.edges.forEach((edge, i) => {
    const from = position.get(edge.from)
    const to = position.get(edge.to)

    if (from === undefined || to === undefined) return
    if (to === from + 1) return

    const side = to > from ? 'right' : 'left'

    rails.set(edgeKey(edge, i), { side, slot: side === 'right' ? right++ : left++ })
  })

  const padLeft = left > 0 ? railBase + (left - 1) * railStep + pad : pad
  const padRight = right > 0 ? railBase + (right - 1) * railStep + pad : pad

  const placed: PlacedNode[] = order.map((node, i) => ({
    node,
    x: padLeft,
    y: pad + i * (nodeH + gap),
    w: nodeW,
    h: nodeH,
  }))

  const byId = new Map(placed.map((item) => [item.node.id, item]))

  const edges = spec.edges.map((edge, i): PlacedEdge => {
    const a = byId.get(edge.from)
    const b = byId.get(edge.to)

    if (!a || !b) {
      throw new Error(`diagram "${spec.title}": edge references unknown node`)
    }

    const key = edgeKey(edge, i)
    const dashed = edge.dashed ?? false
    const track = rails.get(key)

    if (!track) {
      const cx = a.x + a.w / 2

      return {
        key,
        dashed,
        d: `M ${n(cx)} ${n(a.y + a.h)} V ${n(b.y)}`,
        label: edge.label,
        labelX: cx + 8,
        labelY: (a.y + a.h + b.y) / 2,
        labelAnchor: 'start',
        tipX: cx,
        tipY: b.y,
        tipAngle: 90,
      }
    }

    const onRight = track.side === 'right'
    const railX = onRight
      ? padLeft + nodeW + railBase + track.slot * railStep
      : padLeft - railBase - track.slot * railStep
    const face = onRight ? a.x + a.w : a.x
    const sy = a.y + a.h / 2
    const ey = b.y + b.h / 2

    return {
      key,
      dashed,
      d: railRoute(face, sy, face, ey, railX, 'x', onRight ? -1 : 1),
      // No label on a rail. The strip between the column and the rail is barely
      // a dozen units wide, so anything set there either overlaps the box or
      // runs off the edge of the viewBox — which is exactly what it did. The
      // caption carries what these edges are; on a phone that is the better
      // place for it anyway.
      label: undefined,
      labelX: 0,
      labelY: 0,
      labelAnchor: 'middle',
      tipX: face,
      tipY: ey,
      tipAngle: onRight ? 180 : 0,
    }
  })

  return {
    width: padLeft + nodeW + padRight,
    height: pad * 2 + order.length * nodeH + (order.length - 1) * gap,
    nodes: placed,
    edges,
  }
}

export function layoutDiagram(spec: DiagramSpec, orientation: Orientation): DiagramLayout {
  return orientation === 'wide' ? wideLayout(spec) : stackedLayout(spec)
}
