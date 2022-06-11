'use strict';

var m = require('../model/model');


var rows = [];
var search = document.getElementById('search');

var left_pannel = document.getElementById('left');
var explorer_container = document.getElementById('explorer_container');
var src =  document.getElementById('src');
var dst =  document.getElementById('dst');


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

document.getElementById('contentArea').onclick = function (e) {
  var target = e.target;
  if (target.nodeName !== 'TD') return;
  m.set_active_document(target.parentElement.firstElementChild.innerText);
};

search.oninput = onSearch;

var node_explorer = document.getElementById('explorer');

node_explorer.addEventListener('change', e => {
  if  (e.target.checked) {
    explorer_container.style.display = 'block';
    left_pannel.style.display = 'flex';
  } else {
    if (src.style.display === 'none') {
      left_pannel.style.display = 'none';
    }
    explorer_container.style.display = 'none';
    src.style.width = '100%';
    dst.style.width = '100%';
  }
});

m.on('DOCUMENT-UPDATE', () => {
  build_data();
  clusterize.update(filterRows(rows));
});
