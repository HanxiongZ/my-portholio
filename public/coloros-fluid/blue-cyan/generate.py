"""Procedural ColorOS fluid backdrop. numpy + Pillow; no image inputs.
Run: python3 generate.py --width 3840 --height 2160
"""
from pathlib import Path
import argparse
import numpy as np
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--width', type=int, default=3840)
parser.add_argument('--height', type=int, default=1716)
parser.add_argument('--time', type=float, default=0)
parser.add_argument('--output', default='fluid-python.png')
a = parser.parse_args()
w, h = a.width, a.height
y, x = np.mgrid[0:h, 0:w].astype(np.float32)
x /= w; y /= h
t = a.time * .045
# Asymmetric, broad liquid folds. No luminous contour lines.
u = x + .085*np.sin(y*4.8 + x*1.4 + t) + .026*np.sin(y*8.1-x*3.2-t*.6)
v = y + .095*np.sin(x*4.1-y*1.3+t*.7)
def gauss(z, s): return np.exp(-(z/s)**2)
def blend(c, target, amount): return c*(1-amount[...,None]) + np.array(target,dtype=np.float32)*amount[...,None]
# Smoothly move from the original blue palette into adjacent cyan.
transition=np.clip((x-.35)/.60,0,1)
transition=transition*transition*(3-2*transition)
def palette(blue,cyan):
 blue=np.asarray(blue,np.float32);cyan=np.asarray(cyan,np.float32)
 return blue+(cyan-blue)*transition[...,None]
f = v-.56 + .24*np.sin(u*4.5-.65+t*.3)
# Wide ribbon tapers as it sweeps into the top-right corner.
width = .13 + .065*(1-np.clip(u,0,1))
col = np.zeros((h,w,3), np.float32) + palette([0,102,255],[0,166,214])
deep = np.exp(-(((u-.43)/.55)**2+((v-.87)/.44)**2))
col = blend(col,palette([25,49,173],[6,102,161]),deep*.72)
lilac = np.exp(-(((u-.10)/.50)**2+((v-.04)/.44)**2))
col = blend(col,palette([128,142,227],[108,191,218]),lilac*.82)
col = blend(col,palette([40,174,225],[55,185,215]),gauss(f,width)*.80)
# Low-contrast translucent shoulder, blurred over a wide area.
col = blend(col,palette([122,200,231],[143,220,233]),gauss(f+.075,width*.70)*.42)
shadow = gauss(f-.18,.12)*np.exp(-((u-.55)/.65)**2)
col = blend(col,palette([20,88,206],[13,136,190]),shadow*.36)
g = u-.93+.12*np.sin(v*4.4+.8+t*.35)
col = blend(col,palette([62,168,225],[75,195,222]),gauss(g,.22)*.62)
mist = np.exp(-(((u-.76)/.40)**2+((v+.04)/.27)**2))
col = blend(col,palette([169,211,235],[181,228,239]),mist*.50)
# Grain uses a fixed seed so frames move without sparkling noise.
rng=np.random.default_rng(66)
small=rng.normal(0,1,(max(1,h//3),max(1,w//3))).astype(np.float32)
texture=np.asarray(Image.fromarray(small,mode='F').resize((w,h),Image.Resampling.BILINEAR))
col += (rng.normal(0,1.2,(h,w,1)).astype(np.float32) + texture[...,None]*2.475)
img=Image.fromarray(np.uint8(np.clip(col,0,255)))
out=Path(a.output)
if not out.is_absolute(): out=Path(__file__).parent/out
img.save(out)
img.resize((1600,round(h*1600/w)),Image.Resampling.LANCZOS).save(out.with_name('fluid-python-preview.jpg'),quality=94)
print(out)

# Export coordinated crops for the user's two-panel composition.
split=round(w*720/1120)
img.crop((0,0,split,h)).save(out.with_name('fluid-left-blue.png'))
img.crop((split,0,w,h)).save(out.with_name('fluid-right-cyan.png'))
