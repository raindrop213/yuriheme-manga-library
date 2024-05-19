import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from tkinter import messagebox, StringVar
from natsort import natsorted, ns
import os

def rename_images_gui(folder_path, num_digits):
    extensions = ('.png', '.jpg', '.jpeg', '.webp', 'json')
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    files = natsorted(files, alg=ns.PATH)

    digit_format = f"{{:0{num_digits}d}}"
    preview_list = []
    if len(files) <= 10:
        for i, filename in enumerate(files):
            preview_list.append(f"{filename} -> {digit_format.format(i)}{os.path.splitext(filename)[1]}")
    else:
        for i, filename in enumerate(files[:5]):
            preview_list.append(f"{filename} -> {digit_format.format(i)}{os.path.splitext(filename)[1]}")
        preview_list.append("...")
        for i, filename in enumerate(files[-5:], start=len(files) - 5):
            preview_list.append(f"{filename} -> {digit_format.format(i)}{os.path.splitext(filename)[1]}")

    preview = "\n".join(preview_list)

    if messagebox.askyesno("Rename Preview", f"Folder: {folder_path}\nPreview:\n{preview}\n\nContinue with renaming?"):
        for i, filename in enumerate(files):
            ext = os.path.splitext(filename)[1]
            new_filename = digit_format.format(i) + ext
            try:
                os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
            except Exception as e:
                messagebox.showerror("Error", f"Error renaming {filename}: {e}")
        messagebox.showinfo("Completed", f"Renaming completed for folder: {folder_path}")

def on_drop(event):
    paths = event.data.strip('{}').split('} {')
    num_digits = digits_var.get()
    if num_digits.isdigit():
        num_digits = int(num_digits)
        for path in paths:
            folder_path = path.strip('{}')
            if os.path.isdir(folder_path):
                rename_images_gui(folder_path, num_digits)
            else:
                messagebox.showerror("Error", f"{folder_path} is not a valid folder.")
    else:
        messagebox.showerror("Error", "Please enter a valid number of digits.")

root = TkinterDnD.Tk()
root.title("Image Renamer")
root.geometry("600x400")

label = tk.Label(root, text="Drag and drop one or more folders here", pady=20)
label.pack()

digits_var = StringVar(root, value='4')  # 默认值设置为4
digits_label = tk.Label(root, text="Enter the number of digits:")
digits_label.pack()

digits_entry = tk.Entry(root, textvariable=digits_var)
digits_entry.pack()

frame = tk.Frame(root, bg="lightgray", width=500, height=300)
frame.pack(pady=20)
frame.drop_target_register(DND_FILES)
frame.dnd_bind('<<Drop>>', on_drop)

root.mainloop()
