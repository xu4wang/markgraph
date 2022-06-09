'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

var m = require('../src/template/model.js');

const { JSDOM } = require('jsdom');

const jsDomIntance = new JSDOM(`
  <!DOCTYPE html>
  <body>
    <p id="root">hello</p>
  </body>
`)

const window = jsDomIntance.window; // window 
const document = window.document; // document 

it('active document can be saved and read ', () => {
    m.set_active_document('hello');
    expect(m.get_active_document()).toBe('hello');
});

it('document can be saved and read ', () => {
    var dat ='hello data';
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['content']).toBe('hello data');
    expect(d['hello']['json']).toEqual({});
    dat =`---
name: Derek Worthen
age: 127
contact:
    email: email@domain.com
    address: some location
pets:
    - cat
    - dog
    - bat
---
Some Other content`;
    m.update_document('hello', dat);
    d = m.get_documents();
    expect(d['hello']['content']).toBe(dat);
    expect(d['hello']['json'].age).toBe(127);
    expect(m.get_document_body('hello')).toBe('\nSome Other content');
});

it('get document content ', () => {
    const dat ='hello data';
    m.update_document('hello', dat);
    var d = m.get_document_content('hello');
    expect(d).toBe('hello data');    
    d = m.get_document_content('hello1');
    expect(d).toBe('');
});


it('diagram object can be updated', () => {
    const dat =`---
nodes:
    -   n1
    -   n2
    -   n3
    -   n4
edges:
    -   from: n1
        to: n2
        label: 2️⃣
        paintStyle:
        strokeWidth: 1
        stroke: red
    -   from: n2
        to: n3
        label: create
    -   from: n3
        to: n1
---`;
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['json']['nodes']).toContain('n4');
    expect(d['hello']['error']).toBe(false);
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
});

it('node attr can be updated', () => {
    var dat =`---
top: 200px
---
body text`;
    m.update_document('n4', dat);
    expect(m.get_attr('n4','top')).toBe('200px');
    m.update_attr('n4', 'top', '250px');
    expect(m.get_attr('n4','top')).toBe('250px');
});

it('get edges', () => {
    var dat =`---
nodes:
    -   n1
    -   n2
    -   n3
    -   n4
edges:
    -   from: n1
        to: n2
        label: 2️⃣
        paintStyle:
        strokeWidth: 1
        stroke: red
    -   from: n2
        to: n3
        label: create
    -   from: n3
        to: n1
---`;
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    expect(m.get_edges('hello')[0]['from']).toBe('n1');
    dat =`---
top: 200px
---
body text`;
    m.update_document('n4', dat);
    expect(m.get_edges('n4')).toEqual([]);
});

it('build permlink data', () => {
    const dat =`---
nodes:
    -   n1
    -   n2
    -   n3
    -   n4
edges:
    -   from: n1
        to: n2
        label: 2️⃣
        paintStyle:
        strokeWidth: 1
        stroke: red
    -   from: n2
        to: n3
        label: create
    -   from: n3
        to: n1
---`;
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    m.update_document('n1','Hello n1');
    m.update_document('n2','Hello n2');
    m.update_document('n4','Hello n4');
    var b64 = m.build_permlink();
    //console.log(window.diagram_documents)
    //console.log(b64);
    m.init_from_permlink(b64);
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    //expect(d).toContain('diagram'); //diagram is not a node
    //console.log(m.get_documents());
});

it('attr change can be serialized', () => {
    const dat =`---
top: 200px
---
body text`;
    m.update_document('n1',dat);
    m.update_attr('n1','top','kkkk');
    var b64 = m.build_permlink();
    m.init_from_permlink(b64);
    expect(m.get_attr('n1','top')).toBe('kkkk');
});

it('error permlink data', () => {
    var b64 = 'wrong data';
    var d = m.init_from_permlink(b64);
    //d = m.get_subnode_names();
    expect(d).toBe(false);
});

it('get subnode names', () => {
    const dat =`---
nodes:
    -   n1
    -   n2
    -   n3
    -   n4
edges:
    -   from: n1
        to: n2
        label: 2️⃣
        paintStyle:
        strokeWidth: 1
        stroke: red
    -   from: n2
        to: n3
        label: create
    -   from: n3
        to: n1
---`;
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    m.update_document('n1','Hello n1');
    m.update_document('n2','Hello n2');
    m.update_document('n4','Hello n4');
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    d = m.get_subnode_names('n1');
    expect(d).toEqual([]);
});

it('update diagram will create global name list', () => {
    const dat =`---
nodes:
    -   n1
    -   n2
    -   n3
    -   n4
edges:
    -   from: n1
        to: n2
        label: 2️⃣
        paintStyle:
        strokeWidth: 1
        stroke: red
    -   from: n2
        to: n3
        label: create
    -   from: n3
        to: n1
---`;
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    d = m.get_all_names();
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    expect(d).toContain('hello');
});