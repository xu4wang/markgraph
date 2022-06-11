'use strict';

var m = require('../model/model');
require('./explorer');
require('./editor');

var permalink    = document.getElementById('permalink');
var default_text = document.getElementById('source').value || '';

var diag_name = '#default_diagram';
var frontpage = 'index';

function update_permlink() {
  var data =  m.build_permlink();
  permalink.href = '#diag=' + data;
  window.localStorage.setItem(diag_name, data);
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
}

m.on('DOCUMENT-UPDATE', () => {
  update_permlink();
});

exports.open_document = open_document;
