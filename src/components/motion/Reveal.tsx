import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from 'cn'
import { useMotionSafe } from './useMotionSafe'

/**
 * `className` and `style` are owned by the component — the reveal depends on
 * both — so they are excluded from the passthrough. Everything else a caller
 * needs on the element (`id`, `aria-*`, `role`) forwards untouched.
 */
type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger within a group, in milliseconds. Kept small — this is punctuation. */
  delay?: number
  as?: ElementType
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'>

/**
 * Scroll-in reveal that is safe to prerender.
 *
 * The hidden state is applied by script, never by the markup, so the static
 * HTML ships fully visible: with JavaScript blocked or broken the page reads
 * normally instead of being a column of invisible text. Elements already in
 * view on load are marked done immediately rather than animated, which stops
 * the first screen flashing on every navigation.
 *
 * Deliberately CSS transitions rather than Motion. Motion's `initial` prop puts
 * `opacity: 0` into the prerendered HTML, and the accessibility cost of that is
 * not worth the extra control for a fade-and-rise. Motion earns its place in
 * Phase 3, where the diagrams need `pathLength`.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div', ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const motionSafe = useMotionSafe()

  useLayoutEffect(() => {
    const el = ref.current

    if (!el) return

    if (!motionSafe) {
      el.removeAttribute('data-reveal')
      return
    }

    // Anything already on screen has been seen; animating it would be a flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.dataset.reveal = 'in'
      return
    }

    el.dataset.reveal = 'pending'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        el.dataset.reveal = 'in'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [motionSafe])

  return (
    <Tag
      {...rest}
      ref={ref}
      className={cn('reveal', className)}
      // Custom properties are valid inline styles; the type just predates them.
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
