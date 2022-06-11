'use strict';

var codemirror = require('codemirror');
var m = require('../model/model');
var node = require('./node');

require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

var permalink    = document.getElementById('permalink');
var dropdown     = document.getElementById('dropdown');
var default_text = document.getElementById('source').value || '';

var diag_name = '#default_diagram';
var frontpage = 'index';

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
for (var i = 1; i <= 500; i++) {
  rows.push({
    values: [ i, i * 100 / 500 + '%' ],
    markup: '<tr>' +
              '<td>' + i + '</td>' +
              '<td>' + (i * 100 / 500 + '%') + '</td>' +
            '</tr>',
    active: true
  });
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
  console.log(target.innerText);
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

var editor = document.getElementById('editor');

editor.addEventListener('change', e => {
  if  (e.target.checked) {
    src.style.display = 'block';
    left_pannel.style.display = 'flex';
  } else {
    if (explorer_container.style.display === 'none') {
      left_pannel.style.display = 'none';
    }
    src.style.display = 'none';
    explorer_container.style.width = '100%';
    dst.style.width = '100%';
  }
});

var source = codemirror.fromTextArea(document.getElementById('source'), {
  mode: 'markdown',
  lineNumbers: true
});

function update_dropdown() {
  dropdown.onchange = function () {
  };

  while (dropdown.options.length > 0) {
    dropdown.remove(0);
  }

  var names = m.get_all_names();
  for (const el of names) {
    var opt = document.createElement('option');
    dropdown.appendChild(opt);
    opt.text = el;
    opt.value = el;
  }
  dropdown.value = m.get_active_document();

  dropdown.onchange = function () {
    var n = dropdown.value;
    source.setValue(m.get_document_content(n));
    m.set_active_document(n);
  };
}


function update_permlink() {
  var data =  m.build_permlink();
  permalink.href = '#diag=' + data;
  window.localStorage.setItem(diag_name, data);
}


function update_view() {
  update_permlink();
  if (window.j) {
    window.j.reset();
    node.add_node(m, m.get_active_document());
  }
}


function document_changed() {
  var str, name;
  str = source.getValue();
  name = m.get_active_document();
  m.update_document(name, str);

  if (m.get_subnode_names(name).length !== 0) {
    update_dropdown(); //only if current active doc has subnodes
  }
  dropdown.value = name;
  update_view();
}


var timer;

source.on('change', function () {
  clearTimeout(timer);
  timer = setTimeout(document_changed, 500);
});

function open_local_file(name) {
  let d = window.localStorage.getItem(name);
  if (d) {
    m.init_from_permlink(d);
  } else {
    //diag_name = 'diagram';  //use default diag_name, it's already initialized.
    m.update_document(frontpage, default_text);
  }
}

function open_document() {
  if (location.hash && location.hash.toString().slice(0, 6) === '#diag=') {
    //if there is data, try to load data first.
    if (!m.init_from_permlink(location.hash.slice(6))) {
      //load data failed, try to open local Storage with default key
      diag_name = location.hash.toString().slice(0, 40);
      open_local_file(diag_name);
    }
    //use default key for local storage
    window.location.hash = diag_name;
  } else {
    //diag_name += '.';
    diag_name = location.hash.toString().slice(0, 40);
    if (diag_name === '') {
      diag_name = '#default_diagram';
    }
    open_local_file(diag_name);
    window.location.hash = diag_name;
  }
  m.set_active_document(frontpage);
  source.setValue(m.get_document_content(frontpage));
  update_view();
  update_dropdown();
}

m.on('ACTIVE-DOCUMENT', ({ active }) => {
  //update dropdown & src
  source.setValue(m.get_document_content(active));
  dropdown.value = active;
});

exports.open_document = open_document;
