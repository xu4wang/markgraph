#!/usr/bin/env node

'use strict';

/* eslint-env es6 */

const shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.mkdir('dist');

shell.exec('node_modules/.bin/rollup -c src/diagram/rollup.config.js');

shell.cp('src/diagram/index.html', 'dist/');
shell.cp('src/diagram/diagram.css', 'dist/');
shell.cp('node_modules/codemirror/lib/codemirror.css', 'dist/');
shell.cp('library/jsplumb/*', 'dist/');
shell.cp('library/clusterize.js/*', 'dist/');
shell.cp('library/sweetalert2.all.min.js', 'dist/');
shell.cp('doc/*', 'dist/');


