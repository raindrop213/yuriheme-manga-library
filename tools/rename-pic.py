import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from tkinter import messagebox
from natsort import natsorted, ns
import os

def rename_images_gui(folder_path):
    extensions = ('.png', '.jpg', '.jpeg', '.webp', 'json')
    files = [f for f in os.listdir(folder_path) if f.endswith(extensions)]
    files = natsorted(files, alg=ns.PATH)

    preview_list = []
    if len(files) <= 10:
        for i, filename in enumerate(files):
            preview_list.append(f"{filename} -> {i:04d}{os.path.splitext(filename)[1]}")
    else:
        for i, filename in enumerate(files[:5]):
            preview_list.append(f"{filename} -> {i:04d}{os.path.splitext(filename)[1]}")
        preview_list.append("...")
        for i, filename in enumerate(files[-5:], start=len(files) - 5):
            preview_list.append(f"{filename} -> {i:04d}{os.path.splitext(filename)[1]}")

    preview = "\n".join(preview_list)

    if messagebox.askyesno("Rename Preview", f"Folder: {folder_path}\nPreview:\n{preview}\n\nContinue with renaming?"):
        for i, filename in enumerate(files):
            ext = os.path.splitext(filename)[1]
            new_filename = f"{i:04d}{ext}"
            try:
                os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
            except Exception as e:
                messagebox.showerror("Error", f"Error renaming {filename}: {e}")

        messagebox.showinfo("Completed", f"Renaming completed for folder: {folder_path}")

def on_drop(event):
    paths = event.data.strip('{}').split('} {')  # Improved splitting logic
    for path in paths:
        folder_path = path.strip('{}')
        if os.path.isdir(folder_path):
            rename_images_gui(folder_path)
        else:
            messagebox.showerror("Error", f"{folder_path} is not a valid folder.")

root = TkinterDnD.Tk()
root.title("Image Renamer")
root.geometry("600x400")

label = tk.Label(root, text="Drag and drop one or more folders here", pady=20)
label.pack()

frame = tk.Frame(root, bg="lightgray", width=500, height=300)
frame.pack(pady=20)
frame.drop_target_register(DND_FILES)
frame.dnd_bind('<<Drop>>', on_drop)

root.mainloop()
