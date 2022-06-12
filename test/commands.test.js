'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

let log = require('../src/diagram/view/log');

/*
jest.mock('./time', () => ({
    __esModule: true,
    default: () => 'Thursday'
    getTime: () => '1:11PM',
}));
*/
jest.mock('../src/diagram/view/canvas', () => ({
    set_attr: (k, v) => ""
}));
jest.mock('../src/diagram/view/editor', () => ({
    set_attr: (k, v) => ""
}));
jest.mock('../src/diagram/view/explorer', () => ({
    set_attr: (k, v) => ""
}));

var c = require('../src/diagram/view/commands.js');
var m = require('../src/diagram/model/model.js');


const { JSDOM } = require('jsdom');
const { toNamespacedPath } = require('path');

const jsDomIntance = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <p id="root">hello</p>
  </body>
`)

const window = jsDomIntance.window; // window 
const document = window.document; // document 

it('theme can be applied', () => {
    //create a theme object
    let dat =`---
commands:
    - name: theme
      argv:
        explorer:
          width: 2%
          height: 50%
        editor:
          width: 30%
---`
    m.update_document('hello',dat);
    expect(m.get_common_attr('hello','commands')[0].name).toBe('theme');
    let r = c.run(m.get_common_attr('hello','commands')[0].name, m.get_common_attr('hello','commands')[0].argv);
    expect(r).toBe(true);
    console.log(log.read());
    log.clear();
});

it('show log', () => {
  //create a theme object
  let dat =`---
commands:
  - name: show_log
    argv:
      key: 1
---`
  m.update_document('hello',dat);
  expect(m.get_common_attr('hello','commands')[0].name).toBe('show_log');
  let r = c.run(m.get_common_attr('hello','commands')[0].name, m.get_common_attr('hello','commands')[0].argv);
  expect(r).toBe(false);
  dat =`---
commands:
  - name: show_log
    argv:
      checkbox_value: true
---`
  m.update_document('hello',dat);
  expect(m.get_common_attr('hello','commands')[0].name).toBe('show_log');
  r = c.run(m.get_common_attr('hello','commands')[0].name, m.get_common_attr('hello','commands')[0].argv);
  expect(r).toBe(true);
});
