import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/crystalcube',
  resolve: {
    alias: {
      src: path.resolve('src/'),
    }
  },
  define: {
    'APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  // This allows routing to work properly on GitHub pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {}
      },
    },
  },
})
