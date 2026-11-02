"""Resize/compress site photos in place and build gallery thumbnails.
Run from repo root: python3 tools/optimize_images.py
Originals stay recoverable from git history."""
import glob, os, re
from PIL import Image, ImageOps

ROTATE_CW = {"images/gallery/gallery-13.jpg", "images/gallery/gallery-14.jpg"}  # stored sideways

def save(im, path, max_px, q):
    im = im.convert("RGB")
    im.thumbnail((max_px, max_px), Image.LANCZOS)
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)

for f in glob.glob("images/**/*.jpg", recursive=True):
    if "/thumbs/" in f:
        continue
    im = ImageOps.exif_transpose(Image.open(f))
    if f in ROTATE_CW and im.width > im.height:  # guard: only rotate once
        im = im.rotate(-90, expand=True)
    save(im, f, 2000, 82)
    if f.startswith("images/gallery/"):
        os.makedirs("images/gallery/thumbs", exist_ok=True)
        save(im, "images/gallery/thumbs/" + os.path.basename(f), 700, 78)
print("done")
