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

exports.alert = alert;
exports.readline = readline;

