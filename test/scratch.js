function clear_canvas() {
    window.j.reset();  //remove all connections, endpoints.
    //remove all DOMs created by nodes.
    nodes.clear_nodes();
    edges.clear_edges();
  }
  
  function draw_nodes(obj) {
    nodes.add_nodes(obj);
  }
  
  //eslint-disable-next-line
  function draw_edges(obj) {
    edges.add_edges(obj);
  }
  
  function draw(obj) {
    //update canvas
    clear_canvas();
    draw_nodes(obj);
    draw_edges(obj);
  }
  
  //retrieve the top/left parameters of each node, rebuild yaml
function save_yaml() {
    //node list
    var nodes = window.diagram_attrs.json.nodes;
    for (let n in nodes) {
      if (nodes.hasOwnProperty(n)) {
        let e = document.getElementById(n);
        nodes[n].left = e.style.left;
        nodes[n].top = e.style.top;
      }
    }
    //rebuild yaml
    var y = jsyaml.dump(window.diagram_attrs.json);
    source.setValue(y);
  }