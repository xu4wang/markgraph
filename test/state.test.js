'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

var store = require('../src/diagram/model/state.js');

/*

const store = Kel({ count: 0 });

const COUNT_CHANGE = "countChange";

store.on(COUNT_CHANGE, ({ count }) => {
  document.querySelectorAll("span.counter-value")[0].textContent = count;
});

document.getElementById("inc").addEventListener("click", function () {
  store.emit(COUNT_CHANGE, ({ count }) => ({ count: count + 1 }));
});

document.getElementById("dec").addEventListener("click", function () {
  store.emit(COUNT_CHANGE, ({ count }) => ({ count: count - 1 }));
});

*/

it('sub pub', () => {
    store.init({count: 0, docs:{} });
    var counter = 0;
    const COUNT_CHANGE = "countChange";
    store.on(COUNT_CHANGE, ({ count }) => {
        counter = count;
    });
    store.emit(COUNT_CHANGE, ({ count }) => ({ count: count + 1 }));
    expect(counter).toBe(1);
    store.emit(COUNT_CHANGE, ({ count }) => ({ count: count + 1 }));
    store.emit(COUNT_CHANGE, ({ count }) => ({ count: count + 1 }));
    expect(counter).toBe(3);
});


function add_new_doc(m , key, value) {
    m[key] = {};
    m[key].hello = "Hello World";
    m[key].content = value;
    return m;
}

it('extend model', () => {
    store.init({docs: {}});
    store.on("DOC-UPDATED", ({ docs }) => {
        expect(docs.hello.hello).toBe('Hello World');
        expect(docs.hello.content).toBe('world');
    });
    store.emit("DOC-UPDATED", ({ docs }) => {add_new_doc(docs, 'hello', 'world')});
});
