#!/usr/bin/env python3
"""Erstellt App-Icons. Einmalig ausführen: python3 make_icons.py"""
try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable,"-m","pip","install","Pillow","--break-system-packages","-q"])
    from PIL import Image, ImageDraw

import os, math
os.makedirs("assets", exist_ok=True)

def make(size, path):
    img = Image.new("RGBA",(size,size),(5,8,15,255))
    d = ImageDraw.Draw(img)
    m = size//10
    cx = cy = size//2
    r = size//2 - m - 2
    # outer circle
    d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=(45,212,191,220), width=max(3,size//40))
    # horizontal lines
    for f in [0.3,0.5,0.7]:
        y=int(cy-r+2*r*f)
        hw=int(math.sqrt(max(0,r**2-(y-cy)**2)))
        d.line([cx-hw,y,cx+hw,y], fill=(45,212,191,100), width=max(1,size//80))
    # vertical line
    d.line([cx,cy-r,cx,cy+r], fill=(45,212,191,100), width=max(1,size//80))
    img.save(path,"PNG")
    print(f"  ✓ {path}")

print("Erstelle Icons …")
make(1024,"assets/icon.png")
make(1024,"assets/adaptive-icon.png")
make(1242,"assets/splash.png")
print("Fertig!")
