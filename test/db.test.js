'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

//var m = require('../src/diagram/model/model.js');
var db = require('../src/diagram/model/db.js');

const { JSDOM } = require('jsdom');
const { toNamespacedPath } = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { default: JSDOMEnvironment } = require('jest-environment-jsdom');
const { ExpireCommodityHeaders } = require('@alicloud/dingtalk/dist/yida_1_0/client');

const jsDomIntance = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <p id="root">hello</p>
  </body>
`);

const window = jsDomIntance.window; // window 
const document = window.document; // document 

jest.setTimeout(200000);

beforeAll(async () => {
    await db.init();
});

it('doc set and get ', async () => {
    let r1 = await db.update_doc('hello',{key1: 1, key2:'kkk'});
    let r2 = await db.read_doc('hello');
    expect(r2.key1).toBe(1);
    expect(r2.key2).toBe('kkk');
    //await db.destroy();
});

it('doc update twice ', async () => {
    let r1 = await db.update_doc('hello',{key1: 1, key2:'kkk'});
    let r2 = await db.update_doc('hello',{key1: 1, key2:'kkk1'});
    let r3 = await db.read_doc('hello');
    expect(r3.key2).toBe('kkk1');
    //await db.destroy();
});

it('doc delete ', async () => {
    let r1 = await db.update_doc('hello',{key1: 1, key2:'kkk'});
    let r2 = await db.update_doc('hello2',{key1: 1, key2:'kkk1'});
    let r3 = await db.read_doc('hello');
    expect(r3.key2).toBe('kkk');
    let r4 = db.list_doc();
    expect(Object.keys(r4)).toContain('hello');
    expect(Object.keys(r4)).toContain('hello2');
    let r5 = db.delete_doc('hello');
    r4 = db.list_doc();
    expect(r4['hello']).toBe('');
    //await db.destroy();
});


it('doc revisions ', async () => {
    let r1 = await db.update_doc('hello',{key1: 1, key2:'rev1'});
    let r2 = await db.update_doc('hello',{key1: 1, key2:'rev2'});
    let r3 = await db.update_doc('hello',{key1: 1, key2:'rev3'});
    let r4 = await db.read_doc('hello');
    expect(r4.key2).toBe('rev3');
    let rev = await db.get_versions('hello');
    r4 = await db.read_doc('hello', rev[rev.length-2] );
    expect(r4.key2).toBe('rev2');
    r4 = await db.read_doc('hello', rev[rev.length-3] );
    expect(r4.key2).toBe('rev1');
    r4 = await db.read_doc('hello', rev[rev.length-1] );
    expect(r4.key2).toBe('rev3');
    //await db.destroy();
});


afterAll(async () => {
    await db.close();
});
  