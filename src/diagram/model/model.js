'use strict';

var jsyaml     = require('js-yaml');
var base64     = require('./base64');
var store      = require('./state');

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

function _update_document(impacted, docs, name, content) {
  //TODO need to check 'follow' attributes, prevent loop inherit
  var new_file_created = false;
  var h;

  try {
    h = loadFront(content);
  } catch (error) {
    h = {};
    h.__content = content;
  }

  if (!docs[name]) {
    //notify listener that a file was created
    new_file_created = true;
  }

  docs[name] = {
    body: h.__content,
    content: content
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
  docs[name].error = false;
  docs[name].json = h;   //...json.nodes = ['n1','n2',...]

  if (new_file_created) {
    store.emit('DOCUMENT-CREATE',  { impacted: name });
  }
  impacted = name;
  return { impacted: name, documents: docs };
}

//  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
function update_document(name, content) {
  name = String(name);
  store.emit('DOCUMENT-UPDATE', ({ impacted, documents }) => (_update_document(impacted, documents, name, content)));
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

function get_document_body(id) {
  var diagram_documents = store.get_store().documents;

  if (diagram_documents[id]) {
    return diagram_documents[id].body;
  }
  return '';
}

function set_active_document(name) {
  store.emit('ACTIVE-DOCUMENT', () => ({ active : name }));
}

function get_active_document() {
  return store.get_store().active;
}

function get_impacted_document() {
  return store.get_store().impacted;
}

function init_from_permlink(b64) {
  //init from b64 data
  //reset store
  store.emit('RESET', () => ({
    active: null,
    documents: {}
  }));

  try {
    var obj_str = base64.decode(b64);
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

function build_permlink() {
  //generate b64 data
  var obj = {};
  var documents = store.get_store().documents;
  for (const el in documents) {
    if (documents.hasOwnProperty(el)) {
      obj[el] = get_document_content(el);
    }
  }
  var obj_str = JSON.stringify(obj);
  return base64.encode(obj_str);
}

function get_document_obj(id) {
  var documents = store.get_store().documents;
  if (!documents[id]) {
    update_document(id, '');
  }
  return documents[id].json;
}

function update_attr(id, key, value) {
  //update JSON object first,
  //update yaml accordingly
  var obj = get_document_obj(id)['style'];
  obj[key] = value;
}

function set_common_attr(id, key, value) {
  var obj = get_document_obj(id);
  obj[key] = value;
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
      /*
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

let config_file = 'diagram.system.configuration';

function get_config(key) {
  return get_common_attr(config_file, key);
}

function set_config(key, value) {
  set_common_attr(config_file, key, value);
  store.emit('DOCUMENT-UPDATE', () => ({}));
}

function rename_document(src, target) {
  store.emit('DOCUMENT-RENAME', (s) => {
    s.documents[target] = s.documents[src];
    delete s.documents[src];
    return s;
  });
}

function delete_document(name) {
  store.emit('DOCUMENT-DELETE', (s) => {
    delete s.documents[name];
    return s;
  });
}

function document_available(name) {
  var docs = store.get_store().documents;
  return name in docs;
}

function reset() {
  store.emit('RESET', () => ({
    active: null,
    documents: {}
  }));
}

exports.reset = reset;
exports.init_from_permlink = init_from_permlink;
exports.build_permlink = build_permlink;

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

/* support EVENTS
'ACTIVE-DOCUMENT'
'DOCUMENT-UPDATE'
"DOCUMENT-DELETE"
"DOCUMENT-RENAME"
"DOCUMENT-CREATE"
'RESET'
*****************/
