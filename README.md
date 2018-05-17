## 常用的包
* commander
命令行工具
```
command(rmdir <dir> [...otherDir])
<dir>表示必须的输入参数，otherDir表示可选的输入参数
```

* chalk
用于样式化输出字符信息

* read-metadata
用于读取yml或者json文件，并转换为对象
* metalsmith
用于将一个目录中的文件拷贝到目标目录中，在拷贝之前可以自定义插件对文件进行处理

* async
提供各种执行异步(同步)任务的方式

* inquirer
用于和用户进行信息交换

* consolidate
提供各种模板处理引擎的功能

* handlebars
一种模板引擎

## 使用
#### 安装
```
npm install cli-wei -g
```
#### 常用命令
```
cli-wei <模板的路径> <项目名称>
```
