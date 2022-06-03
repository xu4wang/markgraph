'use strict';

/* eslint-env browser */

var jsyaml     = require('js-yaml');
var codemirror = require('codemirror');
var base64     = require('./base64');
var nodes      = require('./node.js');
var edges      = require('./edges.js');

//var inspect    = require('util').inspect;


require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/javascript/javascript.js');


var source, result = {}, permalink, default_text;

var SexyYamlType = new jsyaml.Type('!sexy', {
  kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
  construct: function (data) {
    return data.map(function (string) { return 'sexy ' + string; });
  }
});

var SEXY_SCHEMA = jsyaml.DEFAULT_SCHEMA.extend([ SexyYamlType ]);


function clear_canvas() {
  window.j.reset();  //remove all connections, endpoints.
  //remove all DOMs created by nodes.
  nodes.clear_nodes();
  edges.clear_edges();
}

function draw_nodes(obj) {
  nodes.add_nodes(obj);
}

//eslint-disable-next-line
function draw_edges(obj) {
  edges.add_edges(obj);
}

function draw(obj) {
  //update canvas
  clear_canvas();
  draw_nodes(obj);
  draw_edges(obj);
}

function parse() {
  var str, obj;

  str = source.getValue();
  permalink.href = '#yaml=' + base64.encode(str);
  result['error'] = false;
  result['json'] = {};

  try {
    obj = jsyaml.load(str, { schema: SEXY_SCHEMA });
    result.error = false;
    result.json = obj;
    window.diagram_attrs = result;  //store the JSON configuration object in window.diagram_attrs.
    draw(obj);
  } catch (err) {
    result.error = true;
    result.json = err.message || String(err);
  }
}

function updateSource() {
  var yaml;

  if (location.hash && location.hash.toString().slice(0, 6) === '#yaml=') {
    yaml = base64.decode(location.hash.slice(6));
  }

  source.setValue(yaml || default_text);
  parse();
}

window.onload = function () {

  var resize = document.getElementById('resize');
  var left = document.getElementById('src');
  var right = document.getElementById('dst');
  var container = document.getElementById('content');
  resize.onmousedown = function (e) {
    // 记录鼠标按下时的x轴坐标
    var preX = e.clientX;
    resize.left = resize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = resize.left + deltaX;
      // 左边区域的最小宽度限制为64px
      if (leftWidth < 64) leftWidth = 64;
      // 右边区域最小宽度限制为64px
      if (leftWidth > container.clientWidth - 64) leftWidth = container.clientWidth  - 64;
      // 设置左边区域的宽度
      left.style.width = leftWidth + 'px';
      // 设备分栏竖条的left位置
      resize.style.left = leftWidth;
      // 设置右边区域的宽度
      right.style.width = (container.clientWidth - leftWidth - 4) + 'px';
    };
    //eslint-disable-next-line
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  permalink    = document.getElementById('permalink');
  default_text = document.getElementById('source').value || '';

  source = codemirror.fromTextArea(document.getElementById('source'), {
    mode: 'yaml',
    lineNumbers: true
  });

  var timer;

  source.on('change', function () {
    clearTimeout(timer);
    timer = setTimeout(parse, 500);
  });

  // initial source
  updateSource();
  //it will be updated automatically. by the timer.
  var canvas = document.getElementById('canvas');
  //console.log(canvas);

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
  });
};
