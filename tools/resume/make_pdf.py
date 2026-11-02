"""Render tools/resume/resume.html to downloads/DamienBoykinResume.pdf (one Letter page).
Run from the repo root: python3 tools/resume/make_pdf.py"""
import pathlib
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parents[2]
src = root / "tools/resume/resume.html"
out = root / "downloads/DamienBoykinResume.pdf"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto(src.as_uri(), wait_until="networkidle")
    pg.pdf(path=str(out), format="Letter", print_background=True, prefer_css_page_size=True)
    b.close()
print("wrote", out)
