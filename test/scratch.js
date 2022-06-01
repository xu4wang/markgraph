'use strict';

var merge = require('merge-deep');

/*
instance.connect({
    source:someElement,
    target:someOtherElement,
    anchor: "AutoDefault",
    endpoints: ["Dot", "Blank"], 
    overlays:[ 
        { type:"Arrow", options:{location:1}},
        { 
            type:"Label", 
            options:{ label:"foo", location:50, id:"myLabel" } 
        }
    ]
})
*/

function id2element(id) {
  var node = window.diagram_nodes[id];
  return node.ele;
}

function add_edge(attrs) {
  attrs.source = id2element(attrs.source);
  attrs.target = id2element(attrs.target);
  var instance = window.j;
  instance.connect(attrs);
}

function add_edges(diag_attrs) {
  var edges = diag_attrs.edges;
  for (let n in edges) {
      add_edge(edges[n]);
  }
}

function clear_edges() {
  //clear all the nodes
  window.j.reset();
}

exports.add_edges = add_edges;
exports.clear_edges = clear_edges;
