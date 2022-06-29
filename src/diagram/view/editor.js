'use strict';

var m = require('../model/model');
var codemirror = require('codemirror');
require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/markdown/markdown.js');

/*
<link  href="../addon/fold/foldgutter.css" rel="stylesheet" />
<script src="../addon/fold/foldcode.js"></script>
<script src="../addon/fold/foldgutter.js"></script>
<script src="../addon/fold/indent-fold.js"></script>
*/
//require('codemirror/addon/fold/foldgutter.css');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/indent-fold.js');


var source = codemirror.fromTextArea(document.getElementById('source'), {
  mode: 'markdown',
  lineNumbers: true,
  foldGutter: true,
  gutters: [ 'CodeMirror-linenumbers', 'CodeMirror-foldgutter' ]
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


/*
m.on('DOCUMENT-UPDATE', ({ active, impacted }) => {
  if (active === impacted) {
    source.setValue(m.get_document_content(active));
  }
});
*/

function set_attr(name, val) {
  ele.style[name] = val;
}

exports.set_attr = set_attr;
