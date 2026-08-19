import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Base path for GitHub Pages (project site: /<repo-name>/).
  // Use '/' instead if you deploy to a custom domain or user page.
  base: '/manzi-mfa-app/',
  server: {
    port: 5173,
    open: true
  }
})
