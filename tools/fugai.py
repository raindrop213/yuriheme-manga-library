import os
import shutil
import tkinter as tk
from tkinterdnd2 import TkinterDnD, DND_FILES
from natsort import natsorted

def add_files_to_listbox(listbox, file_paths):
    for file_path in natsorted(file_paths):
        listbox.insert('end', file_path)

def copy_and_rename(listbox_a, listbox_b):
    a_files = listbox_a.get(0, 'end')
    b_files = listbox_b.get(0, 'end')
    
    if len(a_files) != len(b_files):
        print("错误：A组和B组图片的数量必须相同。")
        return
    
    for a_file, b_file in zip(a_files, b_files):
        a_dir, a_name = os.path.split(a_file)
        _, b_ext = os.path.splitext(b_file)
        new_b_file = os.path.join(a_dir, a_name)
        shutil.copy(b_file, new_b_file)
        print(f"已复制并重命名 {b_file} 为 {new_b_file}")

def clear_listboxes(listbox_a, listbox_b):
    listbox_a.delete(0, 'end')
    listbox_b.delete(0, 'end')

root = TkinterDnD.Tk()
root.title('图片拖放复制和重命名')

frame = tk.Frame(root)
frame.pack(fill='both', expand=True, pady=20)

listbox_a = tk.Listbox(frame, width=50, height=15)
listbox_a.pack(side='left', fill='both', expand=True, padx=(0, 20))

listbox_b = tk.Listbox(frame, width=50, height=15)
listbox_b.pack(side='right', fill='both', expand=True)

def drop_inside_listbox(event, listbox):
    files = root.tk.splitlist(event.data)
    add_files_to_listbox(listbox, files)

listbox_a.drop_target_register(DND_FILES)
listbox_a.dnd_bind('<<Drop>>', lambda e: drop_inside_listbox(e, listbox_a))

listbox_b.drop_target_register(DND_FILES)
listbox_b.dnd_bind('<<Drop>>', lambda e: drop_inside_listbox(e, listbox_b))

copy_button = tk.Button(root, text='执行复制和重命名', command=lambda: copy_and_rename(listbox_a, listbox_b))
copy_button.pack(fill='x', pady=5)

clear_button = tk.Button(root, text='清空列表', command=lambda: clear_listboxes(listbox_a, listbox_b))
clear_button.pack(fill='x', pady=5)

root.mainloop()
