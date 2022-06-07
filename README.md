# diagram
Generating diagram from yaml.

http://127.0.0.1:5500/dist/#diag=eyJkaWFncmFtIjoiZGVmYXVsdDpcbiAgd2lkdGg6IDEwMFxuICBoZWlnaHQ6IDEwMFxuICB0b3A6IDEwMFxuICBsZWZ0OiAxMDBcbm5vZGVzOlxuICBuMTpcbiAgICB0b3A6IDQ1cHhcbiAgICBsZWZ0OiAxMzJweFxuICAgIGJvcmRlcjogMnB4IGRhc2hlZCBncmVlblxuICBuMjpcbiAgICB0b3A6IDlweFxuICAgIGxlZnQ6IDYzN3B4XG4gICAgd2lkdGg6IDIwMFxuICAgIGhlaWdodDogMjAwXG4gIG4zOlxuICAgIHRvcDogMjk0cHhcbiAgICBsZWZ0OiA1NHB4XG4gICAgYm9yZGVyOiBmYWxzZVxuICAgIGhlaWdodDogMTAwXG4gIG40OlxuICAgIHRvcDogMjY5cHhcbiAgICBsZWZ0OiAzODZweFxuICAgIGhlaWdodDogMzAwXG4gICAgd2lkdGg6IDUwMFxuICAgIHRleHQtYWxpZ246IGxlZnRcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHhcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB5ZWxsb3dcbiAgICBib3JkZXI6IDBweFxuZWRnZXM6XG4gIC0gZnJvbTogbjFcbiAgICB0bzogbjJcbiAgICBsYWJlbDogMu+4j+KDo1xuICAgIHBhaW50U3R5bGU6XG4gICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgc3Ryb2tlOiByZWRcbiAgLSBmcm9tOiBuMlxuICAgIHRvOiBuM1xuICAgIGxhYmVsOiBjcmVhdGVcbiAgLSBmcm9tOiBuM1xuICAgIHRvOiBuMVxuIiwibjEiOiIhW10oaHR0cHM6Ly9pbWcwLmJhaWR1LmNvbS9pdC91PTI4NTgzOTY4MzYsMzM4Nzg5NzE2OCZmbT0yNTMmZm10PWF1dG8mYXBwPTEzOCZmPUpQRUcpXG4iLCJuMiI6IiFbXShodHRwczovL3d3dy5qc29uLm9yZy9pbWcvanNvbjE2MC5naWYpXG5cbkpTT04iLCJuMyI6IiIsIm40IjoiIn0=


# The Idea

* A diagram is a connection of nodes and edges. 
* There is one YAML file, defines:
  *  Nodes: location, size and style.
  *  Edges: direction, style, label.
* There are multiple markdown files define the content of nodes, one markdown for one node.
* The location of one node can either be customized by modifying YAML file, or drag & drop the generated node in the diagram. In the later case, the related paremeters, say ```top``` and ```left``` in YAML will be updated automatically.
* The diagram can be exported in ```permlink``` address. All the information in the YAML and markdowns will be embedded in the exported URL paramters.
# Quick Start 

1. modify the yaml file to define the structure of the diagram
2. modify each of the markdown file to define the content of each node
3. copy the link address of the ```permlink``` and save it for future reference or sharing with friends. 

## diagram define example

```yaml
default:
  width: 100
  height: 100
  top: 100
  left: 100
nodes:
  n1:
    top: 31px
    left: 52px
    border: 2px dashed green
  n2:
    top: 9px
    left: 637px
    width: 200
    height: 200
  n3:
    top: 294px
    left: 54px
    border: false
    height: 100
  n4:
    top: 269px
    left: 386px
    height: 300
    width: 500
    text-align: left
    padding-left: 20px
    background-color: yellow
    border: 0px
edges:
  - from: n1
    to: n2
    label: 2️⃣
    paintStyle:
      strokeWidth: 1
      stroke: red
  - from: n2
    to: n3
    label: 🏦 create
  - from: n3
    to: n1
```

## node define example

```Markdown
![](https://www.json.org/img/json160.gif)
JSON
```

# TODO

[ ]  URL parameter format:  ```diag=.... ``` while the value is a serialized json object with below format:

```json
{
    "diagram": "YAML format string to define the diagram nodes and edges",
    "n1": "Markdown format string to define the format of node n1",
    "n2": "Markdown format string to define the format of node n2",
    ...
}
```
[ ] Use a dropdown control to select one item in the diag json object to be edited
[ ] Double click one node to select it in the codemirror editor and dropdown control
