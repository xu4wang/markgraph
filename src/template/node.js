'use strict';

/*
var n1 = new Node("n1","baidu",'canvas','https://www.baidu.com/img/flexible/logo/pc/result@2.png','');
n1.layout(2,1,300,200,0.2);

var n2 = new Node("n1","baidu",'canvas','https://www.baidu.com/img/flexible/logo/pc/result@2.png','5px');
n2.layout(2,2,300,200,0.2);
*/
//const { markdownItImageSize } = require('markdown-it-image-size');

/*

const MarkdownIt = require('markdown-it');
const { markdownItImageSize } = require('markdown-it-image-size');

const mdrenderer = MarkdownIt();
mdrenderer.use(markdownItImageSize);
*/

const { Remarkable } = require('remarkable');
const { escapeHtml } = require('remarkable').utils;
var md2html = new Remarkable();

md2html.renderer.rules.image = (function () {
  var original = md2html.renderer.rules.image;
  //eslint-disable-next-line
  return function(tokens, idx, opt, env) {
    var width = escapeHtml(tokens[idx].title);
    var imgOutput = original.apply(this, arguments);
    // add width
    if (width) {
      return  imgOutput.substring(0, imgOutput.length - 1) + ' width="' + width + '">';
    }
    return imgOutput;
  };
})();

function add_px(value) {
  if (!isNaN(parseFloat(value)) && isFinite(value)) {
    return value + 'px';
  }
  return value;
}

function node(id, attrs, md) {
  var childNode = document.createElement('div');
  childNode.innerHTML = '';
  childNode.className = 'window';
  childNode.id = id;
  for (let k in attrs) {
    if (attrs.hasOwnProperty(k)) {
      childNode.style[k] = attrs[k];
    }
  }
  //var md2html = window.markdownit();
  //md2html.use(markdownItImageSize);
  let h = md2html.render(md);
  childNode.innerHTML = h;
  var canvas = document.getElementById(attrs.parent);
  canvas.appendChild(childNode);
  window.j.manage(childNode);
}

//add a node
//rol, col, width, height, padding,id,title,parent,img, border
function add_node(id, attrs, md) {
  var default_attrs = {
    top: 100,
    left: 100,
    width: 200,
    height: 200,
    id: id,
    parent: 'canvas'
  };
  default_attrs = Object.assign(default_attrs, attrs);
  default_attrs.top = add_px(default_attrs.top);
  default_attrs.left = add_px(default_attrs.left);
  default_attrs.width = add_px(default_attrs.width);
  default_attrs.height = add_px(default_attrs.height);
  node(id, default_attrs, md);
}

function add_nodes(model) {
  var l = model.get_node_names();
  for (let n of l) {
    var a = model.get_node_attrs(n);
    var md = model.get_document_content(n);
    add_node(n, a, md);
  }
}

function clear_nodes() {
  //clear all the nodes
  /* No need. since every node is managed by jsplumb and the j instance reset will remove nodes too. */
}

exports.add_nodes = add_nodes;
exports.clear_nodes = clear_nodes;
