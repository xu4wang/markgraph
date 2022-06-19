'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

//var m = require('../src/diagram/model/model.js');
var PouchDB = require('PouchDB');

const { JSDOM } = require('jsdom');
const { toNamespacedPath } = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { default: JSDOMEnvironment } = require('jest-environment-jsdom');

const jsDomIntance = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <p id="root">hello</p>
  </body>
`);

const window = jsDomIntance.window; // window 
const document = window.document; // document 

jest.setTimeout(2000);

async function get_doc(pouch, k) {
    let doc;
    try {
        doc = await pouch.get(k);
    } catch (err) {
      if (err.name === 'not_found') {
        doc = {};
      } else {
        console.log(err); // err; // some error other than 404
      }
    }
    return doc;
  }
  
async function add_version(pouch, k, v) {
    let current = await get_doc(pouch, k);
    var val;
    if (current._rev) {
        val = Object.assign({}, { _id: k, _rev:current._rev }, v);
    } else {
        val = Object.assign({}, { _id: k }, v);
    }
    let r = await pouch.put(val);
    return r.rev;
}

it('document post and get ', async () => {
    let db = await new PouchDB('mydb');
    let r = await add_version(db, 'hello', {key: 'world'});
    let doc = await get_doc(db, 'hello');
    expect(doc.key).toBe('world');
    await db.close();
});

it('nested 2 level  ', async () => {
    let db = await new PouchDB('mydb');
    let r = await add_version(db, 'hello', {l1: {l2: "value l2"}});
    let doc = await get_doc(db, 'hello');
    expect(doc.l1.l2).toBe('value l2');
    await db.close();
});

it('nested 3 level ', async () => {
    let db = await new PouchDB('mydb');
    let r = await add_version(db, 'hello', {l1: {l2: {l3:"value l3"}}});
    let doc = await get_doc(db, 'hello');
    expect(doc.l1.l2.l3).toBe('value l3');
    await db.close();
});

it('nested 4 level ', async () => {
    let db = await new PouchDB('mydb');
    let r = await add_version(db, 'hello', {l1: {l2: {l31:"value l31", l32: {l4: "value l4"}}}});
    let doc = await get_doc(db, 'hello');
    expect(doc.l1.l2.l31).toBe('value l31');
    expect(doc.l1.l2.l32.l4).toBe('value l4');
    await db.close();
});

/*
active________:    //for UNKNOWN reason, pouchdb cannot store/read nested objects?
                   //as a workaround, put active_____ same level with all the doc versions.
                   //ideally, should use a versions object to hold all the document's version.
  docname1: latest version
  docname2: latest version
  ...
docname1:
  time1: ver1:
  time2: ver2:
    ...
document2:
  time1: ver1:
    ...
*/

it('nested real case ', async () => {
    let data = {
        active: {
                   name1: 'kkkk',
                   name2: 'eeee'
                 },
        versions:{ 
                    name1: { time1: '1111', time2:'2222'},
                    name2: { time3: '3333', time4:'4444'}
                  }
        }
                 
    let db = await new PouchDB('mydb');
    let r = await add_version(db, 'hello', data);
    let doc = await get_doc(db, 'hello');
    expect(doc.active.name1).toBe('kkkk');
    expect(doc.versions.name1.time1).toBe('1111');
    expect(doc.versions.name2.time4).toBe('4444');
    await db.close();
});
