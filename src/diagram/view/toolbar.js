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
var dialog = require('./dialog');
let explorer = require('./explorer');
let canvas = require('./canvas');
let editor = require('./editor');
let outline = require('./outline');
let tm = require('../model/timemachine');

const target_state_init = {
  explorer: 'show',        //show, hide
  editor: 'show',          //show, hide
  canvas: 'show',          //show, locked
  outline: 'show'          //show, hide, locked
};

let browse_history = [ 'index' ];
let current_file = 0;

function add_to_list(name) {
  browse_history.push(name);
  if (browse_history.length > 100) browse_history.shift();
  //current_file = browse_history.length - 1;
}

function previous() {
  current_file -= 1;
  if (current_file < 0) current_file = 0;
  return browse_history.at(current_file);
}

function next() {
  current_file += 1;
  if (current_file === browse_history.length) current_file = browse_history.length - 1;
  return browse_history.at(current_file);
}

function reset_history() {
  browse_history = [ 'index' ];
  current_file = 0;
}

let target_state = Object.assign({}, target_state_init);

const colors = {
  show: 'white',
  hide: 'gray',
  lock: 'red'
};


//all the node with a toolbar entry.
let widgets = new Set();
let container_ele = null;
let notes_name_ele = null;
let doc_name_ele = null;

//button.addEventListener('click', cb)
function btn_listener(e) {
  let id = e.target.id;
  //call commands
  id = id.substring(0, id.length - '__TOOLBAR__'.length);
  let cmds = m.get_common_attr(id, 'commands');
  if (cmds) {
    for (let cmd of cmds) {
      c.run(cmd.name, cmd.argv);
    }
  } else if (m.document_available(id)) {
    m.set_active_document(id);
  }
}

function add_button(name, label, cb, classname) {
  //add button DOM and listener
  name += '__TOOLBAR__';
  classname = classname || 'button-system';
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

function clear_all_cb() {
  for (let name of widgets) {
    widgets.delete(name);
    //remove widget name from DOM
    //name = name.substring(0, name.length - '__TOOLBAR__'.length);
    let e = document.getElementById(name);
    e.remove();
    //e.parentNode.removeChild(e);
  }
}

function add_cb() {
  //create new button, add current node as listener
  let name = m.get_active_document();
  add_button(name, name, btn_listener, 'button-user');
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
function exe_notes() {
  explorer.show_notes();
}

function exe_index() {
  m.set_active_document('index');
}

function exe_show_hide(e, name, mod) {
  if (target_state[name] === 'hide') {
    mod.set_attr('display', 'block');
    e.target.style.color = colors['show'];
    target_state[name] = 'show';
  } else {
    mod.set_attr('display', 'none');
    e.target.style.color = colors['hide'];
    target_state[name] = 'hide';
  }
}

/*
function exe_show_lock(e, name, mod) {
  if (target_state[name] === 'lock') {
    mod.lock(false);
    e.target.style.color = colors['show'];
    target_state[name] = 'show';
  } else {
    mod.lock(true);
    e.target.style.color = colors['lock'];
    target_state[name] = 'lock';
  }
}
*/

function exe_show_hide_lock(e, name, mod) {
  if (target_state[name] === 'hide') {
    //hide => show
    mod.set_attr('display', 'block');
    e.target.style.color = colors['show'];
    target_state[name] = 'show';
  } else if (target_state[name] === 'show') {
    //show => lock
    mod.lock(true);
    e.target.style.color = colors['lock'];
    target_state[name] = 'lock';
  } else {
    mod.lock(false);
    e.target.style.color = colors['hide'];
    target_state[name] = 'hide';
    mod.set_attr('display', 'none');
  }
}

function exe_backward() {
  m.set_active_document(previous());
  browse_history.pop();
}

function exe_forward() {
  m.set_active_document(next());
  browse_history.pop();
}

async function exe_backup() {
  let d = m.get_all_notes();
  if (await tm.write(d) !== '') {
    dialog.alert('A new snapshot was added to the time machine!');
  } else {
    dialog.alert('Data not changed.');
  }
}

async function exe_restore() {
  let yes = await dialog.confirm('Make sure backup first. Changes without backup will be lost!', 'Continue', 'Abort');
  if (!yes) return;
  let d = await tm.versions();
  if (d.length > 0) {
    let s = await dialog.select(d);
    if (s.isConfirmed && s.value !== '') {
      //restore s
      let n = await tm.read(s.value);
      m.set_all_notes(n);
      dialog.alert(s.value + ' restored');
    }
  }
  //console.log(d);
}

async function exe_share() {
  await Swal.fire(
    'Copy below URL to share',
    window.location.href.replace(/#.*/, '#diag=' +  m.get_b64()),
    'info'
  );
}

function add_tools() {
  //exe active node
  //add button
  //remove button
  add_button('__SYSTEM_HOME', 'Notes', exe_notes, false);  //false means not a user button.
  add_button('__SYSTEM_EXPLORER', 'Explorer', function (e) { exe_show_hide(e, 'explorer', explorer); }, false);  //false means not a user button.
  add_button('__SYSTEM_EDITOR', 'Editor', function (e) { exe_show_hide(e, 'editor',  editor); }, false);  //false means not a user button.
  add_button('__SYSTEM_BACKUP', 'Backup', exe_backup, 'button-dark');  //false means not a user button.
  add_button('__SYSTEM_RESTORE', 'Restore', exe_restore, 'button-dark');  //false means not a user button.
  add_button('__SYSTEM_SHARE', 'Share', exe_share, 'button-system');  //false means not a user button.
  add_button('__SYSTEM_BACKWARD', '<-', exe_backward, 'button-user');  //false means not a user button.
  add_button('__SYSTEM_INDEX', 'Index', exe_index, 'button-user');  //false means not a user button.
  add_button('__SYSTEM_FORWARD', '->', exe_forward, 'button-user');  //false means not a user button.
  add_button('__SYSTEM_CANVAS', 'Canvas', function (e) { exe_show_hide_lock(e, 'canvas',  canvas); }, false);  //false means not a user button.
  add_button('__SYSTEM_OUTLINE', 'Outline', function (e) { exe_show_hide_lock(e, 'outline',  outline); }, false);  //false means not a user button.

  //add_button('__SYSTEM_EXE', 'Execute', exe_cb, false);  //false means not a user button.
  //add_button('__SYSTEM_ADD', 'Add Button', add_cb, true);
  //add_button('__SYSTEM_REMOVE', 'Remove Button', rm_cb, true);
}

function config() {
  //add buttons based on document 'diagram.config'
  let conf = m.get_config('buttons') || [];
  for (let b of conf) {
    add_button(b, b, btn_listener, 'button-dark');
  }
}



var menu;
var cmen = [
  {
    text: 'Add Current Node to Bookmark',
    events: {
      click: function () {
        //var target = e.target;
        //cleanup();
        add_cb();
      }
    }
  },
  {
    text: 'Remove from Bookmark',
    events: {
      click: function () {
        //var target = e.target;
        //cleanup();
        rm_cb();
      }
    }
  },
  /*{
    text: 'Clean Empty Menu Item',
    events: {
      click: function () {
        //var target = e.target;
        cleanup();
      }
    }
  },*/
  {
    text: 'Run Current Node',
    events: {
      click: function () {
        //var target = e.target;
        exe_cb();
      }
    }
  }
];

//exe_cb

menu = new cmenu.ContextMenu(cmen);

function init(container) {
  container_ele = document.getElementById(container);
  notes_name_ele = document.getElementById('notes_name');
  doc_name_ele = document.getElementById('doc_name');
  doc_name_ele.onclick = async function () {
    let n = await dialog.readline('Please input file name to open', 'file name', true);
    if (n) {
      m.set_active_document(n.value);
    }
  };

  //init internal data
  target_state = Object.assign({}, target_state_init);
  clear_all_cb();
  widgets = new Set();
  canvas.lock(false);
  outline.lock(false);
  explorer.set_attr('display', 'block');
  editor.set_attr('display', 'block');
  outline.set_attr('display', 'block');

  //add function buttons
  add_tools();
  container_ele.addEventListener('contextmenu', function (e) {
    menu.display(e);
  });
  tm.init();
  return container_ele;
}

/*
'ACTIVE-DOCUMENT'
‘OPEN-NOTES’
*/

m.on('ACTIVE-DOCUMENT', () => {
  if (doc_name_ele) doc_name_ele.innerHTML = m.get_active_document();
  add_to_list(m.get_active_document());
});

m.on('OPEN-NOTES', () => {
  init('toolbar');
  config();
  notes_name_ele.innerHTML = m.get_notes_name();
  //change hash
  window.location.hash = m.get_notes_name();
  reset_history();
});

m.on('STORAGE_UPDATE', () => {
  if (notes_name_ele) notes_name_ele.href = '#diag=' +  m.get_b64();
});

exports.init = init;
exports.config = config;
exports.cleanup = cleanup;
