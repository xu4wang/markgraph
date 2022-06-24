'use strict';

var jsyaml     = require('js-yaml');
var base64     = require('./base64');
var store      = require('./state');
var storage     = require('./storage');

const default_name = 'default_notes';
const frontpage = 'index';

var notes_name = default_name;

let config_file = 'diagram.system.configuration';

//eslint-disable-next-line
let default_b64 = 'eyJpbmRleCI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuLS0tXG5cblRoaXMgaXMgYW4gZW1wdHkgbm90ZXMuIiwiZGlhZ3JhbS5zeXN0ZW0uY29uZmlndXJhdGlvbiI6Ii0tLVxuc3R5bGU6IHt9XG5ub2RlczogW11cbmVkZ2VzOiBbXVxuYnV0dG9uczogbnVsbFxua2VlcDpcbiAgLSBkaWFncmFtLnN5c3RlbS5jb25maWd1cmF0aW9uXG4tLS1cblxuQ29uZmlndXJhdGlvbiBEYXRhXG4ifQ==';


store.init({
  active: null,   //name of current active node
  impacted: null,  //the node being impacted
  documents: {}
});

function parse(text, options, loadSafe) {
  let contentKeyName = options && typeof options === 'string'
    ? options
    : options && options.contentKeyName
      ? options.contentKeyName
      : '__content';

  //eslint-disable-next-line
  let passThroughOptions = options && typeof options === 'object' ? options : undefined;

  let re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/,
      results = re.exec(text),
      conf = {},
      yamlOrJson;

  if ((yamlOrJson = results[2])) {
    if (yamlOrJson.charAt(0) === '{') {
      conf = JSON.parse(yamlOrJson);
    } else if (loadSafe) {
      conf = jsyaml.safeLoad(yamlOrJson, passThroughOptions);
    } else {
      conf = jsyaml.load(yamlOrJson, passThroughOptions);
    }
  }

  conf[contentKeyName] = results[3] || '';

  return conf;
}

function loadFront(content, options) {
  return parse(content, options, false);
}

/*---------------------- A Wrapper of the model ------------------------*/

function get_documents() {
  //return a list of objects { name, type, content }
  return store.get_store().documents;
}

/*
each doc has 2 attrs:

body:  markdown part
json:  front matter part in JSON

*/

function _update_document(docs, name, content) {
  //TODO need to check 'follow' attributes, prevent loop inherit
  var h;

  try {
    h = loadFront(content);
  } catch (error) {
    h = {};
    h.__content = content;
  }

  docs[name] = {
    body: h.__content
    //content: content
  };

  if (!h.style) {
    h['style'] = {};
  }
  if (!h.nodes) {
    h['nodes'] = [];
  }
  if (!h.edges) {
    h['edges'] = [];
  }

  delete h.__content;
  //docs[name].error = false;
  docs[name].json = h;   //...json.nodes = ['n1','n2',...]

  return { impacted: name, documents: docs };
}

function get_document_content(id) {
  var diagram_documents = store.get_store().documents;
  if (diagram_documents[id]) {
    var ret = '';
    if (Object.keys(diagram_documents[id].json).length !== 0) {
      ret = '---\n' + jsyaml.dump(diagram_documents[id].json) + '---';
    }
    return ret + diagram_documents[id].body;
  }
  return '';
}

function build_doc() {
  //generate b64 data
  var obj = {};
  var documents = store.get_store().documents;
  for (const el in documents) {
    if (documents.hasOwnProperty(el)) {
      obj[el] = get_document_content(el);
    }
  }
  var obj_str = JSON.stringify(obj);
  return obj_str;
}

function get_doc(name) {
  name = name || notes_name;
  return storage.get(name);
}

function get_b64() {
  return base64.encode(get_doc());
}

function update_storage(name, data) {
  name = name || notes_name;
  data = data || build_doc();
  storage.set(name, data);
  store.emit('STORAGE_UPDATE', {});
}



//  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
function update_document(name, content) {
  name = String(name);
  store.emit('DOCUMENT-UPDATE', ({ documents }) => (_update_document(documents, name, content)));
  update_storage();
}

function get_subnode_names(id) {
  var diagram_documents = store.get_store().documents;
  if (diagram_documents[id]) {
    if (diagram_documents[id].json.nodes) {
      return diagram_documents[id].json.nodes;
    }
  }
  return [];
}


function get_document_body(id) {
  var diagram_documents = store.get_store().documents;

  if (diagram_documents[id]) {
    return diagram_documents[id].body;
  }
  return '';
}

function set_active_document(name) {
  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
  //check if it's a notes package???
  /*
  if (storage.getItem(name) !== null) {
    //open the note pacakge named target_doc
    // eslint-disable-next-line no-use-before-define
    reset(name);
  }
  */
}

function get_active_document() {
  return store.get_store().active;
}

function get_impacted_document() {
  return store.get_store().impacted;
}

function get_document_obj(id, create) {
  var documents = store.get_store().documents;
  if (!documents[id]) {
    //update_document(id, '');
    if (create) {
      update_document(id, '');
    } else {
      return {};
    }
  }
  return documents[id].json;
}

function update_attr(id, key, value) {
  //update JSON object first,
  //update yaml accordingly
  var obj = get_document_obj(id)['style'];
  obj[key] = value;
  update_storage();
}

function set_common_attr(id, key, value) {
  var obj = get_document_obj(id, true);
  obj[key] = value;
  update_storage();
}

function get_attr(id, key) {
  //read node attr, if not available return the default attr value
  var obj = get_document_obj(id)['style'];
  var parent = get_document_obj(id)['follow'];

  var r = obj[key];
  if (r) return r;

  if (parent) {
    for (let f of parent) {
      let r = get_attr(f, key);
      if (r) return r;
    }
  }
  return r;
}

function get_attrs(id) {
  var obj = get_document_obj(id)['style'];
  var parent = get_document_obj(id)['follow'];

  if (parent) {
    for (let f of parent) {
      let r = get_attrs(f);
      obj = Object.assign({}, r, obj);
    }
  }
  return obj;
}

function get_edges(doc) {
  var documents = store.get_store().documents;

  if (documents[doc].json.edges) {
    return documents[doc].json.edges;
  }
  return [];
}

function get_common_attr(name, key) {
  var docs = store.get_store().documents;
  if (docs[name]) {
    return docs[name].json[key];
  }
  return '';
}

function get_all_names() {
  var docs = store.get_store().documents;
  var ret = new Set();
  for (let d in docs) {
    if (docs.hasOwnProperty(d)) {
      ret.add(d);
      /* subnode will not be added automatically.
      for (let s of get_subnode_names(d)) {
        ret.add(s);
      }
      */
    }
  }
  var ret2 = {};
  for (let k of ret) {
    ret2[k] = get_common_attr(k, 'note') || '';
  }
  return ret2;
}


function get_config(key) {
  return get_common_attr(config_file, key);
}

function set_config(key, value) {
  set_common_attr(config_file, key, value);
  store.emit('DOCUMENT-UPDATE', () => ({}));
  update_storage();
}

function rename_document(src, target) {
  store.emit('DOCUMENT-RENAME', (s) => {
    s.documents[target] = s.documents[src];
    let keep = get_common_attr(config_file, 'keep');
    if (keep instanceof Array) {
      if (!(get_common_attr(config_file, 'keep').includes(src))) {
        delete s.documents[src];
      }
    }
    update_storage();
    return s;
  });
}

function delete_document(name) {
  store.emit('DOCUMENT-DELETE', (s) => {
    let keep = get_common_attr(config_file, 'keep');
    if (keep instanceof Array) {
      if (!(get_common_attr(config_file, 'keep').includes(name))) {
        delete s.documents[name];
        s.impacted = name;
      }
    }
    update_storage();
    return s;
  });
}

function document_available(name) {
  var docs = store.get_store().documents;
  return name in docs;
}


function allocation_name() {
  let current = new Date();
  let cDate = current.getFullYear() + '_' + (current.getMonth() + 1) + '_' + current.getDate();
  let cTime = current.getHours() + '_' + current.getMinutes() + '_' + current.getSeconds();
  let dateTime = cDate + '_' + cTime;
  return dateTime;
}

function init_from_permlink(obj_str) {
  try {
    //var obj_str = base64.decode(b64);
    var obj = JSON.parse(obj_str);
    if (obj) {
      for (let n in obj) {
        if (obj.hasOwnProperty(n)) {
          update_document(n, obj[n]);
        }
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

function format(hard) {
  if (hard) {
    store.reset_listener();
  }
  store.emit('FORMAT', { documents: {} });
}

//name is the new name after reset
/*

1. ('', false) : open default notes
2. ('name',false) : open name, if not available, init it using default b64 data.
3. ('name', 'b64 data') : assign b64 data to name in storage, and open name.
4. ('', 'b64 data') : allocate a name and assign b64 data, open it.

*/
function reset(name, b64) {
  let notes_data = '';
  store.emit('RESET', {});
  format();

  name = name || '';

  if (name === '') {
    if (b64) {
      //case #4
      notes_name = allocation_name();
      notes_data = base64.decode(b64);
    } else {
      //case #1
      notes_name = default_name;  //use default name;
      notes_data = storage.get(notes_name);
    }
  } else {
    //name is not blank, #2 or #3
    notes_name = name;
    if (b64) {
      notes_data = base64.decode(b64);
    } else {
      notes_data = storage.get(name);
    }
  }


  //init and make sure notes_data is valid
  if (!init_from_permlink(notes_data)) {
    notes_data = base64.decode(default_b64);
    init_from_permlink(notes_data);
  }

  //make sure we have config file, 'diagram.system.configuration'
  let cf = get_config('keep');
  if (cf === '') {
    set_config('keep', [ config_file ]);
  }

  storage.set(notes_name, notes_data);

  set_active_document(frontpage);
  store.emit('OPEN-NOTES', {});
}

function get_notes_name() {
  return notes_name;
}



function duplicate_notes(src, target) {
  if (storage.get(src) !== null) {
    let v = storage.get(src);
    storage.set(target, v);
  }
  store.emit('DOCUMENT-UPDATE', {});
}

function new_notes(name) {
  duplicate_notes(default_name, name);
  store.emit('DOCUMENT-UPDATE', {});
}

function delete_notes(name) {
  if (name !== default_name) {
    storage.del(name); //always remove
  }
  store.emit('DOCUMENT-DELETE', {});
}

function rename_notes(src, target) {
  duplicate_notes(src, target);
  delete_notes(src);
  store.emit('DOCUMENT-RENAME', {});
}

function get_all_notes_name() {
  let r = {};
  for (let k of storage.keys()) {
    if (k.charAt(0) !== '_') {  //exclude pounch db files
      r[k] = 'Notes';
    }
  }
  return r;
}

function is_notes(name) {
  return storage.get(name) !== null;
}

//in a dict
/* each notes is one string. same as the b64 version without base64 encode.
notes_name1: stringify({
   doc_name1: markdown body with frontmatter, same as shown in editor
   doc_name2: ...
})
notes_name2: stringify({
   doc_name1: ...
})

*/
function get_all_notes() {
  let d = {};
  for (let n of Object.keys(get_all_notes_name())) {
    d[n] = get_doc(n);
  }
  return d;
}

function set_all_notes(data) {
  for (let n of Object.keys(get_all_notes_name())) {
    storage.del(n); //always remove
  }
  for (let n of Object.keys(data)) {
    update_storage(n, data[n]);
  }
  reset(notes_name);
}

exports.reset = reset;
exports.get_b64 = get_b64;

exports.get_active_document = get_active_document;
exports.set_active_document = set_active_document;
exports.get_impacted_document = get_impacted_document;

exports.get_documents = get_documents;
exports.update_document = update_document;   //new doc & modify doc
exports.get_document_content = get_document_content;
exports.get_document_body = get_document_body;
exports.rename_document = rename_document;
exports.delete_document = delete_document;
exports.document_available = document_available;

exports.get_subnode_names = get_subnode_names;
exports.get_edges = get_edges;

exports.get_attr = get_attr;
exports.update_attr = update_attr;
exports.get_attrs = get_attrs;
exports.get_common_attr = get_common_attr;

exports.get_all_names = get_all_names;
exports.on = store.on;
exports.reset_listener = store.reset_listener;
exports.set_config = set_config;
exports.get_config = get_config;

exports.format = format;

exports.get_doc = get_doc;

exports.is_notes = is_notes;
exports.new_notes = new_notes;
exports.delete_notes = delete_notes;
exports.rename_notes = rename_notes;
exports.duplicate_notes = duplicate_notes;
exports.get_notes_name = get_notes_name;
exports.get_all_notes_name = get_all_notes_name;
exports.get_all_notes = get_all_notes;  //in a dict
exports.set_all_notes = set_all_notes;  //in a dict

/*
notes_name1:
   doc_name1: ...
   doc_name2: ...
notes_name2:
   doc_name1: ...
   doc_name2: ...

*/

/* support EVENTS
'ACTIVE-DOCUMENT'
'DOCUMENT-UPDATE'
"DOCUMENT-DELETE"
"DOCUMENT-RENAME"
‘RESET’
‘OPEN-NOTES’
STORAGE_UPDATE
*****************/
