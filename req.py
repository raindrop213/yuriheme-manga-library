import os
import json
import requests
import re
from PIL import Image
import pillow_avif

base_dir = "title/"
all_metadata = []


def create_thumbnail(source_path, target_path, width=220):

    # Check if the thumbnail already exists
    if os.path.exists(target_path):
        print(f"Thumbnail already exists: {target_path}")
        return

    # Open the original image
    with Image.open(source_path) as img:
        # If the source is AVIF, convert to JPEG
        if source_path.endswith('.avif'):
            img = img.convert('RGB')  # Convert AVIF to RGB format suitable for JPEG
            temp_path = source_path.replace('.avif', '_temp.jpg')
            img.save(temp_path)
            img = Image.open(temp_path)
        
        # Calculate new dimensions to maintain aspect ratio
        ratio = img.height / img.width
        new_height = int(width * ratio)
        
        # Resize image and save as JPEG
        img.thumbnail((width, new_height))
        img.save(target_path, format='JPEG', quality=90)
        print(f"Thumbnail created at {target_path}")

        # Clean up temporary file if needed
        if source_path.endswith('.avif'):
            os.remove(temp_path)

for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    json_file_path = os.path.join(folder_path, "metadata.json")
    if not os.path.exists(json_file_path):
        continue

    with open(json_file_path, 'r', encoding='utf-8') as file:
        metadata = json.load(file)
        original_metadata = metadata.copy()

        metadata['folderName'] = folder

        # # 检查关键字段是否已完整且非空
        # if all(key in metadata and metadata[key] for key in ['date', 'name', 'author', 'summary', 'tags', 'volumes']):
        #     all_metadata.append(metadata)
        #     continue  # 如果所有字段都已完整，跳过此文件夹

        url = metadata.get('url')
        subject_id = url.split('/')[-1]

        api_url = f"https://api.bgm.tv/v0/subjects/{subject_id}"
        headers = {
            'User-Agent': 'raindrop213/private-blog',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            name = re.sub(r'\[.*?\]', '', folder).strip()
            authors = folder.split('[')[1].split(']')[0].split('×') if '[' in folder and ']' in folder else ["未知作者"]
            
            volumes = []
            for subfolder in os.listdir(folder_path):
                if subfolder == "_ocr":
                    continue
                subfolder_path = os.path.join(folder_path, subfolder)
                if os.path.isdir(subfolder_path):
                    parts = subfolder.split('第')
                    if len(parts) > 1:
                        volume_parts = parts[1].split('巻')
                        digits = re.findall(r'\d+', volume_parts[0])
                        volume_number = int(digits[0]) if digits else len(volumes) + 1
                        volume_suffix = volume_parts[1].strip() if len(volume_parts) > 1 else ''
                        volume_name = volume_suffix if volume_suffix else re.sub(r'\[.*?\]|第\d+巻', '', subfolder).strip()
                    else:
                        volume_number = len(volumes) + 1
                        volume_name = re.sub(r'\[.*?\]|第\d+巻', '', subfolder).strip()
                    
                    image_files = sorted(os.listdir(subfolder_path))
                    cover_image_path = os.path.join(subfolder_path, image_files[0]) if image_files else None
                    page_count = len([file for file in image_files if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.avif'))])
                    
                    cover_image_path = cover_image_path.replace("\\", "/") if cover_image_path else None

                    if cover_image_path:
                        thumbnail_path = cover_image_path.rsplit('/', 1)[0] + '.jpg'
                        create_thumbnail(cover_image_path, thumbnail_path)

                    volumes.append({
                        "volumeNumber": volume_number,
                        "volumeName": volume_name,
                        "coverImagePath": cover_image_path,
                        "pageCount": page_count
                    })

            metadata['date'] = original_metadata.get('date') if original_metadata.get('date') else data.get('date', '')
            metadata['name'] = original_metadata.get('name') if original_metadata.get('name') else name
            metadata['author'] = original_metadata.get('author') if original_metadata.get('author') else authors
            metadata['summary'] = original_metadata.get('summary') if original_metadata.get('summary') else data.get('summary', '')
            metadata['tags'] = original_metadata.get('tags') if original_metadata.get('tags') else [tag['name'] for tag in data.get('tags', [])[:10]]
            metadata['volumes'] = volumes

            print(metadata['name'])

            with open(json_file_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)
        else:
            print(f"Failed to fetch data for subject ID {subject_id}")

        all_metadata.append(metadata)

# 写入总结构化文件
with open(os.path.join(base_dir, 'title_structure.json'), 'w', encoding='utf-8') as f:
    json.dump(all_metadata, f, ensure_ascii=False, indent=4)
