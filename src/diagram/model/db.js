'use strict';

var PouchDB = require('PouchDB');

const db_name = 'markgraph';
const docs_key = 'markgraph_docs';
var pouch;
var all_docs = {};
/*
active____:    //for UNKNOWN reason, pouchdb cannot store/read nested objects?
                   //as a workaround, put active_ same level with all the doc versions.
                   //ideally, should use a versions object to hold all the document's version.
  docname1: latest version
  docname2: latest version
  ...
docname1:
  time1: ver1:
  time2: ver2:
    ...
document2:
  time1: ver1:
    ...
*/

var docs_key_ver = '';

/*
let doc;
try {
  doc = await db.get('docid');
} catch (err) {
  if (err.name === 'not_found') {
    doc = {};
  } else {
    throw err; // some error other than 404
  }
}

*/
async function _get_doc(k, v) {
  let doc;
  try {
    if (v) {
      doc = await pouch.get(k, { rev: v });
    }  else {
      doc = await pouch.get(k);
    }
  } catch (err) {
    if (err.name === 'not_found') {
      doc = {};
    } else {
      console.log(err); // err; // some error other than 404
    }
  }
  return doc;
}

async function add_version(k, v, ver) {
  let current = await _get_doc(k);
  ver = ver || current._rev;
  var val;
  if (ver) {
    val = Object.assign({}, { _id: k, _rev: ver }, v);
  } else {
    val = Object.assign({}, { _id: k }, v);
  }
  let r = await pouch.put(val);
  return r.rev;
}

async function update_doc_list() {
  docs_key_ver = await add_version(docs_key, all_docs, docs_key_ver);
  return docs_key_ver;
}

function current_time_str() {
  let current = new Date();
  let cDate = current.getFullYear() + '/' + (current.getMonth() + 1) + '/' + current.getDate();
  let cTime = current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds();
  let dateTime = cDate + ' ' + cTime;
  return dateTime;
}


async function update_doc(k, v) {
  all_docs.active[k] = await add_version(k, v, all_docs.active[k]);
  let t = current_time_str();
  all_docs.versions[k] = all_docs.versions[k] || {};
  t = Object.keys(all_docs.versions[k]).length + '-' + t;
  all_docs.versions[k][t] = all_docs.active[k];
  await update_doc_list();
  return all_docs.active[k];
}

async function read_doc(k, ver) {
  if (ver) {
    ver = all_docs.versions[k][ver];
  }
  var result;
  try {
    result = await _get_doc(k, ver);
    delete result._id;
    delete result._rev;
    return result;
  } catch (err) {
    console.log(err);
    return {};
  }
}

/* below is working, but we will use time stamp as version.
async function get_versions(k) {
  //return a version list for document k.
  let doc;
  try {
    doc = await pouch.get(k, { revs: true });
  } catch (err) {
    if (err.name === 'not_found') {
      return [];
    }
    console.log(err); // err; // some error other than 404
  }
  let r = [];
  let i = doc._revisions.start + 1;
  for (let e of doc._revisions.ids) {
    //build list
    i -= 1;
    r.push(String(i) + '-' + e);
  }
  return r;
}
*/

function get_versions(k) {
  let ver = all_docs.versions[k] || {};
  return Object.keys(ver).sort(function (a, b) { return parseInt(a, 10) > parseInt(b, 10); });
}

function delete_doc(k) {
  all_docs.active[k] = '';
}

function list_doc() {
  //return all valid docs in a dict
  return all_docs.active;
}

async function init() {
  pouch = await new PouchDB(db_name);
  let r = await _get_doc(docs_key);
  if (r._rev) {
    docs_key_ver = r._rev;
    delete r._id;
    delete r._rev;
    all_docs = r;
    return docs_key_ver;
  }
  all_docs = { active:{}, versions:{} };
  docs_key_ver = await add_version(docs_key, all_docs);
  return docs_key_ver;
}

async function close() {
  await pouch.close();
  //await pouch.destroy();
}

exports.update_doc = update_doc;
exports.read_doc = read_doc;
exports.delete_doc = delete_doc;
exports.list_doc = list_doc;
exports.init = init;
exports.close = close;
exports.get_versions = get_versions;
