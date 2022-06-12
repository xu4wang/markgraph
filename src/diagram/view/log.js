'use strict';

let logtext = '';

function append(s) {
  logtext += s;
  logtext += '\n';
}

function clear() {
  logtext = '';
}

function read() {
  return logtext;
}

exports.append = append;
exports.clear = clear;
exports.read = read;
