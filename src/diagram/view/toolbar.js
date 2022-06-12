'use strict';

/*
listen on below events:
- DOCUMENT-UPDATE
- DOCUMENT-DELETE
- RESET

Whenever a document is updated,
    if the document is a function node,
        check if we need to update toolbar.

when event hanppens, invoke related node by calling commands.js
*/

var m = require('../model/model');
var c = require('./commands.js');


//all the node with a toolbar entry.
let widgets = new Set();
let container_ele = null;

//button.addEventListener('click', cb)
function btn_listener(e) {
  let id = e.target.id;
  //call commands
  let cmds = m.get_common_attr(id, 'commands');
  for (let cmd of cmds) {
    c.run(cmd.name, cmd.argv);
  }
}

function add_button(name, label, cb) {
  //add button DOM and listener
  var childNode = document.createElement('button');
  childNode.innerHTML = label;
  childNode.className = 'button-32';
  childNode.id = name;
  container_ele.appendChild(childNode);
  childNode.addEventListener('click', cb);
  widgets.add(name);
}

function rm_cb() {
  let name = m.get_active_document();
  if (widgets.has(name)) {
    widgets.delete(name);
    //remove widget name from DOM
    let e = document.getElementById(name);
    e.remove();
    //e.parentNode.removeChild(e);
  }
}

function add_cb() {
  //create new button, add current node as listener
  let name = m.get_active_document();
  add_button(name, name, btn_listener);
}

function exe_cb() {
  let name = m.get_active_document();
  let cmds = m.get_common_attr(name, 'commands');
  for (let cmd of cmds) {
    c.run(cmd.name, cmd.argv);
  }
}

function add_tools() {
  //exe active node
  //add button
  //remove button
  add_button('__SYSTEM_EXE', 'Execute', exe_cb);
  add_button('__SYSTEM_ADD', 'Add Button', add_cb);
  add_button('__SYSTEM_REMOVE', 'Remove Button', rm_cb);
}

function init(container) {
  container_ele = document.getElementById(container);
  //add function buttons
  add_tools();
  return container_ele;
}

exports.init = init;
