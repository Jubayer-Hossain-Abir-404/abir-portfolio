import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { animate, stagger } from 'motion'
import { useMotionSafe } from './useMotionSafe'

type DrawOnViewProps = {
  children: ReactNode
  className?: string
  /** Seconds each stroke takes. */
  duration?: number
  /** Seconds between one stroke starting and the next. */
  stride?: number
}

/**
 * Stroke-draws every `[data-draw]` path inside it when it scrolls into view.
 *
 * This is the one place Motion earns its keep — `pathLength` is fiddly to do by
 * hand, because it means measuring each path and driving `stroke-dasharray` and
 * `stroke-dashoffset` off the result.
 *
 * It is driven *imperatively* rather than through `<motion.path initial={…}>`,
 * and that distinction is the whole reason this component exists. The `initial`
 * prop is serialized into the prerendered HTML, so a static build would ship
 * every connector already hidden and a visitor with JavaScript blocked would
 * get boxes floating with nothing between them. Here the markup is plain, fully
 * drawn SVG; the hidden state is written by script in a layout effect, before
 * the browser paints, and only when motion is welcome. Same contract as
 * `Reveal`: no JavaScript, no animation, nothing missing.
 *
 * Unlike `Reveal` this does animate above the fold. The diagram opens the case
 * study, so it is nearly always in view on load — skipping it there would mean
 * skipping it almost always.
 */
export function DrawOnView({
  children,
  className,
  duration = 0.9,
  stride = 0.07,
}: DrawOnViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const motionSafe = useMotionSafe()

  useLayoutEffect(() => {
    const root = ref.current

    if (!root || !motionSafe || typeof IntersectionObserver === 'undefined') return

    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-draw]'))

    if (paths.length === 0) return

    // Hidden state, applied by script only. `pathLength: 1` normalises every
    // path to a 0–1 scale so one dash pair works regardless of real length.
    for (const path of paths) {
      path.setAttribute('pathLength', '1')
      path.setAttribute('stroke-dasharray', '0 1')
    }

    let started = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return

        started = true
        observer.disconnect()
        animate(
          paths,
          { pathLength: [0, 1] },
          { duration, delay: stagger(stride), ease: 'easeOut' },
        )
      },
      { rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(root)

    return () => observer.disconnect()
  }, [motionSafe, duration, stride])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
