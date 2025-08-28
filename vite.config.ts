import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/qr-code-generator/', // Set base path for GitHub Pages
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
