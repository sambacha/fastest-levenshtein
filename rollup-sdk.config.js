import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const bundle = (config) => ({
  ...config,
  input: 'dev/index.ts',
  external: (id) => !/^[./]/.test(id)
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `build/index.js`,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: `build/index.mjs`,
        format: 'es',
        sourcemap: true
      }
    ]
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `build/index.d.ts`,
      format: 'es'
    }
  })
]
