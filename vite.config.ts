import { sentryVitePlugin } from '@sentry/vite-plugin'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    svgLoader(),
    VueDevTools(),
    sentryVitePlugin({
      org: 'kitbag',
      project: 'javascript-vue',
    })],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
  build: {
    target: ['es2022'],
    sourcemap: true,
  },
})
