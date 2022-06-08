'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { Remarkable } = require('remarkable');
const { escapeHtml} = require('remarkable').utils

var markdownParser = new Remarkable();
// open links in new windows
markdownParser.renderer.rules.link_open = (function() {
  var original = markdownParser.renderer.rules.link_open;
  return function() {
    var link = original.apply(this, arguments);
    return link.substring(0, link.length - 1) + ' target="_blank">';
  };
})();

markdownParser.renderer.rules.image = (function() {
    var original = markdownParser.renderer.rules.image;
    return function(tokens, idx, opt, env) {
      var width = escapeHtml(tokens[idx].title);
      var imgOutput = original.apply(this, arguments);
      // remove title and add width and height 
      return  imgOutput.substring(0, imgOutput.length - 1) + ' width="'+width+'">';
    };
})();

it('normal text parse', () => {
    let h = markdownParser.render('hello');
    expect(h).toBe('<p>hello</p>\n');
});

it('link open', () => {
    let h = markdownParser.render('[hello](http://www.google.com)');
    expect(h).toBe('<p><a href="http://www.google.com" target="_blank">hello</a></p>\n');
});

it('image', () => {
    let h = markdownParser.render('![](https://avatars.githubusercontent.com/u/311397?v=4 "200")');
    expect(h).toBe('<p><img src="https://avatars.githubusercontent.com/u/311397?v=4" alt="" title="200" width="200"></p>\n');
});

