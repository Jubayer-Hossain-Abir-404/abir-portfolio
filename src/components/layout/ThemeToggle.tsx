import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * The theme is external state: it lives on the <html> element, written before
 * React boots by the guard script in root.tsx, and it also moves on its own
 * when the OS preference changes. `useSyncExternalStore` is the primitive for
 * exactly that — and it is the supported way to return a different value during
 * hydration than the prerender produced, with no mismatch warning and no
 * setState-in-effect.
 */
const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)

  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onStoreChange)

  return () => {
    listeners.delete(onStoreChange)
    media.removeEventListener('change', onStoreChange)
  }
}

/** What the page is actually showing right now: attribute first, OS second. */
function getSnapshot(): Theme {
  const attribute = document.documentElement.getAttribute('data-theme')

  if (attribute === 'light' || attribute === 'dark') return attribute

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Null, not a guess. The prerendered HTML cannot know which theme the visitor
 * will get, so the button renders as a same-size placeholder and the header
 * never shifts when the real icon arrives.
 */
function getServerSnapshot(): Theme | null {
  return null
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', next)

    // Storage throws in private windows and when site data is blocked. The
    // toggle still works for the session; it just will not be remembered.
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* preference is not persistable here */
    }

    listeners.forEach((listener) => listener())
  }

  if (theme === null) {
    return <div aria-hidden className="size-9" />
  }

  const goingDark = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={goingDark ? 'Switch to dark theme' : 'Switch to light theme'}
      className="grid size-9 place-items-center rounded-editorial text-muted transition-colors hover:text-fg"
    >
      {goingDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  )
}
