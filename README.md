# diagram
Generating diagram from yaml.

# Usage 

```yaml
settings:
    cols: 3   # 3 grids in X [1,2,3]
    rows: 3   # 3 grids in Y [1,2,3]
    padding: 0.2   # 20% blank around the nodes
    tittle: The Tittle of the Diagram
    background-color: white  # https://html-color-codes.info/color-names/
nodes:
    n1:
        title: Node 1
        image: https://www.baidu.com/baidu.png
        row: 1   # put it in (1,1) 
        col: 1
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