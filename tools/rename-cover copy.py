import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from tkinter import filedialog  # 添加导入filedialog
from natsort import natsorted
import shutil 
import os


extAll = ('.png', '.jpg', '.jpeg', 'webp','.gif', '.bmp','.avif', '.json')

def drop_inside_listbox(event):
    file_list = event.widget.tk.splitlist(event.data)
    sorted_list = natsorted(file_list)
    for file in sorted_list:
        event.widget.insert('end', file)

    if event.widget == listbox2:
        update_image_paths()

def get_first_image(directory):
    try:
        files = os.listdir(directory)
        files = natsorted([os.path.join(directory, file) for file in files])
        for file in files:
            if file.lower().endswith(extAll):
                return file
    except Exception as e:
        print(f"Error: {e}")
    return None

def update_image_paths():
    listbox3.delete(0, 'end')
    for idx in range(listbox2.size()):
        directory = listbox2.get(idx)
        if os.path.isdir(directory):
            image_file = get_first_image(directory)
            if image_file:
                listbox3.insert('end', image_file)

def replace_images():
    for idx in range(min(listbox1.size(), listbox3.size())):
        source_image = listbox1.get(idx)
        target_image = listbox3.get(idx)

        if os.path.isfile(source_image) and os.path.isfile(target_image):
            target_directory = os.path.dirname(target_image)
            target_filename = os.path.basename(target_image)
            new_filename = os.path.splitext(target_filename)[0] + os.path.splitext(source_image)[1]
            new_filepath = os.path.join(target_directory, new_filename)

            os.remove(target_image)
            shutil.copy2(source_image, new_filepath)

def show_rename_preview(folder_path):
    preview_window = tk.Toplevel()
    preview_window.title("重命名预览")

    text_area = tk.Text(preview_window, height=15, width=60)
    text_area.pack(padx=10, pady=10)

    extensions = extAll
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    files = natsorted(files)

    for i, filename in enumerate(files):
        ext = os.path.splitext(filename)[1]
        # i = i+1
        new_filename = f"{i:05d}{ext}"
        text_area.insert(tk.END, f"{filename} -> {new_filename}\n")

    confirm_button = tk.Button(preview_window, text="确认重命名", command=lambda: rename_images(folder_path, preview_window))
    confirm_button.pack(pady=10)

def rename_images(folder_path, preview_window):
    extensions = extAll
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    files = natsorted(files)

    for i, filename in enumerate(files):
        ext = os.path.splitext(filename)[1]
        # i = i+1
        new_filename = f"{i:05d}{ext}"
        try:
            os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
        except Exception as e:
            print(e)

    preview_window.destroy()

def rename_folders():
    for idx in range(listbox2.size()):
        folder_path = listbox2.get(idx)
        if os.path.isdir(folder_path):
            show_rename_preview(folder_path)

def reset_listbox(listbox):
    listbox.delete(0, 'end')
    if listbox == listbox2:
        listbox3.delete(0, 'end')

def create_drag_drop_listbox(root, title, include_reset_button=True):
    frame = tk.Frame(root)
    frame.pack(side="left", fill="both", expand=True, padx=5, pady=5)

    label = tk.Label(frame, text=title)
    label.pack()

    listbox = tk.Listbox(frame)
    listbox.pack(fill="both", expand=True)
    listbox.drop_target_register(DND_FILES)
    listbox.dnd_bind('<<Drop>>', drop_inside_listbox)

    if include_reset_button:
        reset_button = tk.Button(frame, text="重置", command=lambda: reset_listbox(listbox))
        reset_button.pack()

    return listbox

def save_images_to_folder():
    # 让用户选择保存图片的目标文件夹
    target_folder = filedialog.askdirectory(title="选择保存图片的文件夹")
    if not target_folder:
        return

    for idx in range(listbox3.size()):
        image_path = listbox3.get(idx)
        if os.path.isfile(image_path):
            # 提取原文件夹名称用于新文件名
            original_folder_name = os.path.basename(os.path.dirname(image_path))
            extension = os.path.splitext(image_path)[1]
            new_filename = f"{original_folder_name}{extension}"
            new_filepath = os.path.join(target_folder, new_filename)
            
            # 复制图片到目标文件夹
            shutil.copy2(image_path, new_filepath)
            print(f"图片已保存: {new_filepath}")

def main():
    root = TkinterDnD.Tk()
    root.title("文件拖拽应用")

    global listbox1, listbox2, listbox3
    listbox1 = create_drag_drop_listbox(root, "框1：拖拽文件到这里")
    listbox2 = create_drag_drop_listbox(root, "框2：拖拽目录到这里")
    listbox3 = create_drag_drop_listbox(root, "框3：每个目录下的第一张图片", include_reset_button=False)

    rename_button = tk.Button(root, text="重命名", command=rename_folders)
    rename_button.pack(side="left", padx=5, pady=5)

    replace_button = tk.Button(root, text="覆盖", command=replace_images)
    replace_button.pack(side="left", padx=5, pady=5)

    # 添加保存图片的按钮
    save_images_button = tk.Button(root, text="保存图片", command=save_images_to_folder)
    save_images_button.pack(side="left", padx=5, pady=5)

    root.mainloop()

if __name__ == "__main__":
    main()
