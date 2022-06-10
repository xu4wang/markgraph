'use strict';

var jsyaml     = require('js-yaml');
var base64     = require('./base64');

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
  return window.diagram_documents.documents;
}

function update_document(name, content) {
  var diagram_documents = window.diagram_documents || {};
  var result = diagram_documents.documents || {};
  var h = loadFront(content);

  result[name] = {
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

  try {    //store a JSON version in .json for the frontmatter
    delete h.__content;
    result[name].error = false;
    result[name].json = h;   //...json.nodes = ['n1','n2',...]
  } catch (err) {
    result[name].error = true;
    result[name].json = err.message || String(err);
  }

  diagram_documents.documents = result;
  window.diagram_documents = diagram_documents;
}

function get_subnode_names(id) {
  var diagram_documents = window.diagram_documents || {};
  if (diagram_documents.documents[id]) {
    if (diagram_documents.documents[id].json.nodes) {
      return diagram_documents.documents[id].json.nodes;
    }
  }
  return [];
}

function get_document_content(id) {
  if (window.diagram_documents.documents[id]) {
    var ret = '';
    if (Object.keys(window.diagram_documents.documents[id].json).length !== 0) {
      ret = '---\n' + jsyaml.dump(window.diagram_documents.documents[id].json) + '---';
    }
    return ret + window.diagram_documents.documents[id].body;
  }
  return '';
}

function get_document_body(id) {
  if (window.diagram_documents.documents[id]) {
    return window.diagram_documents.documents[id].body;
  }
  return '';
}

function set_active_document(name) {
  window.diagram_documents = window.diagram_documents || {};
  window.diagram_documents.active = name;
}

function get_active_document() {
  window.diagram_documents = window.diagram_documents || {};
  return window.diagram_documents.active;
}

function init_from_permlink(b64) {
  //init from b64 data
  window.diagram_documents = {};
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
  var documents = window.diagram_documents.documents;
  for (const el in documents) {
    if (documents.hasOwnProperty(el)) {
      obj[el] = get_document_content(el);
    }
  }
  var obj_str = JSON.stringify(obj);
  return base64.encode(obj_str);
}

function get_document_obj(id) {
  if (!window.diagram_documents.documents[id]) {
    update_document(id, '');
  }
  return window.diagram_documents.documents[id].json;
}

function update_attr(id, key, value) {
  //update JSON object first,
  //update yaml accordingly
  var obj = get_document_obj(id)['style'];
  obj[key] = value;
}

function get_attr(id, key) {
  //read node attr, if not available return the default attr value
  var obj = get_document_obj(id)['style'];
  return obj[key];
}

function get_attrs(id) {
  return get_document_obj(id)['style'];
}

function get_edges(doc) {
  if (window.diagram_documents.documents[doc].json.edges) {
    return window.diagram_documents.documents[doc].json.edges;
  }
  return [];
}

function get_all_names() {
  var docs = window.diagram_documents.documents || {};
  var ret = new Set();
  for (let d in docs) {
    if (docs.hasOwnProperty(d)) {
      ret.add(d);
      for (let s of get_subnode_names(d)) {
        ret.add(s);
      }
    }
  }
  return ret;
}

exports.init_from_permlink = init_from_permlink;
exports.build_permlink = build_permlink;

exports.get_active_document = get_active_document;
exports.set_active_document = set_active_document;

exports.get_documents = get_documents;
exports.update_document = update_document;
exports.get_document_content = get_document_content;
exports.get_document_body = get_document_body;

exports.get_subnode_names = get_subnode_names;
exports.get_edges = get_edges;

exports.get_attr = get_attr;
exports.update_attr = update_attr;
exports.get_attrs = get_attrs;

exports.get_all_names = get_all_names;
