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
    const dat ='hello data';
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['content']).toBe('hello data');
    expect(d['hello']['obj']).toBe({});
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
match: !!js/regexp /pattern/gim
run: !!js/function function() { }
---
Some Other content`;
    m.update_document('hello', dat);
    d = m.get_documents();
    expect(d['hello']['content']).toBe('Some Other content');
    expect(d['hello']['obj'].age).toBe(127);
});

it('get document content ', () => {
    const dat ='hello data';
    m.update_document('hello','markdown',dat);
    var d = m.get_document_content('hello');
    expect(d).toBe('hello data');    
    d = m.get_document_content('hello1');
    expect(d).toBe('');
});

it('diagram object can be updated', () => {
    const dat =`
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
`;
    m.update_document('hello','yaml',dat);
    var d = m.get_documents();
    expect(d['hello']['type']).toBe('yaml');
    //console.log(d['diagram']['json']);
    expect(d['hello']['json']['nodes']).toContain('n4');
    expect(d['hello']['error']).toBe(false);
});

it('diagram object will update document list', () => {
    const dat =`nodes:
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
`;
    m.update_document('hello','yaml',dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    d = m.get_node_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    //expect(d).toContain('diagram');
});


it('build permlink data', () => {
    const dat =`nodes:
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
`;
    m.update_document('hello','yaml',dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    m.update_document('n1','markdown','Hello n1');
    m.update_document('n2','markdown','Hello n2');
    m.update_document('n4','markdown','Hello n4');
    var b64 = m.build_permlink();
    //console.log(window.diagram_documents)
    //console.log(b64);
    m.init_from_permlink(b64);
    d = m.get_node_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    //expect(d).toContain('diagram'); //diagram is not a node
    //console.log(m.get_documents());
});

it('node attr can be updated', () => {
    const dat =`nodes:
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
`;
    m.update_document('hello','yaml',dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    m.update_node_attr('n4', 'top', '250px');

    expect(m.get_node_attr('n4','top')).toBe('250px');

    //console.log(m.get_documents());
});


it('get edges', () => {
    const dat =`nodes:
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
`;
    m.update_document('hello','yaml',dat);
    var d = m.get_documents();
    expect(d['hello']['error']).toBe(false);
    m.update_document('n1','markdown','Hello n1');
    m.update_document('n2','markdown','Hello n2');
    m.update_document('n3','markdown','Hello n3');
    m.update_document('n4','markdown','Hello n4');

    expect(m.get_edges('hello')[0]['from']).toBe('n1');
    //console.log(m.get_documents());
});

it('error permlink data', () => {
    var b64 = 'wrong data';
    var d = m.init_from_permlink(b64);
    //d = m.get_node_names();
    expect(d).toBe(false);
});
