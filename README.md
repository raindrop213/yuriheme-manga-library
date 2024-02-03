本项目复刻了コミック百合姫的主页
因为觉得这个主页很好看，同时也在学搭建网站，所以就拿来练练手。打造漫画仓库，媒体墙赏心悦目！

### 关于漫画导入
本项目和 [mokuro](https://github.com/kha-white/mokuro) 进行了结合。经过我的一些修改改来适配本项目，详情请看  [mokuro_r yrhm](https://github.com/raindrop213/mokuro_r/tree/yrhm/) 。


### 文件结构
```
title
    [博] 明日ちゃんのセーラー服  # 为了确保元数据刮削正确（来源：Bangumi），请严格遵循这种命名规则
            _ocr
            明日ちゃんのセーラー服 第1巻
                0001.jpg
                ...
            明日ちゃんのセーラー服 第2巻
                0001.jpg
                ...
            ...

            明日ちゃんのセーラー服 第1巻.html
            明日ちゃんのセーラー服 第2巻.html
            ...

            index.html

    [芦奈野ひとし] コトノバドライブ
            _ocr
            コトノバドライブvol.1
            コトノバドライブvol.2
            コトノバドライブvol.1.html
            コトノバドライブvol.2.html
            index.html

    [樫木祐人] ハクメイとミコチ
            _ocr
            [樫木祐人] ハクメイとミコチ 第01巻
            [樫木祐人] ハクメイとミコチ 第01巻.html
            index.html

    index.html
    index-infoExample.html  # 是下一层文件中index.html 模板
	title_structure.json  # 运行req.js能读取并储存所有漫画的信息
	title-list.js
	volume-list.js

    panzoom.min.js  # mokuro的css和js可以共用
    script.js
    styles.css
```
