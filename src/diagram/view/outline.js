'use strict';

var m = require('../model/model');
//let canvas = require('./canvas');

//var cmenu = require('./contextmenu');

var ele = document.getElementById('outline');
//var dialog = require('./dialog');

let widgets = new Set();
let container_ele = ele;
let locked = false;
let is_locked = false;

function cb(e) {
  let id =  e.target.id;
  id = id.substring(0, id.length - '__OUTLINE__'.length);
  let name_notes = id.split('@');
  m.set_active_document(name_notes[0], name_notes[1]);
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

//var display = 'block';

function set_attr(name, val) {
  ele.style[name] = val;
  /*
  if (name === 'display') {  //ugly hack for auto hide outline if there is no subnodes.
    display = val;
  }
  */
}


function update_buttons() {
  if (!locked) {
    let nodes = m.get_outline();
    if (Object.keys(nodes).length !== 0) {  //only change outline if current doc has it.
      clear_all_btn();
      for (let n of Object.keys(nodes)) {
        add_button(n, nodes[n], 'button-outline');
      }
    }
    /*
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
    */
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

m.on('OPEN-NOTES', () => {
  //we only do this if it's not locked
  if (!is_locked) {
    clear_all_btn();
  }
});

exports.set_attr = set_attr;
exports.lock = lock;

