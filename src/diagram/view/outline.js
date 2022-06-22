'use strict';

var m = require('../model/model');
let canvas = require('./canvas');

//var cmenu = require('./contextmenu');

var ele = document.getElementById('outline');
//var dialog = require('./dialog');

let widgets = new Set();
let container_ele = ele;
let locked = false;
let is_locked = false;

function cb(e) {
  let id =  e.target.innerHTML;
  m.set_active_document(id);
}


function add_button(name, label, classname) {
  //add button DOM and listener
  name += '__OUTLINE__';
  if (!widgets.has(name)) {
    widgets.add(name);
    var childNode = document.createElement('button');
    childNode.innerHTML = label;
    childNode.className = classname;
    childNode.id = name;
    container_ele.appendChild(childNode);
    childNode.addEventListener('click', cb);
  }
}

function clear_all_btn() {
  for (let name of widgets) {
    widgets.delete(name);
    let e = document.getElementById(name);
    e.remove();
  }
}

var display = 'block';

function set_attr(name, val) {
  ele.style[name] = val;
  if (name === 'display') {  //ugly hack for auto hide outline if there is no subnodes.
    display = val;
  }
}


function update_buttons() {
  if (!locked) {
    clear_all_btn();
    let nodes = m.get_subnode_names(canvas.get_currect_doc());
    if (nodes.length === 0) {
      //auto hide
      //display = ele.style['display'];
      //set_attr('display', 'none');
      ele.style['display'] = 'none';
    } else {
      set_attr('display', display);
      for (let n of nodes) {
        add_button(n, n, 'button-outline');
      }
    }
  }
}

function lock(status) {
  is_locked = status;
}

m.on('DOCUMENT-UPDATE', () => {
  if (!is_locked) {
    update_buttons();
  }
});

m.on('ACTIVE-DOCUMENT', () => {
  if (!is_locked) {
    update_buttons();
  }
});

exports.set_attr = set_attr;
exports.lock = lock;

