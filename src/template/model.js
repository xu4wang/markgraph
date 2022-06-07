'use strict';

var jsyaml     = require('js-yaml');
var base64     = require('./base64');

/*---------------------- A Wrapper of the model ------------------------*/

/*
window.diagram_documents =
{
  documents : {
    diagram: {
      type: "yaml",
      content: ... ,
      json: ...  //JSON object
      result: ...
    }
    n1: {
      type: "markdown",
      content: ...   //text string
    }
    ...
  }
  active: "diagram";
  names: ...
}
*/

function get_documents() {
  //return a list of objects { name, type, content }
  return window.diagram_documents.documents;
}

function update_document(name, type, content) {
  var diagram_documents = window.diagram_documents || {};
  var result = diagram_documents.documents || {};
  if (type === 'yaml') {
    name = 'diagram';
  }
  result[name] = {
    content: content,
    type: type
  };
  if (type === 'yaml') {
    var names = new Set();
    //names.add(name);
    try {
      var obj = jsyaml.load(content, { schema: jsyaml.DEFAULT_SCHEMA });
      result[name].error = false;
      result[name].json = obj;
      //console.log(obj);
      if (obj.nodes) {
        for (let n in obj.nodes) {
          if (obj.nodes.hasOwnProperty(n)) {
            names.add(n);
          }
        }
      }
    } catch (err) {
      result[name].error = true;
      result[name].json = err.message || String(err);
    }
    diagram_documents.names = names;
  }
  diagram_documents.documents = result;
  window.diagram_documents = diagram_documents;
}

function get_node_names() {
  var diagram_documents = window.diagram_documents || {};
  return diagram_documents.names;
}

function get_document_content(id) {
  if (window.diagram_documents.documents[id]) {
    return window.diagram_documents.documents[id].content;
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

  var obj_str = base64.decode(b64);
  var obj = JSON.parse(obj_str);
  /*
  diagram: ...
  n1:...
  n2:...
  */
  for (let n in obj) {
    if (obj.hasOwnProperty(n)) {
      if (n === 'diagram') {
        update_document(n, 'yaml', obj[n]);
      } else {
        update_document(n, 'markdown', obj[n]);
      }
    }
  }
}

function build_permlink() {
  //generate b64 data
  var obj = {};
  //obj.diagram =
  var docs =  window.diagram_documents.documents;
  obj.diagram = docs['diagram']['content'];
  var names = window.diagram_documents.names;
  for (const el of names) {
    obj[el] = get_document_content(el);
  }
  var obj_str = JSON.stringify(obj);
  return base64.encode(obj_str);

}

function update_node_attr(id, key, value) {
  //update JSON object first,
  //update yaml accordingly
  var nodes = window.diagram_documents.documents.diagram.json.nodes;
  nodes[id][key] = value;
}

function get_node_attr(id, key) {
  //read node attr, if not available return the default attr value
  var nodes = window.diagram_documents.documents.diagram.json.nodes;
  var d = window.diagram_documents.documents.diagram.json.default;
  var ret = d[key];
  if (nodes[id]) {
    if (nodes[id][key]) {
      ret = nodes[id][key];
    }
  }
  return ret;
}

function get_node_attrs(id) {
  var nodes = window.diagram_documents.documents.diagram.json.nodes;
  var d = window.diagram_documents.documents.diagram.json.default;
  var ret = {};
  if (nodes[id]) {
    return Object.assign(ret, d, nodes[id]);
  }
  return d;
}

function get_edges() {
  return window.diagram_documents.documents.diagram.json.edges;
}

function json_update_yaml() {
  var obj = window.diagram_documents.documents.diagram.json;
  //rebuild yaml
  var y = jsyaml.dump(obj);
  window.diagram_documents.documents.diagram.content = y;
}


exports.init_from_permlink = init_from_permlink;
exports.build_permlink = build_permlink;

exports.get_active_document = get_active_document;
exports.set_active_document = set_active_document;

exports.get_documents = get_documents;
exports.update_document = update_document;
exports.get_document_content = get_document_content;
exports.get_node_names = get_node_names;

exports.get_node_attr = get_node_attr;
exports.update_node_attr = update_node_attr;
exports.json_update_yaml = json_update_yaml;

exports.get_edges = get_edges;
exports.get_node_attrs = get_node_attrs;
