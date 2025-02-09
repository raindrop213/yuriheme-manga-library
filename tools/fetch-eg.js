// 编码URL中的参数
const baseUrl = 'https://api.bgm.tv/search/subject/';
const searchTerm = encodeURIComponent('新しいきみへ');
const url = `${baseUrl}${searchTerm}?type=1&responseGroup=medium&max_results=10`;

// 定义请求头
const headers = {
    'User-Agent': 'raindrop213/my-private-blog',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// 发送 GET 请求
fetch(url, {
    method: 'GET'
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log(data); // 处理响应数据
})
.catch(error => {
    console.error('There was a problem with your fetch operation:', error);
});
