import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: '1_src/etoro_export.ts', 
    output: {
      file: '2_transpiled/etoro_export.js',
      format: 'iife',
      name: 'etoro_export',
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
  {
    input: '1_src/seeking_alpha_import.ts', 
    output: {
      file: '2_transpiled/seeking_alpha_import.js',
      format: 'iife',
      name: 'etoro_export',
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
];
