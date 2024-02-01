function fetchBestMatch(keyword) {
    fetch('https://api.bgm.tv/v0/search/subjects?limit=5', {
        method: 'POST', 
        headers: {
            'User-Agent': 'raindrop213/my-private-blog',
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            keyword: keyword,
            sort: "rank",
            filter: {
                "type": [1],
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        let bestMatch = null;
        let maxTagCount = 0;

        for (const item of data.data) {
            if (item.name === keyword || item.name_cn === keyword) {
                bestMatch = item;
                break;
            }

            const tagCount = item.tags.reduce((acc, tag) => acc + tag.count, 0);
            if (tagCount > maxTagCount) {
                maxTagCount = tagCount;
                bestMatch = item;
            }
        }

        if (bestMatch) {
            bestMatch.bgmUrl = `https://bgm.tv/subject/${bestMatch.id}`;
            console.log(bestMatch);
        } else {
            console.log('No match found');
        }
    })
    .catch(error => console.error('Error:', error));
}

// 使用函数
fetchBestMatch("コトノバドライブ");
