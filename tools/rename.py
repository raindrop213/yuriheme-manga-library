import os
from natsort import natsorted, ns
import msvcrt  # 仅适用于 Windows

def rename_images(folder_path):
    # 支持的图片格式
    extensions = ('.png', '.jpg', '.jpeg', '.webp', 'json')

    # 获取文件夹中所有支持格式的图片文件
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    # 使用 natsort 进行自然排序
    files = natsorted(files, alg=ns.PATH)

    # 显示重命名预览
    print("重命名预览：")
    for i, filename in enumerate(files):
        ext = os.path.splitext(filename)[1]
        new_filename = f"{i:04d}{ext}"
        if i < 6 or i >= len(files) - 6:
            print(f"{filename} -> {new_filename}")
        elif i == 6:
            print("...")

    # 获取用户输入
    print("是否要继续进行重命名？(y/n): ", end="", flush=True)
    while True:
        key = msvcrt.getch()
        if key in [b'y', b'Y']:
            print("y")
            break
        elif key in [b'n', b'N']:
            print("\n取消重命名。")
            return

    # 开始重命名
    for i, filename in enumerate(files):
        # 根据原文件的扩展名来设置新文件的扩展名
        ext = os.path.splitext(filename)[1]
        new_filename = f"{i:04d}{ext}"
        try:
            os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
        except Exception as e:
            print(f"重命名 {filename} 时出错: {e}")

    print("重命名完成。")

# 使用示例
rename_images(r'H:\website\yuri-hime\title\[新井隆広] Les Miserables\[新井隆広] Les Miserables 第08巻')


# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第01巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第02巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第03巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第04巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第05巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第06巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第07巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第08巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第09巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第10巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第11巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第12巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第13巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第14巻')
# rename_images(r'H:\qBit\115\【マンガ】\[岡田和人] ぱンすと。\[岡田和人] ぱンすと。 第15巻')