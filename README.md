本项目复刻了コミック百合姫的主页
因为觉得这个主页很好看，同时也在学搭建网站，所以就拿来练练手。打造漫画仓库，海报墙墙赏心悦目！

### 关于漫画导入
本项目和 [mokuro](https://github.com/kha-white/mokuro) 进行了结合。经过我的一些修改来适配本项目，详情请看 [mokuro_r yrhm](https://github.com/raindrop213/mokuro_r/tree/yrhm/) 。
这部分还是建议先熟悉mokuro，按照自己的阅读习惯来修改吧，这里只提供一个思路。

### 文件结构
```
title
│
├─[須藤佑実] 夢の端々
│  │  cover.jpg（运行req.py同时生成的缩略图）
│  │  index.html（单部漫画的主页）
│  │  metadata.json（运行req.py为每个漫画生成元数据(Bangumi)，为了确保元数据刮削正确，该层级请严格遵循这种命名规则）
│  │  [須藤佑実] 夢の端々 第01巻.html（mokuro生成）
│  │  [須藤佑実] 夢の端々 第01巻.jpg（运行req.py同时生成的缩略图）
│  │  [須藤佑実] 夢の端々 第02巻.html
│  │  [須藤佑実] 夢の端々 第02巻.jpg
│  │
│  ├─[須藤佑実] 夢の端々 第01巻（漫画内容）
│  │      0000.jpg
│  │      ...
│  │      0160.jpg
│  │
│  ├─[須藤佑実] 夢の端々 第02巻
│  │      0000.jpg
│  │      ...
│  │      0146.jpg
│  │
│  └─_ocr（mokuro生成的ocr结果）
│      ├─[須藤佑実] 夢の端々 第01巻
│      │      0000.json
│      │      ...
│      │      0160.json
│      │
│      └─[須藤佑実] 夢の端々 第02巻
│              0000.json
│              ...
│              0146.json
│
├─panzoom.min.js（mokuro的css和js可以共用，也方便统一修改）
├─script.js
├─styles.css
│
├─index-infoExample.html（模版文件，就是每一部漫画文件夹中的index.html）
├─metadata.json（模版文件，写明了这部漫画的bangumi页面url）
│
├─title_structure.json（通过运行req2.py，先根据每部漫画url获取元数据，最后把所有漫画中的metadata合并而成，记录了所有漫画信息和对应路径。）
│
└─index.html（海报墙主页）
```

### 开发计划
- 移动端交互优化
- API：vits语音/翻译/词典
- Tags搜索