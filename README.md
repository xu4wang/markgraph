# diagram

Generating diagram from yaml/markdown.

[Live Demo is avalable here!](http://awis.me/diagram/#diag=eyJkaWFncmFtIjoiZGVmYXVsdDpcbiAgd2lkdGg6IDEwMFxuICBoZWlnaHQ6IDEwMFxuICB0b3A6IDEwMFxuICBsZWZ0OiAxMDBcbm5vZGVzOlxuICBuMTpcbiAgICB0b3A6IDEycHhcbiAgICBsZWZ0OiAxMDJweFxuICAgIGJvcmRlcjogMnB4IGRhc2hlZCBncmVlblxuICAgIGhlaWdodDogMTIwXG4gICAgd2lkdGg6IDEyMFxuICBuMjpcbiAgICB0b3A6IDhweFxuICAgIGxlZnQ6IDcyOHB4XG4gICAgd2lkdGg6IDIwMFxuICAgIGhlaWdodDogMjAwXG4gIG4zOlxuICAgIHRvcDogMzk5cHhcbiAgICBsZWZ0OiA5NHB4XG4gICAgYm9yZGVyOiBmYWxzZVxuICAgIGhlaWdodDogMTQwXG4gICAgd2lkdGg6IDEwMFxuICBuNTpcbiAgICB0b3A6IDIxNXB4XG4gICAgbGVmdDogMTg3cHhcbiAgICBib3JkZXI6IGZhbHNlXG4gICAgaGVpZ2h0OiAxMDBcbiAgbjQ6XG4gICAgdG9wOiAzMDVweFxuICAgIGxlZnQ6IDQ2OXB4XG4gICAgaGVpZ2h0OiAyMDBcbiAgICB3aWR0aDogMzAwXG4gICAgdGV4dC1hbGlnbjogbGVmdFxuICAgIHBhZGRpbmctbGVmdDogMjBweFxuICAgIGJhY2tncm91bmQtY29sb3I6IHllbGxvd1xuICAgIGJvcmRlcjogMHB4XG4gICAgei1pbmRleDogMVxuZWRnZXM6XG4gIC0gZnJvbTogbjFcbiAgICB0bzogbjJcbiAgICBsYWJlbDogMu+4j+KDo1xuICAgIHBhaW50U3R5bGU6XG4gICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgc3Ryb2tlOiByZWRcbiAgLSBmcm9tOiBuMlxuICAgIHRvOiBuM1xuICAgIGxhYmVsOiBjcmVhdGVcbiAgLSBmcm9tOiBuM1xuICAgIHRvOiBuMVxuICAtIGZyb206IG41XG4gICAgdG86IG4xXG4iLCJuMSI6Im4xXG5cbiFbXShodHRwczovL3AzLml0Yy5jbi9xXzcwL2ltYWdlczAzLzIwMjEwODI0LzQ5MWY4NTczMTYzYjRlOWFhOTViNDY1ODM5NzI2ZDM0LnBuZylcblxuIiwibjIiOiJuMlxuXG4hW10oaHR0cHM6Ly93d3cuanNvbi5vcmcvaW1nL2pzb24xNjAuZ2lmKSIsIm4zIjoibjNcblxuIVtdKGh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8zMTEzOTc/dj00KSIsIm41IjoibjUiLCJuNCI6IipuNCpcblxudGhpcyBpcyBhIG5vdGUgaW4gbWFya2Rvd25cbnlvdSBjYW4gZXZlbiBwdXQgYSB0YWJsZSBoZXJlXG5cbnwgaXRlbTEgfCBpdGVtMiB8XG58Oi0tLS0tLS18Oi0tLS0tLTp8XG58IHZhbHVlIDF8dGhpcyBpcyBhIGxvbmcgdmFsdWUgMnxcblxuLS0tLVxuXG4qIGtra1xuKiBsbGxcbiJ9)

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

