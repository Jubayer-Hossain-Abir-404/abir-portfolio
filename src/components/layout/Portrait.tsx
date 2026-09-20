import { cn } from 'cn'
import type { Portrait as PortraitData } from '@/types'

type PortraitProps = {
  portrait: PortraitData
  className?: string
}

/**
 * Treated portrait: grayscale with a warm multiply wash, returning to full
 * colour on hover. The grain overlay from the page sits on top of it, so it
 * reads as printed rather than pasted in.
 *
 * `loading="eager"` because it is above the fold on wide viewports often enough
 * that lazy-loading it just produces a visible pop.
 */
export function Portrait({ portrait, className }: PortraitProps) {
  return (
    <figure className={cn('group', className)}>
      <div className="relative overflow-hidden border border-rule bg-surface">
        {/* The source is square (960×960); the frame is 4:5, so `object-cover`
            trims ~96px from each side and leaves the vertical untouched. The
            subject is centred enough that a default centre crop keeps him
            whole. `width`/`height` carry the file's real intrinsic size, and
            the aspect-ratio utility holds the box, so nothing shifts on load. */}
        <img
          src={portrait.src}
          alt={portrait.alt}
          width={960}
          height={960}
          loading="eager"
          decoding="async"
          className="aspect-4/5 w-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 motion-reduce:transition-none"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-accent/12 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0 motion-reduce:transition-none dark:bg-accent/8 dark:mix-blend-screen"
        />
      </div>

      {portrait.caption ? (
        <figcaption className="mt-3 meta text-muted">{portrait.caption}</figcaption>
      ) : null}
    </figure>
  )
}
