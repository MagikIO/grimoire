// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig(
  /** @typedef {import('vite').BuildOptions */
  {
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: [resolve(__dirname, 'src/index.ts')],
        name: 'Grimoire',
        formats: ['es'],
      },
      rollupOptions: {
        makeAbsoluteExternalsRelative: true,
        preserveEntrySignatures: 'strict',
      },
      minify: false,
    },
    plugins: [dtsPlugin({ rollupTypes: true })],
  })
