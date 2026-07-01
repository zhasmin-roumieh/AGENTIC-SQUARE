import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Site is served at https://<user>.github.io/AGENTIC-SQUARE/ — keep this
  // in sync with the font paths hardcoded in src/index.css if the repo is renamed.
  base: '/AGENTIC-SQUARE/',
})
