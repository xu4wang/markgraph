#!/usr/bin/env node

'use strict';

/* eslint-env es6 */

const shell = require('shelljs');

shell.rm('-rf', '../xu4wang.github.io/diagram/');
shell.mkdir('../xu4wang.github.io/diagram/');
shell.cp('dist/*', '../xu4wang.github.io/diagram/');
