# diagram

Generating diagram from yaml/markdown.

[Live Demo is avalable here!](http://awis.me/diagram/#diag=eyJkaWFncmFtIjoiZGVmYXVsdDpcbiAgd2lkdGg6IDEwMFxuICBoZWlnaHQ6IDEwMFxuICB0b3A6IDEwMFxuICBsZWZ0OiAxMDBcbm5vZGVzOlxuICBuMTpcbiAgICB0b3A6IDEycHhcbiAgICBsZWZ0OiAxMDJweFxuICAgIGJvcmRlcjogMnB4IGRhc2hlZCBncmVlblxuICAgIGhlaWdodDogMTIwXG4gICAgd2lkdGg6IDEyMFxuICBuMjpcbiAgICB0b3A6IDhweFxuICAgIGxlZnQ6IDcyOHB4XG4gICAgd2lkdGg6IDIwMFxuICAgIGhlaWdodDogMjAwXG4gIG4zOlxuICAgIHRvcDogMzk5cHhcbiAgICBsZWZ0OiAxMDBweFxuICAgIGJvcmRlcjogZmFsc2VcbiAgICBoZWlnaHQ6IDgwXG4gICAgd2lkdGg6IDgwXG4gIG41OlxuICAgIHRvcDogMjQzcHhcbiAgICBsZWZ0OiAxOTNweFxuICAgIGJvcmRlcjogZmFsc2VcbiAgICBoZWlnaHQ6IDEwMFxuICBuNDpcbiAgICB0b3A6IDI4MHB4XG4gICAgbGVmdDogNTI2cHhcbiAgICBoZWlnaHQ6IDI2MFxuICAgIHdpZHRoOiAzMDBcbiAgICB0ZXh0LWFsaWduOiBsZWZ0XG4gICAgcGFkZGluZy1sZWZ0OiA4cHhcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHhcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB5ZWxsb3dcbiAgICBib3JkZXI6IDBweFxuICAgIHotaW5kZXg6IDFcbmVkZ2VzOlxuICAtIGZyb206IG4xXG4gICAgdG86IG4yXG4gICAgbGFiZWw6IDLvuI/ig6NcbiAgICBwYWludFN0eWxlOlxuICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgIHN0cm9rZTogcmVkXG4gIC0gZnJvbTogbjJcbiAgICB0bzogbjNcbiAgICBsYWJlbDogY3JlYXRlXG4gIC0gZnJvbTogbjNcbiAgICB0bzogbjFcbiAgLSBmcm9tOiBuNVxuICAgIHRvOiBuMVxuIiwibjEiOiJuMVxuXG4hW10oaHR0cHM6Ly9wMy5pdGMuY24vcV83MC9pbWFnZXMwMy8yMDIxMDgyNC80OTFmODU3MzE2M2I0ZTlhYTk1YjQ2NTgzOTcyNmQzNC5wbmcpXG5cbiIsIm4yIjoibjJcblxuIVtdKGh0dHBzOi8vd3d3Lmpzb24ub3JnL2ltZy9qc29uMTYwLmdpZikiLCJuMyI6IiFbXShodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMzExMzk3P3Y9NCBcIjUwXCIpXG5cbm4zIiwibjUiOiIqbjUqXG5cbi0gdGFzayAxXG4tIHRhc2sgMlxuLSB0YXNrIDNcbi0gdGFzayA0XG4tIHRhc2sgNSIsIm40IjoiKm40KlxuXG50aGlzIGlzIGEgbm90ZSBpbiBtYXJrZG93blxueW91IGNhbiBldmVuIHB1dCB0YWJsZSwgbGlzdCwgaW1hZ2UuLi4gaGVyZVxuXG58IGl0ZW0xIHwgaXRlbTIgfFxufDotLS0tLS0tfDotLS0tLS06fFxufCB2YWx1ZSAxfHRoaXMgaXMgYSBsb25nIHZhbHVlIDJ8XG5cbi0tLS1cblxuKiBra2tcbiogbGxsXG5cbiFbXShodHRwczovL3BhbmRhby5naXRodWIuaW8vZWRpdG9yLm1kL2ltYWdlcy9sb2dvcy9lZGl0b3JtZC1sb2dvLTE4MHgxODAucG5nIFwiODBcIikifQ==
# The Idea

* A diagram is a collection of nodes and edges. 
* Each node is defined by a markdown file
* There is one YAML file, defines:
  *  The apperence of the nodes: location, size and style.
  *  Edges: direction, style, label.
* The location of one node can either be customized by modifying parameters in the YAML file, or drag & drop the generated node in the diagram. In the later case, the related paremeters, say ```top``` and ```left``` in YAML will be updated automatically.
* The diagram can be exported in ```permlink``` address. All the information in the YAML and markdowns will be embedded in the exported URL. You can share the URL as a copy of the editable version of the diagram.
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

# Features

[x]  Use permlink to share editable diagram. URL parameter format:  ```diag=.... ``` while the value is a serialized json object with below format:

```json
{
    "diagram": "YAML format string to define the diagram nodes and edges",
    "n1": "Markdown format string to define the format of node n1",
    "n2": "Markdown format string to define the format of node n2",
    ...
}
```
[x] Use dropdown control to select one item, the diagram layout defination or one node to edit.
[x] Double click one node to select it in the source editor.
[x] Syntax highlight for YAML(diagram layout defination) and Markdown(node defination).

# HOWTO

## Customize node

### Add image to a node

### Bring one node to the back, as a background image

### Size, position, color etc
## Customize Edge

### Add label to a edge

## Share an editable diagram

## Developement

## Unit test

```
npx jest --no-cache --verbose
```

## Build

```
npm run build
```
