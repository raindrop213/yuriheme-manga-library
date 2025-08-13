import os
import json
import requests
import re
from PIL import Image
import pillow_avif # 处理avif用，不可以删除  pip install pillow-avif-plugin
import copy

base_dir = "title/"
all_metadata = []


def create_thumbnail(source_path, target_path, width=270, overwrite=False):
    # 检查文件是否存在并根据 overwrite 参数决定是否跳过
    if os.path.exists(target_path) and not overwrite:
        return

    with Image.open(source_path) as img:
        if source_path.endswith('.avif'):
            img = img.convert('RGB')
            temp_path = source_path.replace('.avif', '_temp.jpg')
            img.save(temp_path)
            img = Image.open(temp_path)
        ratio = img.height / img.width
        new_height = int(width * ratio)
        img.thumbnail((width, new_height))
        img.save(target_path, format='JPEG', quality=90)
        if source_path.endswith('.avif'):
            os.remove(temp_path)
        print(f"Thumbnail created at {target_path}")

def fetch_and_update_metadata(metadata, subject_id):
    # 检查是否已存在非空的 date、summary 和 tags 字段
    # if (metadata.get('date') and metadata.get('summary') and metadata.get('tags')):
    if (metadata.get('date')):
        return

    api_url = f"https://api.bgm.tv/v0/subjects/{subject_id}"
    headers = {
        'User-Agent': 'raindrop213/private-blog',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        metadata['date'] = metadata.get('date', '') or data.get('date', '')
        metadata['summary'] = metadata.get('summary', '') or data.get('summary', '')
        metadata['tags'] = metadata.get('tags', []) or [tag['name'] for tag in data.get('tags', [])[:10]]
        print(f"Metadata fetched and updated for subject ID {subject_id}.")
    else:
        print(f"Failed to fetch data for subject ID {subject_id}")

def process_volumes(folder_path, metadata, overwrite=False):
    volumes = []
    first_volume_found = False  # 用于标识是否找到第一卷
    for subfolder in os.listdir(folder_path):
        if subfolder == "_ocr":
            continue
        subfolder_path = os.path.join(folder_path, subfolder)
        if os.path.isdir(subfolder_path):
            volume_details = extract_volume_details(subfolder, volumes)
            cover_image_path, page_count = process_volume_images(subfolder_path)
            if cover_image_path:
                thumbnail_path = cover_image_path.rsplit('/', 1)[0] + '.jpg'
                create_thumbnail(cover_image_path, thumbnail_path, width=340, overwrite=overwrite)

                if not first_volume_found:  # 检查是否为第一卷
                    cover_path = os.path.join(folder_path, 'cover.jpg')
                    create_thumbnail(cover_image_path, cover_path, width=340, overwrite=overwrite)
                    first_volume_found = True  # 标记第一卷已处理

            volumes.append(volume_details | {
                "coverImagePath": cover_image_path,
                "pageCount": page_count
            })
    metadata['volumes'] = volumes

def extract_volume_details(subfolder, volumes):
    parts = subfolder.split('第')
    volume_number = len(volumes) + 1
    volume_name = re.sub(r'\[.*?\]|第\d+巻', '', subfolder).strip()
    if len(parts) > 1:
        volume_parts = parts[1].split('巻')
        digits = re.findall(r'\d+', volume_parts[0])
        volume_number = int(digits[0]) if digits else volume_number
        volume_suffix = volume_parts[1].strip() if len(volume_parts) > 1 else ''
        volume_name = volume_suffix or volume_name
    return {"volumeNumber": volume_number, "volumeName": volume_name}

def process_volume_images(subfolder_path):
    image_files = sorted(os.listdir(subfolder_path))
    cover_image_path = os.path.join(subfolder_path, image_files[0]) if image_files else None
    page_count = len([file for file in image_files if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))])
    return cover_image_path.replace("\\", "/") if cover_image_path else None, page_count

for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    json_file_path = os.path.join(folder_path, "metadata.json")
    if not os.path.exists(json_file_path):
        continue
    with open(json_file_path, 'r', encoding='utf-8') as file:
        metadata = json.load(file)
        original_metadata = copy.deepcopy(metadata)  # 保存原始metadata的副本用于比较

    # print(folder)
    if metadata.get('lock', False):
        # print(f"Skipping {folder} due to lock.")  # 如果lock为true，则跳过此文件夹
        continue

    # 如果 'type' 字段不存在于 metadata 中，初始化为空列表
    metadata.setdefault('type', [])  # 这里使用 setdefault 方法确保不覆盖已有数据
    metadata.setdefault('lock', False)  # 这里使用 setdefault 方法确保不覆盖已有数据
    
    # 从 bangumi API 提取信息
    subject_id = metadata.get('url', '').split('/')[-1]
    fetch_and_update_metadata(metadata, subject_id)

    # 从文件中提取信息
    name = re.sub(r'\[.*?\]', '', folder).strip()
    authors = folder.split('[')[1].split(']')[0].split('×') if '[' in folder and ']' in folder else []
    metadata['folderName'] = folder
    metadata['name'] = name
    metadata['author'] = authors
    process_volumes(folder_path, metadata, overwrite=False) # 确保不覆盖原图

    # 比较修改后的metadata与原始metadata是否相同
    if json.dumps(metadata, ensure_ascii=False, sort_keys=True) == json.dumps(original_metadata, ensure_ascii=False, sort_keys=True):
        print(f"跳过 {folder} 的metadata.json - 内容未变更")
        continue
    else:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=4)
        print(f"已更新 {folder} 的metadata.json")

# py310/python.exe req.py