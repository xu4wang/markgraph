# diagram
Generating diagram from yaml.

# Quick Start 

```yaml
diagram:
    cols: 3   # 3 grids in X [1,2,3]
    rows: 3   # 3 grids in Y [1,2,3]
    grid_width: 200  # 200 pixels width
    grid_height: 100  # 100 pixels heigth
    padding: 0.2   # 20% blank around the nodes
    title: The Title of the Diagram
    diagram_style:
        background-color: white  # https://html-color-codes.info/color-names/
    title_style:
        key: val
    node_style:
        key: val
    image_style:
        key: val
    text_style:
        key: val
nodes:
    n1:
        title: Node 1
        title style:
                key1: val1
                key2: val2
        image: https://www.baidu.com/baidu.png
        image style:
                key1: val1
                key2: val2
        row: 1   # put it in (1,1) 
        col: 1
        node style:
            key1: val1
            key2: val2
    n2:
        title: Node 2
        image: https://www.baidu.com/baidu.png   
        row: 1  # put it in (1,3)
        col: 3  
    n3:
        title: Node 3
        image: https://www.baidu.com/baidu.png
        row: 3  # put it in (3,3)
        col: 3
edges:
    -   from: n1
        to: n2
        type: arrow
        color: red
        notes: | 
            a description for this message
            with line break.
        sn: 1  # sequence number of the edge
    -   from: n2
        to: n3
        type: arrow
        notes: single line note
        sn: 2
    -   from: n3
        to: n1
        type: arrow
        sn: 3
```

# Configurable Attributes 

## node

### title 

### image