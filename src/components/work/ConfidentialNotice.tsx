import { cn } from 'cn'
import { Lock } from 'lucide-react'

/**
 * The plan's longer wording claimed the architecture was "shown with
 * permission". That is a statement about Analyzen's position, and nobody at
 * Analyzen has cleared it — so the notice stays to what is plainly true until
 * they do. Turning a missing link into a stated constraint is the point; the
 * credibility only works if the sentence itself is accurate.
 */
const NOTICE = 'Client system · no public deployment'

export function ConfidentialNotice({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 meta text-muted', className)}>
      <Lock aria-hidden className="size-3 shrink-0" />
      {NOTICE}
    </p>
  )
}
