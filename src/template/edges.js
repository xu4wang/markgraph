'use strict';

//var merge = require('merge-deep');


function id2element(id) {
  var node = window.diagram_nodes[id];
  return node.ele;
}


function add_edge(attrs) {
  attrs.source = id2element(attrs.from);
  attrs.target = id2element(attrs.to);
  var instance = window.j;
  instance.connect(attrs);
}

function add_edges(diag_attrs) {
  var edges = diag_attrs.edges;
  for (let n in edges) {
    if (edges.hasOwnProperty(n)) {
      add_edge(edges[n]);
    }
  }
}

function clear_edges() {
  //clear every managed DOMs, including nodes, edges
  window.j.reset();
}

exports.add_edges = add_edges;
exports.clear_edges = clear_edges;
