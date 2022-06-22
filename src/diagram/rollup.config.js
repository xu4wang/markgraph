import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';


export default [
  {
    input: 'src/diagram/diagram.js',
    output: { file: 'dist/diagram.js', format: 'iife', name: 'diagram' },
    plugins: [
      builtins(),
      json(),
      resolve({ browser: true}),
      commonjs(),   
      nodePolyfills(), 
    ]
  }
];
