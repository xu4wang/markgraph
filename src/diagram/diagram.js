'use strict';

//const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
/* eslint-env browser */
var canvas = require('./view/canvas');
var pannel = require('./view/pannel');
var layout = require('./view/layout');
var tb = require('./view/toolbar');

var m = require('./model/model');
var dialog = require('./view/dialog');


async function inbox_handler() {
  let n = await dialog.readlines('Send to inbox', 'things to remember', true);
  if (n) {
    let text = '\n\n----\n' + Date() + '\n\n' + n.value;
    m.append_document('inbox', text, 'gtd');
  }
}

function set_inbox() {
  window.addEventListener('keydown', async function (event) {
    if ((event.ctrlKey || event.metaKey) && event.code === 'KeyI') {
      await inbox_handler();
    }
  });
}


window.onload = function () {
  layout.init();
  canvas.init();
  tb.init('toolbar');
  pannel.open_document();
  set_inbox();
};
