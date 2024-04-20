import os
import json

def load_and_sort_metadata(json_file_path, field_order):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        metadata = json.load(file)
    
    # 按指定顺序重新组织数据
    sorted_metadata = {field: metadata.get(field, None) for field in field_order}
    return sorted_metadata

def save_individual_metadata(sorted_metadata, json_file_path):
    # 保存规整后的单个 JSON 文件
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_metadata, f, ensure_ascii=False, indent=4)

def save_structure(all_metadata, output_file_path):
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(all_metadata, f, ensure_ascii=False, indent=4)

def main(base_dir, output_file_name):
    field_order = [
        "url",
        "folderName",
        "date",
        "summary",
        "tags",
        "name",
        "author",
        "volumes"
    ]

    all_metadata = []
    for folder in os.listdir(base_dir):
        folder_path = os.path.join(base_dir, folder)
        json_file_path = os.path.join(folder_path, "metadata.json")
        
        if os.path.exists(json_file_path):
            metadata = load_and_sort_metadata(json_file_path, field_order)
            all_metadata.append(metadata)

            # 保存每个单独规整好的 metadata 文件
            sorted_json_file_path = os.path.join(folder_path, "sorted_metadata.json")
            save_individual_metadata(metadata, sorted_json_file_path)

    # 保存整体结构的 JSON 文件
    save_structure(all_metadata, os.path.join(base_dir, output_file_name))

if __name__ == "__main__":
    base_dir = "title/"  # 修改为您存放 JSON 文件的实际目录
    output_file_name = 'title_structure2.json'  # 输出文件名称
    main(base_dir, output_file_name)
