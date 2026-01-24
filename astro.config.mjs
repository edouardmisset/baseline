import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // GitHub Pages deployment
  site: 'https://edouardmisset.github.io',
  base: '/baseline',

  // Output static HTML (SSG)
  output: 'static',

  // React integration for islands
  integrations: [react()],

  // Build output directory
  outDir: 'dist',

  // Vite config for CSS modules and path resolution
  vite: {
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
