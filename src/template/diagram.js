'use strict';

/* eslint-env browser */

var jsyaml     = require('js-yaml');
var codemirror = require('codemirror');
var base64     = require('./base64');
var inspect    = require('util').inspect;


require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/javascript/javascript.js');


var source, result, permalink, default_text;

var SexyYamlType = new jsyaml.Type('!sexy', {
  kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
  construct: function (data) {
    return data.map(function (string) { return 'sexy ' + string; });
  }
});

var SEXY_SCHEMA = jsyaml.DEFAULT_SCHEMA.extend([ SexyYamlType ]);

function parse() {
  var str, obj;

  str = source.getValue();
  permalink.href = '#yaml=' + base64.encode(str);

  try {
    obj = jsyaml.load(str, { schema: SEXY_SCHEMA });

    result.setOption('mode', 'javascript');
    result.setValue(inspect(obj, false, 10));
  } catch (err) {
    result.setOption('mode', 'text/plain');
    result.setValue(err.message || String(err));
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

  result = codemirror.fromTextArea(document.getElementById('result'), {
    readOnly: true
  });

  // initial source
  updateSource();
};
