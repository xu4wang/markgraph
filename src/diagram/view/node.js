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
//var hljs = require('highlight.js'); // https://highlightjs.org/

const { escapeHtml } = require('remarkable').utils;
var md2html = new Remarkable('full', {
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkTarget:   '',           // set target to open link in

  // Enable some language-neutral replacements + quotes beautification
  typographer:  true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’'
});
const mermaid = require('mermaid');
const mermaidAPI = mermaid.mermaidAPI;

var edge = require('./edges');

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


md2html.renderer.rules.fence_custom['mermaid'] = function (tokens, index) {
  var token = tokens[index];
  var result;
  mermaidAPI.render('id1', token.content, function (cbResult) {
    result = cbResult;
  });
  return result;
};


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
  //console.log(md);
  let h = md2html.render(md);
  childNode.innerHTML = h;
  var canvas = document.getElementById(attrs.parent);
  canvas.appendChild(childNode);
  window.j.manage(childNode);
}

//add a node
//rol, col, width, height, padding,id,title,parent,img, border
function add_only_node(id, attrs, md) {
  var default_attrs = {
    width: '900',
    height: '5000',
    'text-align': 'left',
    'padding-top': '50px',
    'padding-left': '50px',
    'padding-right': '50px',
    left: '2px',
    top: '2px',
    'line-height': '1.4',
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

//display all the nodes and edges in the active document
//if the node is a function node.
function add_node(model, name) {
  var l = model.get_subnode_names(name);
  var e = model.get_edges(name);
  if (l.length === 0) {
    add_only_node(name, model.get_attrs(name), model.get_document_body(name));
  } else {
    for (let n of l) {
      if (model.document_available(n)) {
        add_only_node(n, model.get_attrs(n), model.get_document_body(n));
      }
    }
  }
  if (e.length !== 0) {
    //    add_only_node(name, model.get_attrs(name), model.get_document_body(name));
    //  } else {
    edge.add_edges(e);  //add edges here sine edges are part of node.
  }
}

function clear_nodes() {
  //clear all the nodes
  /* No need. since every node is managed by jsplumb and the j instance reset will remove nodes too. */
}

exports.add_node = add_node;
exports.clear_nodes = clear_nodes;
