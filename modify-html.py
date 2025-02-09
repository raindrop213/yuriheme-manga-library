import os

# 指定要遍历的文件夹路径
directory = 'title'  # 替换为实际路径

# 遍历文件夹及其子文件夹
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 替换目标字符串
            new_content = content.replace('</link></head>', '</link><script src="../../analytics.js"></script></head>')

            # 如果有替换再写回文件
            if content != new_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print('替换完成。')