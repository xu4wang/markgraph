'use strict';

var m = require('../model/model');
var node = require('./node');


//retrieve the top/left parameters of each node, rebuild yaml
function node_moved() {
  //update model
  var name = m.get_active_document();
  var nodes = m.get_subnode_names(name);
  if (nodes.length === 0) { //it's the node
    let e = document.getElementById(name);
    m.update_attr(name, 'left', e.style.left);
    m.update_attr(name, 'top', e.style.top);
    //source.setValue(m.get_document_content(name));
    m.set_active_document(name);   //Trigger left pannel update
  } else {
    for (let n of nodes) {
      let e = document.getElementById(n);
      m.update_attr(n, 'left', e.style.left);
      m.update_attr(n, 'top', e.style.top);
    }
  }
}

function node_selected(p) {
  //console.log(p);
  m.set_active_document(p.id);
  //update_dropdown();
  //dropdown.value = p.id;
  //source.setValue(m.get_document_content(p.id));
}

function init() {
  //it will be updated automatically. by the timer.
  var canvas = document.getElementById('canvas');

  jsPlumbBrowserUI.ready(function () {
    window.j = jsPlumbBrowserUI.newInstance({
      dragOptions: { cursor: 'pointer', zIndex: 2000 },
      paintStyle: { stroke: '#666', strokeWidth:2 },
      endpointHoverStyle: { fill: 'orange' },
      hoverPaintStyle: { stroke: 'orange' },
      endpointStyle: { width: 20, height: 16, stroke: '#666' },
      endpoint: 'Rectangle',
      anchors: [ 'TopCenter', 'TopCenter' ],
      container: canvas,
      dropOptions:{ activeClass:'dragActive', hoverClass:'dropHover' }
    });

    window.diagram_model = m;

    //eslint-disable-next-line
    window.j.bind(jsPlumbBrowserUI.EVENT_DRAG_STOP, (p) => { 
      node_moved();
    });

    window.j.bind(jsPlumbBrowserUI.EVENT_ELEMENT_DBL_CLICK, (p) => {
      node_selected(p);
    });
  });
}


m.on('ACTIVE-DOCUMENT', ({ active }) => {
  if (window.j) {
    window.j.reset();
    node.add_node(m, active);
  }
});

exports.init = init;
