'use strict';

var m = require('../model/model');
var cmenu = require('./contextmenu');


var rows = [];
var search = document.getElementById('search');
var ele = document.getElementById('explorer_container');
var dialog = require('./dialog');
let fe = require('./filexchange');
let tm = require('../model/timemachine');

/* Fill array with data
 * Fields:
 * values *array* - value of each field (in case use of table)
 * markup *string* - markup that will be added to the DOM
 * active *bool* - specifies if row is suitable by search phrase
*/

//get all the node names and notes

let notes_mode = false;

function build_data() {
  rows = [];
  var names = m.get_all_names();
  if (notes_mode) {
    names = m.get_all_notes_name();
  } else {
    names = m.get_all_names();
  }
  for (let k of Object.keys(names)) {
    rows.push({
      values: [ k, names[k] ],
      markup: '<tr>' +
                          '<td>' + k + '</td>' +
                          '<td>' + names[k] + '</td>' +
                        '</tr>',
      active: true
    });
  }
}


/*
  * Fetch suitable rows
  */
function func_filterRows(rows) {
  var results = [];
  for (var i = 0, ii = rows.length; i < ii; i++) {
    if (rows[i].active) results.push(rows[i].markup);
  }
  return results;
}

var filterRows = func_filterRows;
/*
  * Init clusterize.js
  */
var clusterize = new Clusterize({
  rows: filterRows(rows),
  scrollId: 'scrollArea',
  contentId: 'contentArea'
});

/*
  * Multi-column search
  */
function func_onSearch() {
  for (var i = 0, ii = rows.length; i < ii; i++) {
    var suitable = false;
    for (var j = 0, jj = rows[i].values.length; j < jj; j++) {
      if (rows[i].values[j].toString().indexOf(search.value) + 1) { suitable = true; }
    }
    rows[i].active = suitable;
  }
  clusterize.update(filterRows(rows));
}

var onSearch = func_onSearch;

var eletb = document.getElementById('contentArea');

eletb.onclick = async function (e) {
  var target = e.target;
  if (target.nodeName !== 'TD') return;
  let target_doc = target.parentElement.firstElementChild.innerText;
  if (notes_mode) {
    notes_mode = false;
    m.reset(target_doc);
  } else {
    m.set_active_document(target_doc);
  }
};

//ondblclick

var name = '';
eletb.oncontextmenu = function (e) {
  var target = e.target;
  if (target.nodeName !== 'TD') return;
  name = target.parentElement.firstElementChild.innerText;
  //console.log(target.parentElement.firstElementChild.innerText);
};

search.oninput = onSearch;


function show_notes() {
  notes_mode = true;
  build_data();
  func_onSearch();
}

function set_attr(name, val) {
  ele.style[name] = val;
}

var menu;
var cmen = [
  {
    text: 'New',
    events: {
      click: async function () {
        let n = await dialog.readline('Please input name', 'file name', true);
        if (n) {
          if (notes_mode) {
            m.new_notes(n.value);
          } else {
            m.update_document(n.value, '');
          }
        }
      }
    }
  },
  {
    text: 'Delete',
    events: {
      click: async function () {
        if (notes_mode) {
          let del = await dialog.confirm('Delete Notes Pacakge: ' + name, 'Yes,delete', 'No, Keep it');
          if (del) {
            m.delete_notes(name);
          }
        } else {
          m.delete_document(name);
        }
      }
    }
  },
  {
    text: 'Rename',
    events: {
      click: async function () {
        let n = await dialog.readline('Rename ' + name + ' to:', 'target file name', true);
        if (n) {
          let new_name = n.value;
          if (new_name === '') return;
          if (notes_mode) {
            m.rename_notes(name, new_name);
          } else {
            m.rename_document(name, new_name);
          }
        }
      }
    }
  },
  {
    text: 'Duplicate',
    events: {
      click: async function () {
        let n = await dialog.readline('Duplicate ' + name + ' to:', 'target file name', true);
        if (n) {
          let new_name = n.value;
          if (new_name === '') return;
          if (notes_mode) {
            m.duplicate_notes(name, new_name);
          } else {
            let c = m.get_document_content(name);
            m.update_document(new_name, c);
          }
        }
      }
    }
  },
  {
    type: cmenu.ContextMenu.DIVIDER
  },
  {
    text: 'Export Snapshot (in yaml format)',
    events: {
      click: function () {
        let d = m.get_all_notes_obj();
        fe.export_yaml('markgraph', d);
      }
    }
  },
  {
    text: 'Import a Snapshot file',
    events: {
      click: async function () {
        let d = await fe.import_yaml();
        if (d) {
          if (await tm.write(d) !== '') {
            dialog.alert('A new snapshot was added to the time machine!');
          } else {
            dialog.alert('Data not changed.');
          }
        } else {
          dialog.alert('Wrong data format?');
        }
      }
    }
  }
  /*,
  {
    text: 'Import Notes',
    events: {
      click: function (e) {
        var target = e.target;
        if (target.nodeName !== 'TD') return;
        console.log(target.parentElement.firstElementChild.innerText);
      }
    }
  },
  {
    text: 'Export Notes',
    events: {
      click: function (e) {
        var target = e.target;
        if (target.nodeName !== 'TD') return;
        console.log(target.parentElement.firstElementChild.innerText);
      }
    }
  }
  */
];

menu = new cmenu.ContextMenu(cmen);

eletb.addEventListener('contextmenu', function (e) {
  menu.display(e);
});

eletb.addEventListener('dblclick', function (e) {
  menu.display(e);
});

m.on('DOCUMENT-UPDATE', () => {
  build_data();
  func_onSearch();
});

m.on('DOCUMENT-DELETE', () => {
  build_data();
  func_onSearch();
});

m.on('DOCUMENT-RENAME', () => {
  build_data();
  func_onSearch();
});

m.on('OPEN-NOTES', () => {
  build_data();
  func_onSearch();
});


exports.set_attr = set_attr;
exports.show_notes = show_notes;
