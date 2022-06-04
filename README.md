# diagram
Generating diagram from yaml.

# Quick Start 

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
    md: >
      ![](https://img0.baidu.com/it/u=2858396836,3387897168&fm=253&fmt=auto&app=138&f=JPEG)



      Markdown
  n2:
    top: 9px
    left: 637px
    width: 200
    height: 200
    md: |
      ![](https://www.json.org/img/json160.gif)

      JSON
  n3:
    top: 294px
    left: 54px
    border: false
    height: 100
    md: >
      ![](https://p3.itc.cn/q_70/images03/20210824/491f8573163b4e9aa95b465839726d34.png)

      YAML
  n4:
    top: 269px
    left: 386px
    height: 300
    width: 500
    text-align: left
    padding-left: 20px
    background-color: yellow
    border: 0px
    md: |
      ### Topic
      1. item 1
      2. item 2
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

# Configurable Attributes 

## node

### title 

### image