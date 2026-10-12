"""V3: transmitted color through an organic ice lens; fine low-amplitude grain."""
from pathlib import Path
import argparse
import numpy as np
from PIL import Image
parser=argparse.ArgumentParser()
parser.add_argument('--width',type=int,default=3840)
parser.add_argument('--height',type=int,default=2160)
parser.add_argument('--time',type=float,default=0)
parser.add_argument('--output',default='fluid-python.png')
a=parser.parse_args()
y,x=np.mgrid[0:a.height,0:a.width].astype(np.float32)
x/=a.width;y/=a.height;t=a.time*.24

def gauss(z,s):return np.exp(-(z/s)**2)
def blend(c,target,amount):return c*(1-amount[...,None])+np.array(target,np.float32)*amount[...,None]
def warp(x,y):return (x+.085*np.sin(y*4.8+x*1.4+t)+.026*np.sin(y*8.1-x*3.2-t*.6),y+.095*np.sin(x*4.1-y*1.3+t*.7))
def surface(u,v):return v-.56+.24*np.sin(u*4.5-.65+t*.3)
def water(x,y):
 u,v=warp(x,y);f=surface(u,v);w=.13+.065*(1-np.clip(u,0,1))
 c=np.zeros((*x.shape,3),np.float32)+np.array([0,102,255],np.float32)
 c=blend(c,[25,49,173],np.exp(-((u-.43)/.55)**2-((v-.87)/.44)**2)*.72)
 c=blend(c,[128,142,227],np.exp(-((u-.10)/.50)**2-((v-.04)/.44)**2)*.82)
 c=blend(c,[40,174,225],gauss(f,w)*.80)
 c=blend(c,[122,200,231],gauss(f+.075,w*.70)*.30)
 c=blend(c,[20,88,206],gauss(f-.18,.12)*np.exp(-((u-.55)/.65)**2)*.36)
 g=u-.93+.12*np.sin(v*4.4+.8+t*.35)
 c=blend(c,[62,168,225],gauss(g,.22)*.62)
 return blend(c,[169,211,235],np.exp(-((u-.76)/.40)**2-((v+.04)/.27)**2)*.50)
u,v=warp(x,y);d=surface(u,v)+.045
thickness=.043+.020*(.5+.5*np.sin(u*5+t*.45))
z=np.clip((np.abs(d)-(thickness-.012))/.024,0,1)
lens=1-z*z*(3-2*z)
nx=1.08*np.cos(u*4.5-.65+t*.3);norm=np.sqrt(nx*nx+1)
shift=(.042*d/thickness+.003*np.sin(u*24+v*7+t*.4))*lens
ox=nx/norm*shift;oy=shift/norm
col=water(x,y);transmission=water(x+ox,y+oy)
transmission[:,:,0]=water(x+ox*1.1,y+oy*1.1)[:,:,0]
transmission[:,:,2]=water(x+ox*.9,y+oy*.9)[:,:,2]
col=col*(1-lens[...,None]*.85)+transmission*lens[...,None]*.85
rim=gauss(d+thickness*.8,.011)*(.4+.6*np.sin(u*6+.8)**2)
inner=gauss(d-thickness*.65,.014)
col=blend(col,[30.6,94.35,175.95],inner*.27)
col=blend(col,[153,206.55,229.5],rim*.24)
scatter=gauss(d,.060)*(.5+.5*np.sin(u*7+t*.3))
col=blend(col,[122.4,186.15,219.3],scatter*.09)
col+=np.random.default_rng(66).uniform(-1.275,1.275,(*x.shape,1)).astype(np.float32)
img=Image.fromarray(np.uint8(np.clip(col,0,255)))
out=Path(a.output)
if not out.is_absolute():out=Path(__file__).parent/out
img.save(out)
img.resize((1600,900),Image.Resampling.LANCZOS).save(out.with_name(out.stem+'-preview.jpg'),quality=95)
print(out)
