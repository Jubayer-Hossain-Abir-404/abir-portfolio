import { ArrowUp } from 'lucide-react'
import { externalLinkProps } from '@/lib/routes'
import type { Social } from '@/types'

type FooterProps = {
  name: string
  location: string
  social: Social[]
}

export function Footer({ name, location, social }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-section border-t border-rule">
      <div className="mx-auto max-w-[88rem] px-gutter py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-tight">{name}</p>
            <p className="mt-2 meta text-muted">{location}</p>
          </div>

          <nav aria-label="Elsewhere">
            <ul className="flex flex-col gap-2 sm:items-end">
              {social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="meta text-muted transition-colors hover:text-accent"
                    {...externalLinkProps(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6 border-t border-rule pt-6">
          <p className="meta text-muted">
            © {year} {name}
          </p>

          <a
            href="#main"
            data-print="hide"
            className="flex shrink-0 items-center gap-1.5 meta text-muted transition-colors hover:text-accent"
          >
            Top
            <ArrowUp aria-hidden className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
