'use strict';

var m = require('../model/model');
require('./explorer');
require('./editor');


function open_document() {
  if (location.hash) {
    if (location.hash.toString().slice(0, 6) === '#diag=') {
      //if there is data, try to load data first.
      m.reset('', location.hash.slice(6));
      window.location.hash = m.get_notes_name();
    } else {
      //hash is notes name
      m.reset(location.hash.toString());
    }
  } else {
    m.reset();
    window.location.hash = m.get_notes_name();
  }
  //m.set_active_document(frontpage);
}

/*
m.on('DOCUMENT-UPDATE', () => {
  update_permlink();
});
*/

exports.open_document = open_document;
