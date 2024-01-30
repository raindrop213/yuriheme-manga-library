const fs = require('fs');
const path = require('path');

const titleDir = './title'; // 替换为实际的 'title' 文件夹路径
const outputJson = path.join(titleDir, 'title_structure.json');

// 用于排序的函数，模仿Windows的文件排序
function windowsSort(a, b) {
    return a.localeCompare(b, 'en', { numeric: true });
}

// 检查文件是否是图片
function isImage(file) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', 'webp', '.gif', '.bmp'];
    return imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
}

// 检查文件夹名是否符合特定格式，例如：[作者] 书名
function isValidFolderName(folderName) {
    const pattern = /^\[.+\].+/;
    return pattern.test(folderName);
}

// 读取目录并生成结构
function generateStructure(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let structure = [];

    entries.forEach(entry => {
        if (entry.isDirectory() && isValidFolderName(entry.name)) {
            const fullPath = path.join(dir, entry.name);
            const volumeEntries = fs.readdirSync(fullPath, { withFileTypes: true });

            // 过滤掉 _ocr 文件夹
            const volumes = volumeEntries.filter(dirent => dirent.isDirectory() && dirent.name !== '_ocr')
                                        .map(dirent => dirent.name)
                                        .sort(windowsSort);

            let volumeDetails = [];
            volumes.forEach((volume, index) => {
                const volumePath = path.join(fullPath, volume);
                const imageEntries = fs.readdirSync(volumePath).sort(windowsSort);
                const imageFiles = imageEntries.filter(isImage);

                if (imageFiles.length > 0) {
                    const coverImage = path.join(volumePath, imageFiles[0]);
                    volumeDetails.push({ 
                        volumeNumber: index + 1, 
                        volumeName: volume, 
                        coverImagePath: path.relative(titleDir, coverImage).replace(/\\/g, '/'),
                        pageCount: imageFiles.length // 添加页数
                    });
                }
            });

            const [author, title] = entry.name.split('] ').map(s => s.trim().replace('[', ''));
            structure.push({ folderName: entry.name, author, title, volumes: volumeDetails });
        }
    });

    return structure;
}


// 创建JSON文件
const titleStructure = generateStructure(titleDir);
fs.writeFileSync(outputJson, JSON.stringify(titleStructure, null, 2));

console.log('Title structure JSON created:', outputJson);
