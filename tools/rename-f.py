import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from natsort import natsorted
import os

# GUI界面的设置
def create_gui():
    root = TkinterDnD.Tk()
    root.title("重命名工具")
    root.geometry("700x500")  # 设置窗口大小

    # 输入框和标签的设置
    prefix_frame = tk.Frame(root)
    prefix_frame.pack(pady=5, fill=tk.X)
    tk.Label(prefix_frame, text="前缀：").pack(side=tk.LEFT)
    prefix_entry = tk.Entry(prefix_frame)
    prefix_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
    prefix_entry.insert(0, "[樫木祐人] ハクメイとミコチ 第")

    start_number_frame = tk.Frame(root)
    start_number_frame.pack(pady=5, fill=tk.X)
    tk.Label(start_number_frame, text="起始：").pack(side=tk.LEFT)
    start_number_entry = tk.Entry(start_number_frame)
    start_number_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
    start_number_entry.insert(0, "01")

    suffix_frame = tk.Frame(root)
    suffix_frame.pack(pady=5, fill=tk.X)
    tk.Label(suffix_frame, text="后缀：").pack(side=tk.LEFT)
    suffix_entry = tk.Entry(suffix_frame)
    suffix_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
    suffix_entry.insert(0, "巻")

    # 补齐0模式复选框
    pad_zero_var = tk.BooleanVar(value=True)
    pad_zero_checkbutton = tk.Checkbutton(root, text="补齐0", variable=pad_zero_var)
    pad_zero_checkbutton.pack(pady=5)

    # 拖拽文件提示标签
    drag_label = tk.Label(root, text="拖入要处理的 文件 / 文件夹", fg='grey')
    drag_label.pack(pady=5)

    # 列表框显示拖拽进来的路径
    listbox = tk.Listbox(root)
    listbox.pack(fill="both", expand=True, pady=10)
    listbox.drop_target_register(DND_FILES)
    listbox.dnd_bind('<<Drop>>', lambda event: drop_inside_listbox(event, listbox))

    # 重命名按钮
    rename_button = tk.Button(root, text="重命名", command=lambda: rename_items(listbox, start_number_entry, prefix_entry, suffix_entry, pad_zero_var))
    rename_button.pack(pady=5)

    # 清除按钮
    clear_button = tk.Button(root, text="清除列表", command=lambda: listbox.delete(0, 'end'))
    clear_button.pack(pady=5)

    root.mainloop()

# 处理拖拽事件
def drop_inside_listbox(event, listbox):
    file_list = event.widget.tk.splitlist(event.data)
    sorted_list = natsorted(file_list)
    for file in sorted_list:
        listbox.insert('end', file)

# 重命名逻辑
def rename_items(listbox, start_number_entry, prefix_entry, suffix_entry, pad_zero_var):
    start_number = int(start_number_entry.get())
    prefix = prefix_entry.get()
    suffix = suffix_entry.get()
    pad_zero = pad_zero_var.get()

    total_items = listbox.size()
    max_width = len(str(start_number + total_items - 1))
    start_width = len(start_number_entry.get())

    for idx, item_path in enumerate(listbox.get(0, 'end')):
        if pad_zero:
            width = max(max_width, start_width)
            formatted_number = f"{start_number + idx:0{width}}"
        else:
            formatted_number = f"{start_number + idx}"
        
        new_name = f"{prefix}{formatted_number}{suffix}"
        if os.path.isdir(item_path):
            os.rename(item_path, os.path.join(os.path.dirname(item_path), new_name))
        elif os.path.isfile(item_path):
            ext = os.path.splitext(item_path)[1]
            new_file_name = f"{new_name}{ext}"
            os.rename(item_path, os.path.join(os.path.dirname(item_path), new_file_name))

if __name__ == "__main__":
    create_gui()
