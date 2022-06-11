'use strict';

var m = require('../model/model');
var codemirror = require('codemirror');
require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

var editor_chkbox = document.getElementById('editor');

var left_pannel = document.getElementById('left');
var explorer_container = document.getElementById('explorer_container');
var src =  document.getElementById('src');
var dst =  document.getElementById('dst');

editor_chkbox.addEventListener('change', e => {
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
