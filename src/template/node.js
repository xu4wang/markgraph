'use strict';

/*
var n1 = new Node("n1","baidu",'canvas','https://www.baidu.com/img/flexible/logo/pc/result@2.png','');
n1.layout(2,1,300,200,0.2);

var n2 = new Node("n1","baidu",'canvas','https://www.baidu.com/img/flexible/logo/pc/result@2.png','5px');
n2.layout(2,2,300,200,0.2);
*/

class Node {
  constructor(id, title, parent, img, border) {
    this.id = id;
    var childNode = document.createElement('div');
    childNode.innerHTML = title;
    childNode.className = 'window';
    childNode.id = id;
    if (img) {
      var i = document.createElement('br');
      childNode.appendChild(i);
      i = document.createElement('br');
      childNode.appendChild(i);
      i = document.createElement('img');
      i.src = img;
      childNode.appendChild(i);
    }
    if (border) {
      childNode.style.border = border;
    }
    this.ele = childNode;
    var canvas = document.getElementById(parent);
    canvas.appendChild(childNode);
  }

  layout(row, col, width, height, padding) {
    //calculate the upper,left position
    var top = height * (row - 1 + padding);
    var left = width * (col - 1 + padding);
    this.ele.style.top = top + 'px';
    this.ele.style.left = left + 'px';
    this.ele.style.width = width * (1 - padding * 2) + 'px';
    this.ele.style.height = height * (1 - padding * 2) + 'px';
  }
}

//add a node
//rol, col, width, height, padding,id,title,parent,img, border
function add_node(diag, attrs) {
  var default_attrs = {
    row: 1,
    col: 1,
    grid_width: 200,
    grid_height: 200,
    grid_padding: 0.2,
    id: 'default id',
    title: '',
    parent: 'canvas',
    img: false,
    border: false
  };
  attrs = Object.assign(default_attrs, diag, attrs);
  var n = new Node(attrs.id, attrs.title, attrs.parent, attrs.img, attrs.border);
  n.layout(attrs.row, attrs.col, attrs.grid_width, attrs.grid_height, attrs.grid_padding);
  var nodes = window.diagram_nodes || {};
  nodes[attrs.id] = n;
  window.diagram_nodes = nodes;
  //if (window.j) {
  //window.j.setContainer('canvas');
  window.j.manage(n.ele);
  //}
}

function add_nodes(diag_attrs) {
  var diag = diag_attrs.diagram;
  var nodes = diag_attrs.nodes;
  for (let n in nodes) {
    if (nodes.hasOwnProperty(n)) {
      var attrs = nodes[n];
      attrs.id = n;
      add_node(diag, attrs);
    }
  }
}

function clear_nodes() {
  //clear all the nodes

  /* No need. since every node is managed by jsplumb and the j instance reset will remove nodes too.
  var nodes = window.diagram_nodes || {};
  for (let n in nodes) {
    if (nodes.hasOwnProperty(n)) {
      nodes[n].ele.remove();
    }
  }
  */
  window.diagram_nodes = {};
}

exports.add_nodes = add_nodes;
exports.clear_nodes = clear_nodes;
