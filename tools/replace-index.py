import os
import shutil

def copy_and_rename_index_html(root_path, source_html_path, overwrite=False):
    # 列出根目录下的所有文件和文件夹
    for item in os.listdir(root_path):
        item_path = os.path.join(root_path, item)
        
        # 只处理一级文件夹
        if os.path.isdir(item_path):
            destination_path = os.path.join(item_path, 'index.html')
            
            # 检查目的地是否已存在 index.html 文件
            if not os.path.exists(destination_path) or overwrite:
                shutil.copy(source_html_path, destination_path)
                print(f'Copied and renamed index-infoExample.html to {destination_path}')
            else:
                print(f'index.html already exists in {item_path}')

if __name__ == '__main__':
    # 设置你想要遍历的根目录路径
    root_directory = 'title'
    
    # 设置你的源文件 index-infoExample.html 的路径
    source_html_file = 'title/index-infoExample.html'
    
    # 调用函数复制并重命名 index.html 文件
    copy_and_rename_index_html(root_directory, source_html_file, overwrite=True)
