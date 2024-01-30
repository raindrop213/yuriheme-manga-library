import requests
import json

url = 'https://api.bgm.tv/v0/search/subjects?limit=10'

headers = {
    'User-Agent': 'raindrop213/my-private-blog',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

data = {
    "keyword": "女ともだちと結婚してみた",
    "sort": "rank",
    "filter": {
        "type": [1]
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.status_code, response.text)
