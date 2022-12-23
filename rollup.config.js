import tsc from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import rollupPluginInjectProcessEnv from 'rollup-plugin-inject-process-env'

export default {
  input: 'src/entry.ts',
  output: { file: 'docs/app.js', format: 'es', sourcemap: true },
  plugins: [
    tsc(),
    resolve(),
    commonjs(),
    json(),
    rollupPluginInjectProcessEnv(),
    process.env.minify ? terser() : {},
  ]
}
