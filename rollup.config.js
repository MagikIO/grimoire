import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    name: 'Grimoire',
    sourcemap: true,
  },
  plugins: [
    typescript(),
  ],
}
