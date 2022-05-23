import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default [
  {
    input: 'src/template/diagram.js',
    output: { file: 'dist/diagram.js', format: 'iife', name: 'diagram' },
    plugins: [
      nodePolyfills(),
      nodeResolve(),
      commonjs()
    ]
  }
];
