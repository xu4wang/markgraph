'use strict';

//const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
/* eslint-env browser */
var canvas = require('./view/canvas');
var pannel = require('./view/pannel');
var layout = require('./view/layout');
var tb = require('./view/toolbar');

window.onload = function () {
  layout.init();
  canvas.init();
  tb.init('toolbar');
  pannel.open_document();
};
