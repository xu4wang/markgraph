'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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

it('active document can be saved and read ', () => {
    m.set_active_document('hello');
    expect(m.get_active_document()).toBe('hello');
});

it('document can be saved and read, get common attr ', () => {
    m.reset('test1', 'bad b64 data');
    var dat ='hello data';
    m.update_document('hello', dat);
    var d = m.get_documents();
    expect(d['hello']['body']).toBe('hello data');
    expect(d['hello']['json']['style']).toEqual({});
    dat =`---
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
   // expect(d['hello']['body']).toBe(dat);
    expect(d['hello']['json'].age).toBe(127);
    expect(m.get_document_body('hello')).toBe('\nSome Other content');
    expect(m.get_common_attr('hello','age')).toBe(127);
});

it('get document content ', () => {
    m.reset('test1', 'bad b64 data');
    const dat ='hello data';
    m.update_document('hello', dat);
    var d = m.get_document_content('hello');
    expect(d).toContain('hello data');    
});


it('diagram object can be updated', () => {
    m.reset('test1', 'bad b64 data');
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
    //expect(d['hello']['error']).toBe(false);
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
});

it('node attr can be updated', () => {
    m.reset('test1', 'bad b64 data');
    var dat =`---
style:
    top: 200px
---
body text`;
    m.update_document('n4', dat);
    expect(m.get_attr('n4','top')).toBe('200px');
    m.update_attr('n4', 'top', '250px');
    expect(m.get_attr('n4','top')).toBe('250px');
});

it('get edges', () => {
    m.reset('test1', 'bad b64 data');
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
    //expect(d['hello']['error']).toBe(false);
    expect(m.get_edges('hello')[0]['from']).toBe('n1');
    dat =`---
top: 200px
---
body text`;
    m.update_document('n4', dat);
    expect(m.get_edges('n4')).toEqual([]);
});

it('build permlink data', () => {
    m.reset('test1', 'bad b64 data');
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
    //expect(d['hello']['error']).toBe(false);
    m.update_document('n1','Hello n1');
    m.update_document('n2','Hello n2');
    m.update_document('n4','Hello n4');
    var b64 = m.get_b64();
    //console.log(window.diagram_documents)
    //console.log(b64);
    m.reset('',b64);
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    //expect(d).toContain('diagram'); //diagram is not a node
    //console.log(m.get_documents());
});

it('attr change can be serialized', () => {
    m.reset('test1', 'bad b64 data');

    const dat =`---
style:
    top: 200px
---
body text`;
    m.update_document('n1',dat);
    m.update_attr('n1','top','kkkk');
    var b64 = m.get_b64();
    m.reset('',b64);
    expect(m.get_attr('n1','top')).toBe('kkkk');
});

/*
it('error permlink data', () => {
    m.reset('test1', 'bad b64 data');

    var b64 = 'wrong data';
    var d = m.reset('',b64);
    //d = m.get_subnode_names();
    expect(d).toBe(false);
});
*/

it('get subnode names', () => {
    m.reset('test1', 'bad b64 data');

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
    //expect(d['hello']['error']).toBe(false);
    m.update_document('n1','Hello n1');
    m.update_document('n2','Hello n2');
    m.update_document('n4','Hello n4');
    d = m.get_subnode_names('hello');
    expect(d).toContain('n1');
    expect(d).toContain('n4');
    d = m.get_subnode_names('n1');
    expect(d).toEqual([]);
});

it('update diagram will not create global name list', () => {
    m.reset('test1', 'bad b64 data');

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
    m.format(true);
    //expect(m.get_notes_name()).toBe('#test1');
    m.reset_listener();

    m.update_document('hello', dat);
    var d = m.get_documents();
    //expect(d['hello']['error']).toBe(false);
    var names;
    names = m.get_all_names();
    expect(!('n1' in names)).toBeTruthy();
    expect(!('n4' in names)).toBeTruthy();
});

it('document name change ', () => {
    m.format(true);
    var dat ='hello data';
    m.update_document('hello', dat);
    m.set_config('keep',['hello']);
    expect(m.get_document_body('hello')).toBe('hello data');
    m.rename_document('hello', 'hello1');
    expect(m.get_document_body('hello1')).toBe('hello data');
    //check hello is not available.
    expect(m.get_document_body('hello')).toBe('hello data'); //hello will not be deleted
});

it('style inherit ', () => {
    m.format(true);

    var dat =`---
style :
    attr1 : value1
    attr2 : value2
---
hello`;
    m.update_document('parent', dat);
    expect(m.get_attr('parent','attr1')).toBe('value1');    
    expect(m.get_attr('parent','attr2')).toBe('value2');    
    dat =`---
follow :
    - parent
style :
    attr1 : child_value1
---
hello`;
    m.update_document('child', dat);
    expect(m.get_attr('child','attr1')).toBe('child_value1');    
    expect(m.get_attr('child','attr2')).toBe('value2');   
    dat =`---
follow :
    - child
style :
    attr3 : grand_child_value3
---
hello`;
    m.update_document('grand_child', dat);
    expect(m.get_attr('grand_child','attr1')).toBe('child_value1');    
    expect(m.get_attr('grand_child','attr2')).toBe('value2');   
    expect(m.get_attr('grand_child','attr3')).toBe('grand_child_value3');   
});

it('active document change listener ', () => {
    m.format(true);

    m.on("ACTIVE-DOCUMENT", ({ active }) => {
        expect(active).toBe('Hello World');
    });
    m.set_active_document('Hello World');
});

it('document change listener ', () => {
    m.format(true);

    m.on("DOCUMENT-UPDATE", ({impacted, documents }) => {
        expect(documents.hello.json.age).toBe(127);
        expect(impacted).toBe('hello');
    });
    var dat =`---
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
});


it('document delete listener ', () => {
    m.format(true);

    m.reset();
    m.reset_listener();
    m.on("DOCUMENT-DELETE", ({ documents }) => {
        expect(m.get_document_content('hello1')).toBe('');
        //expect(documents.world.json.name).toBe('world');
    });
    var dat =`---
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
    m.update_document('hello1', dat);
    m.set_config('keep',[]);
    m.delete_document('hello1');
});

it('delete docs & impacted docs', () => {
    m.format(true);

    var dat ='hello data';
    m.update_document('hello222', dat);
    expect(m.get_impacted_document()).toBe('hello222');
    expect('hello222' in m.get_all_names()).toBeTruthy();
    m.set_config('keep',[]);
    m.delete_document('hello222');

    expect(m.get_impacted_document()).toBe('hello222');
    expect(!('hello222' in m.get_all_names())).toBeTruthy();
});


it('set config ', () => {
    m.format(true);

    m.set_config('buttons', []);
    expect(m.get_config('buttons')).toEqual([]);
    let cf = m.get_config('button1') || [];
    cf.push('hello');
    m.set_config('button1', cf);
    expect(m.get_config('button1')).toContain('hello');
});


it('docu available ', () => {
    m.format(true);

    m.update_document('hello1', "hello");
    expect(m.document_available('hello1')).toBeTruthy();
    m.set_config('keep',[]);
    m.delete_document('hello1');
    expect(!(m.document_available('hello1'))).toBeTruthy();
});

it('append doc, same notes', () => {
    m.format(true);

    m.update_document('hello1', 'hello');
    m.append_document('hello1',' world');
    expect(m.get_document_body('hello1')).toBe('hello world');
});

it('append doc, same notes', () => {
    m.format(true);

    m.update_document('hello1', 'hello');
    m.append_document('hello1',' world');
    expect(m.get_document_body('hello1')).toBe('hello world');
});
