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
    // alias: [
    //   {
    //     find: "@",
    //     replacement: path.resolve(__dirname, "/src"),
    //   },
    // ],
  },
})
