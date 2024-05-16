import * as esbuild from 'esbuild'
import { resolve, join } from 'path'

(async () => {
  const result = await esbuild.build({
    entryPoints: [resolve(import.meta.dirname, join('src', 'index.ts'))],
    outfile: resolve(import.meta.dirname, join('dist', 'index.js')),
    bundle: true,
    minify: true,
    treeShaking: true,
    sourcemap: true,
    platform: 'neutral',
    format: 'esm'
  })

  console.log('[GRIMOIRE] Build complete:', result)
})().catch((e) => {
  console.error('[GRIMOIRE] Build failed:', e)
  throw new Error(e)
})


