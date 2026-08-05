import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative, not absolute — this build must work unmodified from any
  // folder depth on any domain (this repo's own GitHub Pages URL today,
  // someone else's hosting tomorrow), not just from a domain root. Vite
  // rewrites every asset path (HTML, CSS url(), import.meta.env.BASE_URL)
  // to be relative to index.html's own location, so nothing needs to know
  // in advance where it's actually deployed.
  base: './',
})
