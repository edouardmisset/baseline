import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

// https://vitejs.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    printWidth: 80,
  },
  base: '/baseline/',
  plugins: [react()],
})
