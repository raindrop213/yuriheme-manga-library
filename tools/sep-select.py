import tkinter as tk
from tkinter import filedialog, messagebox
from tkinterdnd2 import DND_FILES, TkinterDnD
from PIL import Image, ImageTk
import os

class ImageSplitterApp(TkinterDnD.Tk):
    def __init__(self):
        super().__init__()

        self.title("Image Splitter")
        self.geometry("800x600")

        self.image_frame = tk.Frame(self, bg="lightgrey")
        self.image_frame.pack(fill=tk.BOTH, expand=True)

        self.split_slider = tk.Scale(self, from_=0, to=800, orient=tk.HORIZONTAL, command=self.update_split_line)
        self.split_slider.pack(fill=tk.X)

        self.split_button = tk.Button(self, text="Split Image", command=self.split_image)
        self.split_button.pack(side=tk.BOTTOM, fill=tk.X)

        self.image_canvas = tk.Canvas(self.image_frame, bg="white")
        self.image_canvas.pack(fill=tk.BOTH, expand=True)

        self.split_line = None

        self.register_drop_target(self.image_frame)
        self.image_path = None

        self.bind("<Configure>", self.on_resize)

    def register_drop_target(self, widget):
        widget.drop_target_register(DND_FILES)
        widget.dnd_bind('<<Drop>>', self.on_drop)

    def on_drop(self, event):
        self.image_path = event.data.strip('{}')
        self.display_image()

    def display_image(self):
        if self.image_path:
            self.image = Image.open(self.image_path)
            self.image_width, self.image_height = self.image.size
            self.scale_and_display_image()

    def scale_and_display_image(self):
        if self.image_path:
            canvas_width = self.image_canvas.winfo_width()
            canvas_height = self.image_canvas.winfo_height()

            # Calculate scale factor to fit image within the canvas
            scale_factor = min(canvas_width / self.image_width, canvas_height / self.image_height)
            display_width = int(self.image_width * scale_factor)
            display_height = int(self.image_height * scale_factor)

            self.display_image_resized = self.image.resize((display_width, display_height), Image.LANCZOS)
            self.tk_image = ImageTk.PhotoImage(self.display_image_resized)

            self.image_canvas.delete("all")
            x_offset = (canvas_width - display_width) // 2
            y_offset = (canvas_height - display_height) // 2
            self.image_canvas.create_image(x_offset, y_offset, anchor='nw', image=self.tk_image)

            self.split_slider.config(to=self.image_width)
            self.display_width = display_width
            self.display_height = display_height

            if self.split_line is not None:
                self.image_canvas.delete(self.split_line)
            self.split_line = self.image_canvas.create_line(self.split_slider.get() * scale_factor + x_offset, y_offset,
                                                           self.split_slider.get() * scale_factor + x_offset, display_height + y_offset,
                                                           fill="red", width=2)

    def update_split_line(self, value):
        if self.image_path:
            canvas_width = self.image_canvas.winfo_width()
            scale_factor = min(canvas_width / self.image_width, self.image_canvas.winfo_height() / self.image_height)
            x_offset = (canvas_width - self.display_width) // 2
            x = int(value) * scale_factor + x_offset
            self.image_canvas.coords(self.split_line, x, 0, x, self.display_height + (self.image_canvas.winfo_height() - self.display_height) // 2)

    def split_image(self):
        if self.image_path:
            x = self.split_slider.get()
            image = Image.open(self.image_path)
            left_image = image.crop((0, 0, x, image.height))
            right_image = image.crop((x, 0, image.width, image.height))

            base_name = os.path.basename(self.image_path)
            name, ext = os.path.splitext(base_name)
            save_directory = os.path.dirname(self.image_path)
            left_image_path = os.path.join(save_directory, f"{name}b{ext}")
            right_image_path = os.path.join(save_directory, f"{name}a{ext}")

            left_image.save(left_image_path, quality=95)
            right_image.save(right_image_path, quality=95)

            messagebox.showinfo("Image Splitter", f"Image has been split and saved!\nLeft half: {left_image_path}\nRight half: {right_image_path}")

    def on_resize(self, event):
        if self.image_path:
            self.scale_and_display_image()

if __name__ == "__main__":
    app = ImageSplitterApp()
    app.mainloop()
