'use strict';

//const { Swal } = require("../../../library/sweetalert2.all.min");

function alert(msg) {
  Swal.fire(msg);
}

/*
const { value: text } = await Swal.fire({
  input: 'textarea',
  inputLabel: 'Message',
  inputPlaceholder: 'Type your message here...',
  inputAttributes: {
    'aria-label': 'Type your message here'
  },
  showCancelButton: true
})

if (text) {
  Swal.fire(text)
}
*/
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
const { value: fruit } = await Swal.fire({
  title: 'Select field validation',
  input: 'select',
  inputOptions: {
    'Fruits': {
      apples: 'Apples',
      bananas: 'Bananas',
      grapes: 'Grapes',
      oranges: 'Oranges'
    },
    'Vegetables': {
      potato: 'Potato',
      broccoli: 'Broccoli',
      carrot: 'Carrot'
    },
    'icecream': 'Ice cream'
  },
  inputPlaceholder: 'Select a fruit',
  showCancelButton: true,
  inputValidator: (value) => {
    return new Promise((resolve) => {
      if (value === 'oranges') {
        resolve()
      } else {
        resolve('You need to select oranges :)')
      }
    })
  }
})

if (fruit) {
  Swal.fire(`You selected: ${fruit}`)
}
*/

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
exports.confirm = confirm;
exports.select = select;

