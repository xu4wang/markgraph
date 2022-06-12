'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const { JSDOM } = require('jsdom');
const { toNamespacedPath } = require('path');

const jsDomIntance = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <p id="root">hello</p>
    <p class="subheader" name="container" id="container"> </p>
  </body>
`)

jest.mock('../src/diagram/view/canvas', () => ({
    set_attr: (k, v) => ""
}));
jest.mock('../src/diagram/view/editor', () => ({
    set_attr: (k, v) => ""
}));
jest.mock('../src/diagram/view/explorer', () => ({
    set_attr: (k, v) => ""
}));


global.window = jsDomIntance.window; // window 
global.document = window.document; // document 

document.body.innerHTML = `    <p id="root">hello</p>
<p class="subheader" name="container" id="container"> </p>`;

var t = require('../src/diagram/view/toolbar.js');
var m = require('../src/diagram/model/model.js');
var l = require('../src/diagram/view/log.js');

it('add button', () => {
    //create a theme object
    t.init('container');
    let dat =`---
widget: 
    type: button
    label: Hide Explorer 
commands:
    - name: theme
      argv:
        explorer:
          width: 9%
---`
    var r = m.update_document('hello1',dat);
    var hello = document.getElementById('hello1');
    expect(hello.className).toBe('button-32');
    hello.click();
    expect(l.read()).toContain('9%');
});

it('remove button', () => {
    //create a theme object
    t.init('container');
    let dat =`---
name: not_hello
widget: 
    type: checkbox
    label: Show Log 
commands:
    - name: show_log
      argv:
---
checkbox_value will be added to argv by toolbar logic.`
    var r = m.update_document('hello',dat);
    //an element hello should be added?
    var hello = document.getElementById('not_hello');
    expect(hello.className).toBe('button-32');
    hello = document.getElementById('hello');
    expect(hello).toBe(null);
});
