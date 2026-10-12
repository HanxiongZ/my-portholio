"""Original procedural cyan / ColorOS blue / violet artwork; no image inputs.

Generate the static fallback and matched mobile crops with numpy + Pillow.
Time is in shader seconds (the site's renderer advances it at 3.375x).
"""
from pathlib import Path
import argparse
import numpy as np
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int, default=2560)
parser.add_argument('--height', type=int, default=1141)
parser.add_argument('--time', type=float, default=0)
args = parser.parse_args()
w, h = args.width, args.height
y, x = np.mgrid[0:h, 0:w].astype(np.float32)
x = (x + .5) / w
y = (y + .5) / h
t = args.time * .065
u = x + .035 * np.sin(y * 4 + t)
v = y + .045 * np.sin(x * 3.8 - t * .8)

def field(px, py, cx, cy, rx, ry):
    return np.exp(-2 * (((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2))

def smoothstep(lo, hi, value):
    f = np.clip((value - lo) / (hi - lo), 0, 1)
    return f * f * (3 - 2 * f)

cyan = field(u, v, .09 + .055*np.sin(t*.8), .48 + .07*np.cos(t*.7), .61, .82)
blue = field(u, v, .48 + .07*np.cos(t*.6), .79 + .07*np.sin(t), .55, .76)
violet = field(u, v, .96 + .05*np.cos(t*.7), .62 + .09*np.sin(t*.8), .54, .85)
color = (cyan[..., None]*[.055,.73,.83] + blue[..., None]*[0,.4,1] + violet[..., None]*[.48,.29,.88]) / (cyan+blue+violet+.0001)[..., None]
coverage = 1 - np.exp(-(cyan + blue + violet) * 2.6)
top = 1 - smoothstep(-.10, .43, y)
corner = field(x,y,0,0,.46,.38) + field(x,y,1,0,.46,.38)
mist = np.clip(top*.52 + corner*.15,0,.72)
amount = (coverage*(1-mist))[...,None]
color = np.array([.935,.945,.95])*(1-amount) + color*amount
# Fixed fine grain, without resampling or soft low-frequency noise.
grain = (np.random.default_rng(66).random((h,w,1))-.5)*.037
img = Image.fromarray(np.uint8(np.clip(color+grain,0,1)*255))
root = Path(__file__).parent
img.save(root/'fluid-python.png')
img.resize((1600,round(h*1600/w)),Image.Resampling.LANCZOS).save(root/'fluid-python-preview.jpg',quality=95)
img.crop((0,0,round(w*768/1178),h)).save(root/'fluid-left-cyan.png')
img.crop((round(w*788/1178),0,w,h)).save(root/'fluid-right-violet.png')
print(root/'fluid-python.png')
