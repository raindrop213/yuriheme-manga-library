import os

def rename_images(folder_path):
    # 支持的图片格式
    extensions = ('.png', '.jpg', '.jpeg', '.webp')

    # 获取文件夹中所有支持格式的图片文件
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    # 按文件名排序
    files.sort()
    # print(files)

    # 开始重命名
    for i, filename in enumerate(files):
        # 根据原文件的扩展名来设置新文件的扩展名
        ext = os.path.splitext(filename)[1]
        new_filename = f"{i:04d}{ext}"
        try:
            os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
        except:
            pass

# 使用示例：
folder_path = r'F:\qBit\Website\yuri-hime\reader\コミック百合姫 2024年3月号'
rename_images(folder_path)
