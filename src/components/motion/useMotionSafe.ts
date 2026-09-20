import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function read(): boolean {
  return typeof window === 'undefined' ? false : !window.matchMedia(QUERY).matches
}

/**
 * Whether motion is welcome.
 *
 * Initialised lazily so the very first client render already has the real
 * answer — an effect that arms an animation runs before paint rather than one
 * frame late, which is the difference between a reveal and a flicker. The
 * prerender has no `window`, so it resolves to `false`; nothing rendered
 * depends on the value, so there is no hydration mismatch.
 *
 * The listener stays attached because the preference can change mid-session on
 * every major OS, and an animation that ignores the change is exactly the one
 * the setting exists to stop.
 */
export function useMotionSafe(): boolean {
  const [safe, setSafe] = useState(read)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const sync = () => setSafe(!media.matches)

    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  return safe
}
