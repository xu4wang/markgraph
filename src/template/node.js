'use strict';

class Node {
  constructor(id, attrs = {}) {
    this.id = id;
    this.attrs = attrs;
  }
  layout(rol, col, width, height, padding) {
  //calculate the upper,left position

    this.top = width / rol * padding;
    this.left = height / col * padding;
  }
  show(diagram) {
  //draw the node in diagram
    this.diagram = diagram;
  }
}

/*
{ title: 'Node 1',
  'title style': { key1: 'val1', key2: 'val2' },
  image: 'https://www.baidu.com/baidu.png',
  'image style': { key1: 'val1', key2: 'val2' },
  row: 1,
  col: 1,
  'node style': { key1: 'val1', key2: 'val2' } }
*/
var n1 = new Node('n1', {});
n1.show('d');
