const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 根路由，展示书籍列表
app.get('/title', (req, res) => {
    // 这里可以读取书籍列表并传递给模板
    res.render('index', { content: '书籍列表内容' });
});

// 特定书籍的路由
app.get('/title/:book', (req, res) => {
    const bookName = req.params.book;
    // 这里可以读取特定书籍的详细信息并传递给模板
    res.render('index', { content: `书籍 ${bookName} 的详细信息` });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
