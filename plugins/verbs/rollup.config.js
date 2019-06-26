import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/compromise-verbs.mjs',
        format: 'esm',
      },
    ],
    plugins: [json(), commonjs()],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/compromise-verbs.min.js',
        format: 'cjs',
      },
    ],
    plugins: [json(), commonjs(), terser()],
  },
]
