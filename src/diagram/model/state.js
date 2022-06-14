'use strict';

let store = {};
let events = {};

function emit(eventName, payload) {
  if (typeof payload === 'function') payload = payload(store);
  //if (typeof payload === 'function') payload = payload(store);
  if (Object.prototype.toString.call(payload) !== '[object Object]') {
    console.error('Payload should be an object');
    return false;
  }
  /*   //there is no event subscribed
  if (!events.hasOwnProperty(eventName)) {
    //console.error(`Event "${eventName}" does not exists`);

    store = Object.assign({}, store, payload);
    return false;  //we can still EMIT
  }
 */
  //update store, with the payload, or the processed data (of payload func)
  store = Object.assign({}, store, payload);
  if (events.hasOwnProperty(eventName)) {
    events[eventName].forEach(({ dep, cb }) => {
      if (dep.length === 0) cb(store);
      else {
        //dep is the parameters the cb needed.
        const t = {};
        dep.forEach((k) => {
          if (store.hasOwnProperty(k)) t[k] = store[k];
        });
        //call cb with the generated parameters
        cb(t);
      }
    });
  }
  return true;
}

function on(eventName, cb, dep = []) {
  if (typeof cb !== 'function') {
    console.error('on() method expects 2nd argument as a callback function');
    return false;
  }

  if (Object.prototype.toString.call(dep) !== '[object Array]') {
    console.error('on() method expects 3nd argument as an array');
    return false;
  }

  if (!events.hasOwnProperty(eventName)) events[eventName] = [];
  events[eventName].push({ dep, cb });
  return true;
}

function init(s) {
  store = s;
}

function get_store() {
  return store;
}

function reset_listener() {
  events = {};
}

exports.init = init;
exports.emit = emit;
exports.on = on;
exports.get_store = get_store;
exports.reset_listener = reset_listener;
