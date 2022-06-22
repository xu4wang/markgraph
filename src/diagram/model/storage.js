'use strict';

let prefix = '__markgraph_';

function set(k, v) {
  localStorage.setItem(prefix + k, v);
}

function get(k) {
  return localStorage.getItem(prefix + k);
}

function del(k) {
  localStorage.removeItem(prefix + k); //always remove
}

function keys() {
  let r = [];
  for (let k of Object.keys(window.localStorage)) {
    if (k.startsWith(prefix)) {
      r.push(k.substring(prefix.length));
    }
  }
  return r;
}

exports.set = set;
exports.get = get;
exports.delete = del;
exports.keys = keys;
