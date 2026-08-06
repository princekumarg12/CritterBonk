import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base makes the production build portable: it works at a domain
// root (Vercel/Netlify) *and* under a sub-path (GitHub Pages project sites)
// without any extra configuration.
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
