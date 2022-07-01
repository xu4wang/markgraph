'use strict';

var jsyaml     = require('js-yaml');

//export object in JSON format, browser will download fileName.json
function export_json(fileName, obj) {
  let data = JSON.stringify(obj);
  //let data = jsyaml.dump(obj);
  let csvData = new Blob([ data ], { type: 'text/json' });
  let csvUrl = URL.createObjectURL(csvData);

  let hiddenElement = document.createElement('a');
  hiddenElement.href = csvUrl;
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName + '.yaml';
  hiddenElement.click();
}

function export_yaml(fileName, obj) {
  //let data = JSON.stringify(obj);
  let data = jsyaml.dump(obj);
  let csvData = new Blob([ data ], { type: 'text/json' });
  let csvUrl = URL.createObjectURL(csvData);

  let hiddenElement = document.createElement('a');
  hiddenElement.href = csvUrl;
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName + '.yaml';
  hiddenElement.click();
}

function parse(obj_str) {
  try {
    var obj = JSON.parse(obj_str);
    if (obj) {
      return obj;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function parse_yaml(obj_str) {
  try {
    var obj = jsyaml.load(obj_str);
    if (obj) {
      return obj;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
}

//upload a JSON file and return the parsed JSON object.
async function import_json() {
  let file = await Swal.fire({
    title: 'Select File',
    input: 'file',
    inputAttributes: {
      accept: 'application/json',
      'aria-label': 'Upload your snapshot file'
    }
  });
  if (file.value) {
    const dat = await readFileAsync(file.value);
    return parse(dat);
  }
  return false;
}

async function import_yaml() {
  let file = await Swal.fire({
    title: 'Select File',
    input: 'file',
    inputAttributes: {
      accept: 'application/yaml',
      'aria-label': 'Upload your snapshot file'
    }
  });
  if (file.value) {
    const dat = await readFileAsync(file.value);
    return parse_yaml(dat);
  }
  return false;
}

exports.import_json = import_json;
exports.export_json = export_json;
exports.export_yaml = export_yaml;
exports.import_yaml = import_yaml;
