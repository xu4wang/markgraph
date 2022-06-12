'use strict';

let canvas = require('./canvas');
let editor = require('./editor');
let explorer = require('./explorer');
let log = require('./log');

//result is use to exchange data among commands.
var result;

/*
Use below para to hide explorer

command: theme
parameters:
    explorer:
        width: 0%
    editor:
        width: 30%
*/
function theme(obj) {
  let default_attr = {
    explorer: {},
    editor: {},
    canvas: {}
  };
  obj = obj || {};
  default_attr = Object.assign(default_attr, obj);
  for (let k in default_attr.explorer) {
    if (default_attr.explorer.hasOwnProperty(k)) {
      explorer.set_attr(k, default_attr.explorer[k]);
      log.append('explorer: ' + k + ' <- ' +  default_attr.explorer[k]);
    }
  }
  for (let k in default_attr.editor) {
    if (default_attr.editor.hasOwnProperty(k)) {
      editor.set_attr(k, default_attr.editor[k]);
      log.append('editor: ' + k + ' <- ' +  default_attr.editor[k]);
    }
  }
  for (let k in default_attr.canvas) {
    if (default_attr.canvas.hasOwnProperty(k)) {
      canvas.set_attr(k, default_attr.canvas[k]);
      log.append('canvas: ' + k + ' <- ' +  default_attr.canvas[k]);
    }
  }
  return true;
}


function check_result() {
  return result;
}

function show_log(obj) {
  let y = obj['checkbox_value'] || false;
  if (y) {
    console.log('log window is showing');
    return true;
  }
  console.log('log window is hide');
  return false;
}

var commands = {
  theme: theme,
  check_result: check_result,
  show_log: show_log
};

//locate the command and run it, keep return value in result for future use.
function run(cmd, para) {
  if (commands[cmd]) {
    result = commands[cmd](para);
  } else {
    result = false;
  }
  return result;
}

exports.run = run;
