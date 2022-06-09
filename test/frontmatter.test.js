'use strict';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

//var yamlFront = require('yaml-front-matter');
var jsYaml     = require('js-yaml');

function parse(text, options, loadSafe) {
    let contentKeyName = options && typeof options === 'string'
        ? options
        : options && options.contentKeyName 
            ? options.contentKeyName 
            : '__content';

    let passThroughOptions = options && typeof options === 'object'
        ? options
        : undefined;

    let re = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/
        , results = re.exec(text)
        , conf = {}
        , yamlOrJson;

    if ((yamlOrJson = results[2])) {
        if (yamlOrJson.charAt(0) === '{') {
            conf = JSON.parse(yamlOrJson);
        } else {
            if(loadSafe) {
                conf = jsYaml.safeLoad(yamlOrJson, passThroughOptions);
            } else {
                conf = jsYaml.load(yamlOrJson, passThroughOptions); 
            }
        }
    }

    conf[contentKeyName] = results[3] || '';

    return conf;
};

function loadFront (content, options) {
    return parse(content, options, false);
};

//yamlFront.loadFront(fileContents)

it('front matter', () => {
    let fileContents = `---
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
Some Other content`
    let h = loadFront(fileContents);
    console.log(h);
    expect(h["__content"]).toBe('\nSome Other content');
});
