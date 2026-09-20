import { Link, NavLink } from 'react-router'
import { ThemeToggle } from './ThemeToggle'

type NavItem = {
  label: string
  to: string
  /** Same-page anchors never take the active state — only routes do. */
  anchor?: boolean
}

const linkClass = 'meta rounded-editorial px-2.5 py-2 transition-colors hover:text-fg sm:px-3'

type HeaderProps = {
  shortName: string
  role: string
  /** Notes are only advertised once something is actually published. */
  hasNotes: boolean
}

export function Header({ shortName, role, hasNotes }: HeaderProps) {
  const items: NavItem[] = [
    { label: 'Work', to: '/work' },
    ...(hasNotes ? [{ label: 'Notes', to: '/notes' }] : []),
    { label: 'About', to: '/#about', anchor: true },
    { label: 'Contact', to: '/#contact', anchor: true },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[88rem] items-center justify-between gap-6 px-gutter">
        <Link to="/" className="group flex items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-sm font-medium tracking-tight transition-colors group-hover:text-accent">
            {shortName}
          </span>
          {/* Redundant on a phone, and the first thing worth sacrificing. */}
          <span className="hidden meta text-muted sm:inline">{role}</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          <ul className="flex items-center">
            {items.map((item) => (
              <li key={item.to}>
                {item.anchor ? (
                  <Link to={item.to} className={`${linkClass} text-muted`}>
                    {item.label}
                  </Link>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkClass} ${isActive ? 'text-fg' : 'text-muted'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <span aria-hidden className="mx-1 h-4 w-px bg-rule" />

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
