# diagram

Generating diagram from yaml/markdown.

[Live Demo is avalable here!](http://awis.me/diagram/#diag=eyJkaWFncmFtIjoiZGVmYXVsdDpcbiAgd2lkdGg6IDEwMFxuICBoZWlnaHQ6IDEwMFxuICB0b3A6IDEwMFxuICBsZWZ0OiAxMDBcbiAgcGFkZGluZy1sZWZ0OiAxMHB4XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHhcbm5vZGVzOlxuICBuMTpcbiAgICB0b3A6IDdweFxuICAgIGxlZnQ6IDg4cHhcbiAgICBib3JkZXI6IDBweFxuICAgIGhlaWdodDogMTIwXG4gICAgd2lkdGg6IDEyMFxuICAgIGJveC1zaGFkb3c6IDBweCAwcHggMHB4XG4gIG4yOlxuICAgIHRvcDogOHB4XG4gICAgbGVmdDogNzI4cHhcbiAgICBib3JkZXI6IDJweCBkYXNoZWQgZ3JlZW5cbiAgICB3aWR0aDogMjAwXG4gICAgaGVpZ2h0OiAyMDBcbiAgICBib3JkZXItcmFkaXVzOiAwXG4gIG4zOlxuICAgIHRvcDogMzkzcHhcbiAgICBsZWZ0OiA3NXB4XG4gICAgaGVpZ2h0OiAxNDBcbiAgICB3aWR0aDogMTAwXG4gICAgdGV4dC1hbGlnbjogbGVmdFxuICBuNTpcbiAgICB0b3A6IDExMHB4XG4gICAgbGVmdDogMjQycHhcbiAgICBoZWlnaHQ6IDE2MFxuICAgIHdpZHRoOiAzMDBcbiAgICBsaW5lLWhlaWdodDogMTZweFxuICAgIHRleHQtYWxpZ246IGxlZnRcbiAgbjQ6XG4gICAgdG9wOiAyODNweFxuICAgIGxlZnQ6IDYzNHB4XG4gICAgaGVpZ2h0OiAyNTBcbiAgICB3aWR0aDogMzAwXG4gICAgdGV4dC1hbGlnbjogbGVmdFxuICAgIGJhY2tncm91bmQtY29sb3I6IHllbGxvd1xuICAgIGJvcmRlcjogMHB4XG4gICAgei1pbmRleDogMVxuZWRnZXM6XG4gIC0gZnJvbTogbjFcbiAgICB0bzogbjJcbiAgICBsYWJlbDogMu+4j+KDo1xuICAgIHBhaW50U3R5bGU6XG4gICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgc3Ryb2tlOiByZWRcbiAgLSBmcm9tOiBuMlxuICAgIHRvOiBuM1xuICAgIGxhYmVsOiBjcmVhdGVcbiAgLSBmcm9tOiBuM1xuICAgIHRvOiBuMVxuICAtIGZyb206IG41XG4gICAgdG86IG4xXG4iLCJuMSI6Im4xIGlzIGEgbm9kZSB3aXRob3V0IGJvcmRlclxuXG4hW10oaHR0cHM6Ly9wMy5pdGMuY24vcV83MC9pbWFnZXMwMy8yMDIxMDgyNC80OTFmODU3MzE2M2I0ZTlhYTk1YjQ2NTgzOTcyNmQzNC5wbmcpXG5cbiIsIm4yIjoibjJcblxuIVtdKGh0dHBzOi8vd3d3Lmpzb24ub3JnL2ltZy9qc29uMTYwLmdpZiBcIjEwMFwiKVxuXG5gYGBjc3NcbmJvcmRlci1yYWRpdXM6IDBcbmBgYFxudG8gbWFrZSBzcXVhcmUgYm9yZGVyXG4iLCJuMyI6Im4zXG5cbiFbXShodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMzExMzk3P3Y9NCBcIjUwXCIpXG5cbk5vdGUgaG93IHRvIHNldCB0aGUgd2lkdGggb2YgdGhlIGVtYmVkZGVkIHBpY3R1cmUuIiwibjUiOiIhW10oaHR0cHM6Ly90c2UzLW1tLmNuLmJpbmcubmV0L3RoL2lkL09JUC1DLkdSMzVGb2MxbjBnQVA2LUhuWF9CRGdIYUhhP3BpZD1JbWdEZXQmcnM9MSBcIjMwXCIpICpOb3RlKlxuMS4gRHJhZyZkcm9wIG5vZGUgdG8gcmUtcG9zaXRpb24gaXRcbjIuIERvdWJsZSBjbGljayBhIG5vZGUgdG8gZWRpdCBpdFxuMy4gU2VsZWN0ICdkaWFncmFtJyBpbiBkcm9wZG93biB0byBzdHlsZSBpdFxuXHQtIGN1c3RvbWl6ZSBub2RlIHNpemUgYW5kIGFwcGVyYW5jZSBcbiAgICAtIGN1c3RvbWl6ZSBsaW5rcyBiZXR3ZWVuIG5vZGVzXG40LiBmb3IgZXhhbXBsZTogYWRqdXN0XG5gYGBsaW5lLWhlaWdodDogMTZweGBgYCB0byBzZXQgbGluZSBoZWlnaHQuIiwibjQiOiIqbjQqXG5cbm5vdGUgaXMgZGVmaW5lZCBpbiBtYXJrZG93blxueW91IGNhbiBldmVuIHB1dCBhIHRhYmxlIGluIG5vZGU6XG5cbnwgdGVybSB8IGRlc2NyaXB0aW9uIHxcbnw6LS0tLS0tLXw6LS0tLS0tOnxcbnwgIG5vZGUgfCBhIHdpbmRvdyB3aXRoIHBpYyBhbmQgdGV4dHxcbnwgIGVkZ2UgfCBjb25uZWN0aW9uIGJldHdlZW4gdHdvIG5vZGVzfFxuXG4tLS1cbiogdXNlIHotaW5kZXggdG8gYnJpbmcgbm9kZSBiYWNrL2Zyb250XG4qIGN1c3RvbWl6ZSBiYWNrZ3JvdW5kLWNvbGVyXG5cbiFbXShodHRwczovL3RzZTItbW0uY24uYmluZy5uZXQvdGgvaWQvT0lQLUMuNzhtdDNwd2NTRHNpNEYwaDFvN2c0d0hhSGE/cGlkPUltZ0RldCZ3PTE4MCZoPTE4MCZycz0xIFwiNDVcIikifQ==)
# The Idea

* A diagram is a collection of nodes and edges. 
* A node is a diagram with only one node and no edge.  
* A node is defined by a markdown file.
  *  In the front matter section: the apperence of the node: location, size and style. 
  *  In the markdown body: the content of the node.
* A diagram is also defined by markdown file.
  *  In the front matter section:
     *  Default: the default attributes for all the nodes it has. 
     *  Nodes: list of nodes in this diagram.  
     *  Edges: direction, style, label.
  *  In the markdown body: currently only for comment purpose.  
* The location of one node can either be customized by modifying parameters in the markdown file, or drag & drop the generated node in the diagram. In the later case, the related paremeters, say ```top``` and ```left``` in markdown will be updated automatically.
* The diagram can be exported in ```permlink``` address. All the information in the markdowns will be embedded in the exported URL. You can share the URL as a copy of the editable version of the diagram.

# Quick Start 

1. modify each of the markdown file to define the content of each node
2. copy the link address of the ```permlink``` and save it for future reference or sharing with friends. 

## diagram define example


## node define example

```Markdown
![](https://www.json.org/img/json160.gif)
JSON
```

# Features

- [x]  Use permlink to share editable diagram. URL parameter format:  ```diag=.... ``` while the value is a serialized json object with below format:

```json
{
    "n1": "Markdown format string to define the format of node n1",
    "n2": "Markdown format string to define the format of node n2",
    ...
}
```
- [x] Use dropdown control to select one item, the diagram layout defination or one node to edit.
- [x] Double click one node to select it in the source editor.
- [x] Syntax highlight for Markdown(node defination).

# HOWTO

## backup your drawing

Diagram internally use browser localStorage to keep the latest version of drawing.  
There are 3 kinds of URLs.

1. https://awis.me/diagram/
2. https://awis.me/diagram/#diag=base64_encoded_diagram_data
3. https://awis.me/diagram/#filename1

The first one and second one are using the default local storage key. Any modification to the diagram will update the local storage default file immediately.

The third one explicitly choose a local storage key.

If you need to edit multiple diagrams simutaniously, it's safe to use hash plus filename scheme in the URL.
# Developement

## Unit test

```
npx jest --no-cache --verbose
```

## Build

```
npm run build
```

## Deploy

The deployment is easy, just build it and put all the generated files under /dist into your web server and it's done.

If you are in a hurry, you can get a pre-built version below: 

https://github.com/xu4wang/xu4wang.github.io/tree/master/diagram

Also, you can always use my deployed version.

https://awis.me/diagram


