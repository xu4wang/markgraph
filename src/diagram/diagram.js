'use strict';

//const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
/* eslint-env browser */
var codemirror = require('codemirror');
var m = require('./model/model');
var node = require('./view/node');

require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

var source, permalink, default_text, dropdown, diag_name = '#default_diagram';
var frontpage = 'index';
var rows = [], search = document.getElementById('search');
var left_pannel, explorer_container, src, dst;

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

//retrieve the top/left parameters of each node, rebuild yaml
function node_moved() {
  //update model
  var name = m.get_active_document();
  var nodes = m.get_subnode_names(name);
  if (nodes.length === 0) { //it's the node
    let e = document.getElementById(name);
    m.update_attr(name, 'left', e.style.left);
    m.update_attr(name, 'top', e.style.top);
    source.setValue(m.get_document_content(name));
  } else {
    for (let n of nodes) {
      let e = document.getElementById(n);
      m.update_attr(n, 'left', e.style.left);
      m.update_attr(n, 'top', e.style.top);
    }
  }
}



function update_permlink() {
  var data =  m.build_permlink();
  permalink.href = '#diag=' + data;
  window.localStorage.setItem(diag_name, data);
}

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
  dropdown.value = m.get_active_document;

  dropdown.onchange = function () {
    var n = dropdown.value;
    source.setValue(m.get_document_content(n));
    m.set_active_document(n);
  };
}

/*
checkbox = document.getElementById('conducted');

checkbox.addEventListener('change', e => {

    if(e.target.checked){
        //do something
    }

});
*/

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


function node_selected(p) {
  //console.log(p);
  m.set_active_document(p.id);
  //update_dropdown();
  dropdown.value = p.id;
  source.setValue(m.get_document_content(p.id));
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

window.onload = function () {
  var resize = document.getElementById('resize');
  var left = left_pannel = document.getElementById('left');
  var right = dst = document.getElementById('dst');
  var container = document.getElementById('content');
  src = document.getElementById('src');

  resize.onmousedown = function (e) {
    var preX = e.clientX;
    resize.left = resize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = resize.left + deltaX;
      if (leftWidth < 4) leftWidth = 4;
      if (leftWidth > container.clientWidth - 4) leftWidth = container.clientWidth  - 4;
      left.style.width = leftWidth + 'px';
      src.style.width = '100%'; //a hack to make editor width updated.
      resize.style.left = leftWidth;
      right.style.width = (container.clientWidth - leftWidth - 4) + 'px';
    };
    //eslint-disable-next-line
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  var lresize = document.getElementById('lresize');
  var lleft = explorer_container = document.getElementById('explorer_container');
  var lright = document.getElementById('src');
  var lcontainer = document.getElementById('left');

  lresize.onmousedown = function (e) {
    var preX = e.clientX;
    lresize.left = lresize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = lresize.left + deltaX;
      if (leftWidth < 4) leftWidth = 4;
      if (leftWidth > lcontainer.clientWidth - 4) leftWidth = lcontainer.clientWidth  - 4;
      lleft.style.width = leftWidth + 'px';
      lresize.style.left = leftWidth;
      lright.style.width = (lcontainer.clientWidth - leftWidth - 4) + 'px';
    };
    //eslint-disable-next-line
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  permalink    = document.getElementById('permalink');
  dropdown     = document.getElementById('dropdown');
  default_text = document.getElementById('source').value || '';

  source = codemirror.fromTextArea(document.getElementById('source'), {
    mode: 'markdown',
    lineNumbers: true
  });

  var timer;

  source.on('change', function () {
    clearTimeout(timer);
    timer = setTimeout(document_changed, 500);
  });

  // initial source
  open_document();

  //it will be updated automatically. by the timer.
  var canvas = document.getElementById('canvas');

  jsPlumbBrowserUI.ready(function () {
    window.j = jsPlumbBrowserUI.newInstance({
      dragOptions: { cursor: 'pointer', zIndex: 2000 },
      paintStyle: { stroke: '#666', strokeWidth:2 },
      endpointHoverStyle: { fill: 'orange' },
      hoverPaintStyle: { stroke: 'orange' },
      endpointStyle: { width: 20, height: 16, stroke: '#666' },
      endpoint: 'Rectangle',
      anchors: [ 'TopCenter', 'TopCenter' ],
      container: canvas,
      dropOptions:{ activeClass:'dragActive', hoverClass:'dropHover' }
    });

    window.diagram_model = m;

    //eslint-disable-next-line
    window.j.bind(jsPlumbBrowserUI.EVENT_DRAG_STOP, (p) => { 
      node_moved();
    });

    window.j.bind(jsPlumbBrowserUI.EVENT_ELEMENT_DBL_CLICK, (p) => {
      node_selected(p);
    });
  });
};
