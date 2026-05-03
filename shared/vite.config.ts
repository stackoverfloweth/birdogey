import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      entryRoot: '.',
      include: ['index.ts', 'models/**/*.ts', 'services/**/*.ts', 'schemas/**/*.ts', 'utilities/**/*.ts'],
      exclude: ['node_modules', 'dist'],
    }),
  ],
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
