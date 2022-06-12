'use strict';

var m = require('../model/model');
var codemirror = require('codemirror');
require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

var source = codemirror.fromTextArea(document.getElementById('source'), {
  mode: 'markdown',
  lineNumbers: true
});

var ele = document.getElementById('src');

function document_changed() {
  var str, name;
  str = source.getValue();
  name = m.get_active_document();
  m.update_document(name, str);
}

var timer;

source.on('change', function () {
  clearTimeout(timer);
  timer = setTimeout(document_changed, 500);
});

m.on('ACTIVE-DOCUMENT', ({ active }) => {
  source.setValue(m.get_document_content(active));
});

function set_attr(name, val) {
  ele.style[name] = val;
}

exports.set_attr = set_attr;
