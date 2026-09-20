import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getNotes, getProfile, getSocial } from '@/lib/content'
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

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/*
          Tints the browser UI on mobile. Two declarations rather than one
          because this follows the OS preference; it deliberately does not
          follow the in-page theme toggle, which would mean scripting a <meta>
          on every switch for a strip of chrome the visitor is not looking at.
        */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaf8" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0b0c" />

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

/**
 * Chrome data lives on the root route so the header and footer prerender with
 * real content on every page, rather than being filled in after hydration.
 */
export async function loader() {
  const [profile, social, notes] = await Promise.all([getProfile(), getSocial(), getNotes()])

  return { profile, social, hasNotes: notes.length > 0 }
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { profile, social, hasNotes } = loaderData

  return (
    <div className="flex min-h-dvh flex-col">
      <Header shortName={profile.shortName} role={profile.role} hasNotes={hasNotes} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer name={profile.name} location={profile.location} social={social} />
    </div>
  )
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
