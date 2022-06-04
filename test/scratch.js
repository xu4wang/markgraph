

//retrieve the top/left parameters of each node, rebuild yaml
function save_yaml(){
  //node list
  var nodes = window.diagram_attrs.json.notes;
  for (let n in nodes) {
    if (nodes.hasOwnProperty(n)) {
      let e = document.getElementById(n)
      nodes[n].left = e.style.left;
      nodes[n].top = e.style.top;
    }
  }
  //rebuild yaml

  var y = window.diagram_jsyaml.dump(window.diagram_attrs.json);
  window.diagram_source.setValue(y);
}