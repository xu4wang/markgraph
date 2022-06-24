'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

//var m = require('../src/diagram/model/model.js');
var tm = require('../src/diagram/model/timemachine.js');

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
    await tm.init();
});


it('tm add version ', async () => {
    var doc = {
        f1: "hello world",
        f2: "bybye"
      }

    let r0 = await tm.read();

    if (JSON.stringify(r0) === JSON.stringify(doc)) {
        let version1 = await tm.versions();
        let r1 = await tm.write(doc);
        let version2 =  await tm.versions();
        expect(r1).toBe('');
        expect(version1.length).toBe(version2.length);
        doc.f2 = Math.random();
    } 

    let version1 = await tm.versions();
    let r1 = await tm.write(doc);
    expect(r1 === '').toBe(false);

    let version2 = await tm.versions();
    expect(version2.length == version1.length + 1).toBe(true);

    let r3 = await tm.read();
    expect(JSON.stringify(r3) === JSON.stringify(doc)).toBe(true);

    let r4 = await tm.read(version2[version2.length-2])
    expect(JSON.stringify(r4) === JSON.stringify(r0)).toBe(true);
    let r5 = await tm.read(version2[version2.length-1])
    expect(JSON.stringify(r3) === JSON.stringify(r5)).toBe(true);
});

it('tm compress', async () => {
    var doc = {
        f1: "hello world",
        f2: Math.random()
      }

    let r0 = await tm.read();

    let version1 = await tm.versions();
    let r1 = await tm.write(doc);
    expect(r1 === '').toBe(false);
    let version2 = await tm.versions();
    expect(version2.length === version1.length + 1).toBe(true);
    await tm.compact();
    let version3 = await tm.versions();
    expect(version3.length).toBe(1);
});

afterAll(async () => {
    await tm.close();
});
  
