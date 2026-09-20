import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import './styles/index.css'

/**
 * Runs before first paint so the correct theme is already on <html> when the
 * page renders. Without it the light palette flashes before hydration on a
 * dark-mode device. Wrapped in try/catch because storage access throws in
 * private windows and when site data is blocked.
 */
const THEME_GUARD = `
try {
  var stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored)
  }
} catch (e) {}
`

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_GUARD }} />
      </head>
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isResponse = isRouteErrorResponse(error)
  const title = isResponse ? `${error.status}` : 'Something broke'
  const detail = isResponse
    ? error.status === 404
      ? 'That page does not exist.'
      : error.statusText
    : 'An unexpected error occurred.'

  return (
    <main
      id="main"
      className="mx-gutter flex min-h-dvh max-w-2xl flex-col justify-center gap-4 py-24"
    >
      <p className="meta text-muted">Error</p>
      <h1 className="text-h1 font-medium tracking-tight">{title}</h1>
      <p className="text-lead text-muted">{detail}</p>
      <a href="/" className="mt-4 meta text-accent underline underline-offset-4">
        Back to the homepage
      </a>
    </main>
  )
}
