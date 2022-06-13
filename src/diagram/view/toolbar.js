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
var cmenu = require('./contextmenu');


//all the node with a toolbar entry.
let widgets = new Set();
let container_ele = null;

//button.addEventListener('click', cb)
function btn_listener(e) {
  let id = e.target.id;
  //call commands
  id = id.substring(0, id.length - '__TOOLBAR__'.length);
  let cmds = m.get_common_attr(id, 'commands');
  for (let cmd of cmds) {
    c.run(cmd.name, cmd.argv);
  }
}

function add_button(name, label, cb, system) {
  //add button DOM and listener
  name += '__TOOLBAR__';
  if (!widgets.has(name)) {
    var childNode = document.createElement('button');
    childNode.innerHTML = label;
    childNode.className = 'button-32';
    childNode.id = name;
    container_ele.appendChild(childNode);
    childNode.addEventListener('click', cb);
    if (!system) {
      widgets.add(name);
    }
  }
}

/*
let bigCities = cities.filter(function (e) {
    return e.population > 3000000;
});
*/


function rm_cb(name) {
  name = name || m.get_active_document();
  let org_name = name;
  name += '__TOOLBAR__';
  if (widgets.has(name)) {
    widgets.delete(name);
    //remove widget name from DOM
    //name = name.substring(0, name.length - '__TOOLBAR__'.length);
    let e = document.getElementById(name);
    e.remove();
    //e.parentNode.removeChild(e);
    let conf = m.get_config('buttons') || [];
    conf = conf.filter(function (e) {
      return e !== org_name;
    });
    m.set_config('buttons', conf);
  }
}

function add_cb() {
  //create new button, add current node as listener
  let name = m.get_active_document();
  add_button(name, name, btn_listener);
  let conf = m.get_config('buttons') || [];
  conf.push(name);
  m.set_config('buttons', conf);
}

function cleanup() {
  let names = m.get_all_names();
  for (let id of widgets) {
    id = id.substring(0, id.length - '__TOOLBAR__'.length);
    if (!(id in names)) {
      rm_cb(id);
    }
  }

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
  add_button('__SYSTEM_EXE', 'Execute', exe_cb, true);
  //add_button('__SYSTEM_ADD', 'Add Button', add_cb, true);
  //add_button('__SYSTEM_REMOVE', 'Remove Button', rm_cb, true);
}

function config() {
  //add buttons based on document 'diagram.config'
  let conf = m.get_config('buttons') || [];
  for (let b of conf) {
    add_button(b, b, btn_listener);
  }
}



var menu;
var cmen = [
  {
    text: 'Add Current Node Button',
    events: {
      click: function () {
        //var target = e.target;
        //cleanup();
        add_cb();
      }
    }
  },
  {
    text: 'Remove Button',
    events: {
      click: function () {
        //var target = e.target;
        //cleanup();
        rm_cb();
      }
    }
  },
  {
    text: 'Clean Empty Menu Item',
    events: {
      click: function () {
        //var target = e.target;
        cleanup();
      }
    }
  }
];

menu = new cmenu.ContextMenu(cmen);

function init(container) {
  container_ele = document.getElementById(container);
  //add function buttons
  add_tools();
  container_ele.addEventListener('contextmenu', function (e) {
    menu.display(e);
  });
  return container_ele;
}

exports.init = init;
exports.config = config;
exports.cleanup = cleanup;
