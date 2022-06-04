'use strict';

var mixin = require('mixin-deep');


function id2element(id) {
  //var node = window.diagram_nodes[id];
  //return node.ele;
  return document.getElementById(id);
}

function add_edge(attrs) {
  var default_attrs = {
    anchor: 'Continuous',
    paintStyle: {
      strokeWidth: 2,
      stroke: 'green'
    },
    endpoints: [ 'Blank', 'Blank' ],
    overlays: [ { type: 'PlainArrow', options: {
      location: 1
    } } ]
  };
  var default_label = {
    type:'Label',
    options:{
      label:'default'
    }
  };
  if ('label' in attrs) {
    default_label.options.label = attrs.label;
    default_attrs.overlays.push(default_label);
  }
  default_attrs.source = id2element(attrs.from);
  default_attrs.target = id2element(attrs.to);
  var instance = window.j;
  default_attrs = mixin(default_attrs, attrs);
  instance.connect(default_attrs);
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
