fetch('https://api.bgm.tv/v0/search/subjects?limit=1', {
    method: 'POST', // 指定请求方法为POST
    headers: {
        'User-Agent': 'raindrop213/my-private-blog',
        'Accept': 'application/json', // 设置接收数据的格式为JSON
        'Content-Type': 'application/json' // 设置发送数据的格式为JSON
    },
    body: JSON.stringify({ // 将请求数据转换为JSON字符串
        keyword: "女ともだちと結婚してみた",
        sort: "rank"
    })
})
.then(response => response.json()) // 将响应转换为JSON
.then(data => console.log(data)) // 打印响应数据
.catch(error => console.error('Error:', error)); // 捕获并打印出现的错误
