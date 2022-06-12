
功能性 node 可以有两种类型：

1. switch
2. button

对于switch类型，当对应的checkbox变化时候， 会顺序执行node frontmatter中定义的语句。
对于button类型，当对应的button点击时候， 会执行node frontmatter中定义的语句。

commands定义支持让客户订制的语句列表。 就是一系列的函数，通过在frontmatter中指定函数名称和参数来执行。

类似订制外观， 删除节点， 打开上一个node，打开下一个node等，都可以通过功能性node来实现。