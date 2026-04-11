import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'index.ts',
        'models/api/index': 'models/api/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['mongodb'],
    },
  },
})
