import os
import json

def main(base_dir, output_file_name):
    field_order = [
        "url",
        "folderName",
        "name",
        "author",
        "date",
        "summary",
        "tags",
        "type",
        "volumes"
    ]

    all_metadata = []
    for folder in os.listdir(base_dir):
        folder_path = os.path.join(base_dir, folder)
        json_file_path = os.path.join(folder_path, "metadata.json")
        
        if os.path.exists(json_file_path):
            print(json_file_path)

            # 排序
            with open(json_file_path, 'r', encoding='utf-8') as file:
                metadata = json.load(file)
            metadata = {field: metadata.get(field, None) for field in field_order}

            # 直接覆盖原文件
            with open(json_file_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)

            all_metadata.append(metadata)

    # 保存整体结构的 JSON 文件
    with open(os.path.join(base_dir, output_file_name), 'w', encoding='utf-8') as f:
        json.dump(all_metadata, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    base_dir = "title/"  # 修改为您存放 JSON 文件的实际目录
    output_file_name = 'title_structure.json'  # 输出文件名称
    main(base_dir, output_file_name)
