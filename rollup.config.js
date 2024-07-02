import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    name: 'Grimoire',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript(),
  ],
}
