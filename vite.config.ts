import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // `@` aliases come from tsconfig paths, resolved natively by Vite 8.
  resolve: { tsconfigPaths: true },
  // reactRouter() must precede tailwindcss(): the reverse order puts Tailwind's
  // Node module hook ahead of React Router's and breaks its module resolution.
  plugins: [reactRouter(), tailwindcss()],
})
