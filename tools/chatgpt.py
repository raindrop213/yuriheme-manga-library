import requests
import json

# 设置请求的 URL 和头部信息
url = "https://api.ohmygpt.com/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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",  # 请替换 $OPENAI_API_KEY 为你的 API 密钥
}

# 设置请求的数据
data = {
    "model": "gpt-3.5-turbo-0613",
    "messages": [{"role": "user", "content": "跳多高才能跳过广告"}],
    "temperature": 0.7
}

# 发送 POST 请求
response = requests.post(url, headers=headers, data=json.dumps(data))

# 打印响应的内容
print(response.text)