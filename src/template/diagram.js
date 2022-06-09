'use strict';

//const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
/* eslint-env browser */
var codemirror = require('codemirror');
var m = require('./model');
var node = require('./node');
var edge = require('./edges');

require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

var source, permalink, default_text, dropdown, diag_name = 'diagram';

//retrieve the top/left parameters of each node, rebuild yaml
function node_moved() {
  //update model
  var nodes = m.get_node_names();
  for (let n of nodes) {
    let e = document.getElementById(n);
    m.update_node_attr(n, 'left', e.style.left);
    m.update_node_attr(n, 'top', e.style.top);
  }
  m.json_update_yaml();
  if (m.get_active_document() === 'diagram') {
    source.setValue(m.get_document_content('diagram'));
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
  var opt = document.createElement('option');
  dropdown.appendChild(opt);
  opt.text = 'diagram';
  opt.value = 'diagram';
  var names = m.get_node_names();
  for (const el of names) {
    opt = document.createElement('option');
    dropdown.appendChild(opt);
    opt.text = el;
    opt.value = el;
  }
  dropdown.value = m.get_active_document;


  dropdown.onchange = function () {
    var n = dropdown.value;
    if (n === 'diagram') {
      source.setOption('mode', 'yaml');
    } else {
      source.setOption('mode', 'markdown');
    }
    source.setValue(m.get_document_content(n));
    m.set_active_document(n);
  };
}

function node_selected(p) {
  //console.log(p);
  m.set_active_document(p.id);
  //update_dropdown();
  dropdown.value = p.id;
  source.setOption('mode', 'markdown');
  source.setValue(m.get_document_content(p.id));
}

function update_view() {
  update_permlink();
  //update_dropdown();
  if (window.j) {
    window.j.reset();
    node.add_nodes(m);
    edge.add_edges(m.get_edges());
  }
}

function document_changed() {
  var str, name;
  str = source.getValue();
  name = m.get_active_document();
  if (name === 'diagram') {
    m.update_document(name, 'yaml', str);
    update_dropdown();
    dropdown.value = 'diagram';
  } else {
    m.update_document(name, 'markdown', str);
  }
  update_view();
  //update_permlink();
}

function open_document() {
  if (location.hash && location.hash.toString().slice(0, 6) === '#diag=') {
    m.init_from_permlink(location.hash.slice(6));
  } else {
    diag_name += location.hash;
    let d = window.localStorage.getItem(diag_name);
    if (d) {
      m.init_from_permlink(d);
    } else {
      m.update_document('diagram', 'yaml', default_text);
    }
  }
  m.set_active_document('diagram');
  source.setValue(m.get_document_content('diagram'));
  update_view();
  update_dropdown();
}

window.onload = function () {
  var resize = document.getElementById('resize');
  var left = document.getElementById('src');
  var right = document.getElementById('dst');
  var container = document.getElementById('content');
  resize.onmousedown = function (e) {
    var preX = e.clientX;
    resize.left = resize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = resize.left + deltaX;
      if (leftWidth < 64) leftWidth = 64;
      if (leftWidth > container.clientWidth - 64) leftWidth = container.clientWidth  - 64;
      left.style.width = leftWidth + 'px';
      resize.style.left = leftWidth;
      right.style.width = (container.clientWidth - leftWidth - 4) + 'px';
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
    mode: 'yaml',
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
    //update yaml in case the position changed.
    //eslint-disable-next-line
    window.j.bind(jsPlumbBrowserUI.EVENT_DRAG_STOP, (p) => { 
      node_moved();
    });

    window.j.bind(jsPlumbBrowserUI.EVENT_ELEMENT_DBL_CLICK, (p) => {
      node_selected(p);
    });
  });
};
