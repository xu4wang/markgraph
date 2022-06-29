'use strict';

//const { Swal } = require("../../../library/sweetalert2.all.min");

function alert(msg) {
  Swal.fire(msg);
}

async function readline(label, placeholder, showcancel) {
  const text = await Swal.fire({
    input: 'text',
    inputLabel: label,
    inputPlaceholder: placeholder,
    inputAttributes: {
      'aria-label': placeholder
    },
    showCancelButton: showcancel
  });
  return text;
}

async function confirm(label, yes, no) {
  let n = await Swal.fire({
    title: label,
    showDenyButton: true,
    //showCancelButton: true,
    confirmButtonText: yes || 'Yes',
    denyButtonText: no || 'No'
  });
  return (n.isConfirmed);
}

/*
        let n = await dialog.readline('Please input name', 'file name', true);
        if (n) {
            m.new_notes(n.value);
        }
*/

async function readlines(label, placeholder, showcancel) {
  const text = await Swal.fire({
    input: 'textarea',
    inputLabel: label,
    inputPlaceholder: placeholder,
    inputAttributes: {
      'aria-label': placeholder
    },
    showCancelButton: showcancel
  });
  return text;
}

async function select(options) {
  let o = {};
  for (let e of options) {
    o[e] = e;
  }
  var selected = await Swal.fire({
    title: 'Select A version to restore',
    input: 'select',
    inputOptions: o,
    inputPlaceholder: 'Select a version',
    showCancelButton: true
  });
  return selected;
}

exports.alert = alert;
exports.readline = readline;
exports.readlines = readlines;
exports.confirm = confirm;
exports.select = select;

