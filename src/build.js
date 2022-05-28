#!/usr/bin/env node

'use strict';

/* eslint-env es6 */

const shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.mkdir('dist');

shell.exec('node_modules/.bin/rollup -c src/template/rollup.config.js');

shell.cp('src/template/index.html', 'dist/');
shell.cp('src/template/diagram.css', 'dist/');
shell.cp('node_modules/codemirror/lib/codemirror.css', 'dist/');
shell.cp('jsplumb/*', 'dist/');

