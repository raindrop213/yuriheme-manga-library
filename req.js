const fs = require('fs');
const path = require('path');

const titleDir = './title'; // 替换为实际的 'title' 文件夹路径
const outputJson = path.join(titleDir, 'title_structure.json');
const indexExamplePath = path.join(titleDir, 'index-infoExample.html');

// 用于排序的函数，模仿Windows的文件排序
function windowsSort(a, b) {
    return a.localeCompare(b, 'en', { numeric: true });
}

// 检查文件是否是图片
function isImage(file) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', 'webp', '.gif', '.bmp', '.avif'];
    return imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
}

// 检查文件夹名是否符合特定格式，例如：[作者] 书名
function isValidFolderName(folderName) {
    const pattern = /^\[.+\].+/;
    return pattern.test(folderName);
}

// bangumi api
async function fetchBestMatch(keyword) {
    try {
        // 将关键词编码以适应URL格式
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://api.bgm.tv/search/subject/${encodedKeyword}?type=1&responseGroup=medium&max_results=20`;

        const response = await fetch(url, {
            method: 'GET', 
            headers: {
                'User-Agent': 'raindrop213/my-private-blog',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();

        // 检查是否有结果
        if (data.list && data.list.length > 0) {
            const firstItem = data.list[0];
            // 打印搜索的名字，以及第一条记录的日文名和中文名
            console.log(`Search: ${keyword} 【${firstItem.name} / ${firstItem.name_cn}】`);
        } else {
            console.log('No results found for the given keyword.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
    
    

// 生成结构
async function generateStructure(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let newStructure = {};

    for (const entry of entries) {
        if (entry.isDirectory() && isValidFolderName(entry.name)) {
            const fullPath = path.join(dir, entry.name);
            const volumeEntries = fs.readdirSync(fullPath, { withFileTypes: true });

            // 在这里复制和重命名 index-infoExample.html 为 index.html
            const indexDestPath = path.join(fullPath, 'index.html'); // 目标路径
            fs.copyFileSync(indexExamplePath, indexDestPath); // 复制并重命名文件

            const volumes = volumeEntries.filter(dirent => dirent.isDirectory() && dirent.name !== '_ocr')
                                        .map(dirent => dirent.name)
                                        .sort(windowsSort);

            let volumeDetails = [];
            for (const volume of volumes) {
                const volumePath = path.join(fullPath, volume);
                const imageEntries = fs.readdirSync(volumePath).sort(windowsSort);
                const imageFiles = imageEntries.filter(isImage);

                if (imageFiles.length > 0) {
                    const coverImage = path.join(volumePath, imageFiles[0]);
                    volumeDetails.push({
                        volumeNumber: volumes.indexOf(volume) + 1,
                        volumeName: volume,
                        coverImagePath: path.relative(titleDir, coverImage).replace(/\\/g, '/'),
                        pageCount: imageFiles.length
                    });
                }
            }

            const [author, title] = entry.name.split('] ').map(s => s.trim().replace('[', ''));

            // 调用 fetchBestMatch 获取数据
            const matchData = await fetchBestMatch(title);
            console.log(title);

            newStructure[entry.name] = {
                date: matchData ? matchData.date : '',
                folderName: entry.name,
                author,
                title,
                summary: matchData ? matchData.summary : '',
                bgmUrl: matchData ? matchData.bgmUrl : '',
                volumes: volumeDetails
            };
        }
    }

    return newStructure;
}



// 使用异步函数生成并写入 JSON
(async () => {
    const titleStructure = await generateStructure(titleDir);
    const titleArray = Object.values(titleStructure);
    fs.writeFileSync(outputJson, JSON.stringify(titleArray, null, 2));
    console.log('Title structure JSON updated:', outputJson);
})();