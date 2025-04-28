import os
import zipfile

'''
把一个文件夹中的所有epub/cbz/zip解压并提取里面所有图片文件

'''

def extract_images_from_epub(epub_path, output_dir):
    # 从 EPUB 文件路径获取书名
    epub_name = os.path.splitext(os.path.basename(epub_path))[0]
    # 创建与 EPUB 文件名相对应的子文件夹路径
    epub_output_dir = os.path.join(output_dir, epub_name)
    
    # 确保子文件夹不存在才进行处理
    if not os.path.exists(epub_output_dir):
        os.makedirs(epub_output_dir)

        image_count = 0  # 初始化图片计数器
        # 打开 EPUB 文件（EPUB 本质上是一个 ZIP 文件）
        with zipfile.ZipFile(epub_path, 'r') as zip_ref:
            # 列出压缩包中的所有文件
            for file in zip_ref.namelist():
                print(file)
                # 检查文件是否是图片
                if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                    # 构造图片输出的路径
                    image_name = os.path.basename(file)
                    output_image_path = os.path.join(epub_output_dir, image_name)
                    # 提取图片到指定路径
                    with zip_ref.open(file) as image_file:
                        with open(output_image_path, 'wb') as f:
                            f.write(image_file.read())
                    image_count += 1  # 更新图片计数

        # 打印处理完的书名和图片总数
        print(f"Completed: {epub_name}, Total images: {image_count}")

def extract_images_from_directory(directory_path, output_dir):
    # 遍历目录中的所有文件
    for filename in os.listdir(directory_path):
        if filename.endswith('.epub'):
            epub_path = os.path.join(directory_path, filename)
            extract_images_from_epub(epub_path, output_dir)

# 使用示例
name = "F:\ebook\[ばったん] そしてヒロインはいなくなった"
directory_path = name  # EPUB 文件所在的目录
output_dir = name + "2"    # 图片输出目录
extract_images_from_directory(directory_path, output_dir)
