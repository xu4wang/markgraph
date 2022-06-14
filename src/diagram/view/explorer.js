'use strict';

var m = require('../model/model');
var cmenu = require('./contextmenu');


var rows = [];
var search = document.getElementById('search');
var ele = document.getElementById('explorer_container');
var dialog = require('./dialog');


/* Fill array with data
 * Fields:
 * values *array* - value of each field (in case use of table)
 * markup *string* - markup that will be added to the DOM
 * active *bool* - specifies if row is suitable by search phrase
*/

//get all the node names and notes

function build_data() {
  rows = [];
  var names = m.get_all_names();
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
  m.set_active_document(target_doc);

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
          m.update_document(n.value, '');
        }
      }
    }
  },
  {
    text: 'Delete',
    events: {
      click: async function () {
        //var target = e.target;
        //if (target.nodeName !== 'TD') return;
        //let name = target.parentElement.firstElementChild.innerText;
        //check if there is a notes with this name, if yes, check if we need to process notes deletion.
        if (localStorage.getItem(name) !== null) {
          let del = await dialog.confirm('Delete Notes Pacakge: ' + name, 'Yes,delete', 'No, Keep it');
          if (del) {
            m.delete_document(name);
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
          m.rename_document(name, new_name);
        }
      }
    }
  },
  {
    type: cmenu.ContextMenu.DIVIDER
  },
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
];

menu = new cmenu.ContextMenu(cmen);

eletb.addEventListener('contextmenu', function (e) {
  menu.display(e);
});

m.on('DOCUMENT-UPDATE', () => {
  build_data();
  clusterize.update(filterRows(rows));
});

m.on('DOCUMENT-DELETE', () => {
  build_data();
  clusterize.update(filterRows(rows));
});

m.on('DOCUMENT-RENAME', () => {
  build_data();
  clusterize.update(filterRows(rows));
});

m.on('OPEN-NOTES', () => {
  build_data();
  clusterize.update(filterRows(rows));
});

m.on('RESET', () => {
  build_data();
  clusterize.update([]);
});

exports.set_attr = set_attr;
