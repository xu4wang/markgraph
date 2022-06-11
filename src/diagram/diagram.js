'use strict';

//const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
/* eslint-env browser */
var canvas = require('./view/canvas');
var pannel = require('./view/pannel');
var layout = require('./view/layout');

window.onload = function () {
  layout.init();
  pannel.open_document();
  canvas.init();
};