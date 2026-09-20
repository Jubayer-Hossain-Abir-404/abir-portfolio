/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * The site's own origin, no trailing slash — `https://example.com`.
   *
   * Supplied by `netlify.toml`, which forwards Netlify's `$URL`. Absolute
   * canonical and `og:image` URLs cannot be derived inside a static build, so
   * without this they fall back to the placeholder in `src/lib/seo.ts`.
   */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
