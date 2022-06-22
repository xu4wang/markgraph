'use strict';

var pdb = require('./db');
var doc_name = 'markgraph';

async function init() {
  await pdb.init();
}

async function read(ver) {
  let r4 = await pdb.read_doc(doc_name, ver);
  return r4;
}

async function write(dat) {
  let r0 = await pdb.read_doc(doc_name);
  if (JSON.stringify(r0) === JSON.stringify(dat)) {
    return '';
  }
  let r1 = await pdb.update_doc(doc_name, dat);
  return r1;
}

async function versions() {
  let v = await pdb.get_versions(doc_name);
  return v;
}

async function close() {
  await pdb.close();
  //await pouch.destroy();
}

exports.init = init;
exports.read = read;
exports.write = write;
exports.versions = versions;
exports.close = close;
