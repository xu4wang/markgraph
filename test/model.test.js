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
    m.update_document('hello','markdown',dat);
    var d = m.get_documents();
    expect(d['hello']['content']).toBe('hello data');
    expect(d['hello']['type']).toBe('markdown');
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
    const dat =`default:
    width: 100
    height: 100
    top: 100
    left: 100
nodes:
    n1:
        top: 31px
        left: 52px
        border: 2px dashed green
    n2:
        top: 9px
        left: 637px
        width: 200
        height: 200
    n3:
        top: 294px
        left: 54px
        border: false
        height: 100
    n4:
        top: 269px
        left: 386px
        height: 300
        width: 500
        text-align: left
        padding-left: 20px
        background-color: yellow
        border: 0px
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
    expect(d['diagram']['type']).toBe('yaml');
    //console.log(d['diagram']['json']);
    expect(d['diagram']['json']['default']['width']).toBe(100);
    expect(d['diagram']['error']).toBe(false);
});

it('diagram object will update document list', () => {
    const dat =`default:
    width: 100
    height: 100
    top: 100
    left: 100
nodes:
    n1:
        top: 31px
        left: 52px
        border: 2px dashed green
    n2:
        top: 9px
        left: 637px
        width: 200
        height: 200
    n3:
        top: 294px
        left: 54px
        border: false
        height: 100
    n4:
        top: 269px
        left: 386px
        height: 300
        width: 500
        text-align: left
        padding-left: 20px
        background-color: yellow
        border: 0px
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
    expect(d['diagram']['error']).toBe(false);
    d = m.get_node_names();
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    expect(d).toContain('diagram');
});


it('build permlink data', () => {
    const dat =`default:
    width: 100
    height: 100
    top: 100
    left: 100
nodes:
    n1:
        top: 31px
        left: 52px
        border: 2px dashed green
    n2:
        top: 9px
        left: 637px
        width: 200
        height: 200
    n3:
        top: 294px
        left: 54px
        border: false
        height: 100
    n4:
        top: 269px
        left: 386px
        height: 300
        width: 500
        text-align: left
        padding-left: 20px
        background-color: yellow
        border: 0px
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
    expect(d['diagram']['error']).toBe(false);
    m.update_document('n1','markdown','Hello n1');
    m.update_document('n2','markdown','Hello n2');
    m.update_document('n4','markdown','Hello n4');
    var b64 = m.build_permlink();
    //console.log(window.diagram_documents)
    //console.log(b64);
    m.init_from_permlink(b64);
    d = m.get_node_names();
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    expect(d).toContain('diagram');
    //console.log(m.get_documents());
});

it('node attr can be updated', () => {
    const dat =`default:
    width: 100
    height: 100
    top: 100
    left: 100
    only_me: 300
nodes:
    n1:
        top: 31px
        left: 52px
        border: 2px dashed green
    n2:
        top: 9px
        left: 637px
        width: 200
        height: 200
    n3:
        top: 294px
        left: 54px
        border: false
        height: 100
    n4:
        top: 269px
        left: 386px
        height: 300
        width: 500
        text-align: left
        padding-left: 20px
        background-color: yellow
        border: 0px
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
    expect(d['diagram']['error']).toBe(false);
    m.update_document('n1','markdown','Hello n1');
    m.update_document('n2','markdown','Hello n2');
    m.update_document('n3','markdown','Hello n3');
    m.update_document('n4','markdown','Hello n4');
    m.update_node_attr('n4', 'top', '250px');

    expect(m.get_node_attr('n4','top')).toBe('250px');
    expect(m.get_node_attr('n4','only_me')).toBe(300);
    expect(m.get_node_attr('n2','only_me')).toBe(300);

    //console.log(m.get_documents());
});


it('get edges', () => {
    const dat =`default:
    width: 100
    height: 100
    top: 100
    left: 100
    only_me: 300
nodes:
    n1:
        top: 31px
        left: 52px
        border: 2px dashed green
    n2:
        top: 9px
        left: 637px
        width: 200
        height: 200
    n3:
        top: 294px
        left: 54px
        border: false
        height: 100
    n4:
        top: 269px
        left: 386px
        height: 300
        width: 500
        text-align: left
        padding-left: 20px
        background-color: yellow
        border: 0px
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
    expect(d['diagram']['error']).toBe(false);
    m.update_document('n1','markdown','Hello n1');
    m.update_document('n2','markdown','Hello n2');
    m.update_document('n3','markdown','Hello n3');
    m.update_document('n4','markdown','Hello n4');

    expect(m.get_edges()[0]['from']).toBe('n1');
    //console.log(m.get_documents());
});
