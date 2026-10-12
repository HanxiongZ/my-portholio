import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import fkLogo from '../../assets/fk-logo-primary.svg';

export type District = { id: number; group: T.Group; materials: T.MeshStandardMaterial[]; ring: T.Mesh; motion?: T.Object3D; label: T.Vector3 };

const white = '#edece7', glass = '#6a8991', ink = '#32424a';
const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);

// Shared geometries outlive a single city, so disposeCity has to skip them.
const shared = new Set<T.BufferGeometry>();
const hold = <G extends T.BufferGeometry>(g: G) => { shared.add(g); return g; };
const discGeo = hold(new T.CylinderGeometry(1, 1, 1, 64));
const haloGeo = hold(new T.TorusGeometry(1, .011, 6, 128));
const blobGeo = hold(new T.IcosahedronGeometry(1, 1));

// Corner radius is worked out in world units, so every volume reads equally
// soft whatever its size — thin panels stay crisp, masses turn pillowy.
const softGeo = (w: number, h: number, d: number) =>
  new RoundedBoxGeometry(w, h, d, 3, Math.min(Math.min(w, h, d) * .34, .22));
// Cheap deterministic jitter, so nothing sits on a perfect grid.
const wobble = (a: number, b: number) => (Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1;

export function createDistrict(id: number, x: number, z: number, turn = 0): District {
  const group = new T.Group(); group.position.set(x, 0, z); group.rotation.y = turn; group.userData.projectId = id;
  const materials: T.MeshStandardMaterial[] = [];
  const cache = new Map<string, T.MeshStandardMaterial>();
  function material(color: string, keep = false) {
    const key = color + keep;
    if (cache.has(key)) return cache.get(key)!;
    const m = new T.MeshStandardMaterial({color: keep ? color : '#e8e7e2', roughness:.68, metalness:.04});
    m.userData.targetColor = new T.Color(color);
    m.userData.neutralColor = new T.Color(keep ? color : color === '#158b50' ? '#8e9c94' : color === ink || color === glass ? '#9daaa6' : '#e3e2dc');
    m.color.copy(m.userData.neutralColor); materials.push(m); cache.set(key,m);return m;
  }
  function mesh(g: T.BufferGeometry,c: string,p: T.Vector3,parent: T.Object3D=group) {
    const o=new T.Mesh(g,material(c));o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
  }
  function box(name:string,p:number[],s:number[],c=white,parent:T.Object3D=group) {
    const o=mesh(softGeo(s[0],s[1],s[2]),c,v(p[0],p[1],p[2]),parent);o.name=name;return o;
  }
  function cylinder(p:number[],r:number,h:number,c:string,parent:T.Object3D=group) { return mesh(new T.CylinderGeometry(r,r,h,20),c,v(...p as [number,number,number]),parent); }
  // Flattened ellipse — the workhorse for ground, pads and stepping stones.
  function disc(p:number[],rx:number,rz:number,h:number,c:string,parent:T.Object3D=group) {
    const o=mesh(discGeo,c,v(p[0],p[1],p[2]),parent);o.scale.set(rx,h,rz);return o;
  }
  // Half-cylinder laid on its side: barrel-vaulted roofs instead of flat slabs.
  function vault(p:number[],r:number,len:number,squash:number,c:string,parent:T.Object3D=group) {
    const g=new T.CylinderGeometry(r,r,len,26,1,false,0,Math.PI);g.rotateZ(Math.PI/2);
    const o=mesh(g,c,v(p[0],p[1],p[2]),parent);o.scale.set(1,squash,1);return o;
  }
  // A gently bowed wall: an arc band extruded upward. Kills every flat facade.
  function arcWall(p:number[],radius:number,thickness:number,sweep:number,height:number,c:string,parent:T.Object3D=group) {
    const shape=new T.Shape(),a0=-Math.PI/2-sweep/2,a1=-Math.PI/2+sweep/2;
    shape.absarc(0,0,radius+thickness/2,a0,a1,false);shape.absarc(0,0,radius-thickness/2,a1,a0,true);
    const g=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:2,curveSegments:44});
    g.rotateX(-Math.PI/2);return mesh(g,c,v(p[0],p[1],p[2]),parent);
  }
  function beam(a:T.Vector3,b:T.Vector3,r:number,c:string,parent:T.Object3D=group) {
    const o=mesh(new T.CylinderGeometry(r,r,a.distanceTo(b),6),c,a.clone().add(b).multiplyScalar(.5),parent);
    o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;
  }
  // Overlapping lobes rather than one neat sphere.
  function foliage(x:number,y:number,z:number,r:number,c:string,lobes=3) {
    for(let i=0;i<lobes;i++) {
      const o=mesh(blobGeo,c,v(x+Math.sin(i*2.1)*r*.5,y+Math.cos(i*1.7)*r*.36,z+Math.cos(i*2.6)*r*.5));
      o.scale.setScalar(r*(1-i*.13));o.rotation.set(i*1.1,i*1.9,i*.7);
    }
  }
  function tree(x:number,z:number,s=1,pine=false) {
    const lean=wobble(x,z)*.09;
    const trunk=cylinder([x,.44*s,z],.036*s,.58*s,'#826d54');trunk.rotation.z=lean;
    if(pine) for(let i=0;i<3;i++) {const c=mesh(new T.ConeGeometry((.28-i*.062)*s,.62*s,9),'#5c8963',v(x+lean*i*.3,(.68+i*.23)*s,z));c.rotation.z=lean*.5;}
    else foliage(x+lean,.88*s,z,.24*s,'#78a67c');
  }
  function shrub(x:number,z:number,r=.17,c='#87ab7d') { const o=mesh(blobGeo,c,v(x,r*.72,z));o.scale.set(r*1.25,r*.8,r);o.rotation.y=wobble(z,x)*3; }
  function stones(from:number[],to:number[],count:number,bend=.35) {
    for(let i=0;i<count;i++) {const k=i/(count-1),bow=Math.sin(k*Math.PI)*bend;
      disc([from[0]+(to[0]-from[0])*k+bow,.155,from[1]+(to[1]-from[1])*k],.20,.15,.02,'#c8c6b8');}
  }
  function label(text:string,p:number[],w:number,h:number,fg=ink,bg='transparent',parent:T.Object3D=group) {
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
    const ctx=canvas.getContext('2d')!;if(bg!=='transparent'){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);}
    ctx.fillStyle=fg;ctx.font=`600 ${text.length>16?66:110}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,135,960);
    const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
    const m=new T.MeshStandardMaterial({map:tex,transparent:true,roughness:.7,depthWrite:false,side:T.DoubleSide});
    const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(p[0],p[1],p[2]);parent.add(o);return o;
  }

  // Each project sits on its own soft island rather than inside a square plot.
  disc([0,-.03,0],2.66,2.26,.10,'#dcdfd2');
  disc([0,.06,0],2.55,2.15,.20,white);
  const accents:Record<number,string>={1:'#c67654',2:'#5b87ad',3:'#d5a53a',4:'#43856d',5:'#36a267'};
  const ring=new T.Mesh(haloGeo,new T.MeshStandardMaterial({color:accents[id],transparent:true,opacity:0}));
  ring.rotation.x=-Math.PI/2;ring.scale.set(2.63,2.23,1);ring.position.y=.17;group.add(ring);
  for(let i=0;i<5;i++){const a=2.1+i*.34;shrub(Math.cos(a)*2.0,Math.sin(a)*1.7,.14+wobble(i,id)*.05);}

  let motion: T.Object3D|undefined;
  if(id===3) {
    // Open workshop bay under a barrel vault, workbench, eight-wheel harvester.
    box('Workshop',[.5,.94,-.85],[2.8,1.55,1.86],'#c4c6bd');
    const roof=vault([.5,1.70,-.85],1.0,3.0,.56,white);roof.name='Workshop vault';
    box('Ridge light',[.5,2.24,-.85],[2.1,.05,.3],glass);
    box('Garage opening',[.45,.81,.10],[1.72,1.25,.03],ink);
    box('Yellow lintel',[.45,1.53,.15],[2.0,.14,.13],'#e8b944');
    label('KOMATSU FOREST',[.47,1.68,.181],2.40,.24);
    box('Workbench',[1.34,.47,.16],[.4,.12,.50],'#8a7564');
    const machine=new T.Group();machine.position.set(.12,.24,1.0);machine.rotation.y=-.22;group.add(machine);
    box('Harvester chassis',[0,.35,0],[2.12,.22,.74],ink,machine);
    box('Engine housing',[-.61,.70,0],[.87,.53,.70],'#dab33d',machine);
    box('Operator cab',[.15,.91,0],[.64,.82,.7],'#d9b340',machine);
    box('Cab windshield',[.486,1.01,0],[.02,.48,.55],glass,machine);
    box('Cab side glass',[.13,1.02,.358],[.46,.44,.03],glass,machine);
    for(const wx of [-.8,-.4,.43,.85])for(const wz of [-.45,.45]) {
      const w=mesh(new T.TorusGeometry(.19,.085,8,18),ink,v(wx,.24,wz),machine);w.rotation.y=Math.PI/2;
      const hub=cylinder([wx,.24,wz>0?.55:-.55],.11,.02,'#d3ad3c',machine);hub.rotation.x=Math.PI/2;
    }
    const arm=new T.Group();arm.position.set(.40,1.24,0);machine.add(arm);motion=arm;
    beam(v(0,0,0),v(.25,.74,0),.065,'#d7b13b',arm);beam(v(.25,.74,0),v(1.05,.43,0),.05,'#d7b13b',arm);
    beam(v(.18,.12,0),v(.33,.58,0),.022,ink,arm);
    box('Harvesting head',[1.10,.21,0],[.30,.38,.37],'#d7b13b',arm);
    tree(-1.85,-1.30,1.1,true);tree(-2.0,.15,.85,true);tree(-1.7,1.40,.65,true);shrub(1.75,-1.35,.22);
  } else if(id===2) {
    // Test track apron with haptic ripples spreading out under the car.
    disc([.05,.21,.22],1.86,1.18,.10,'#bbc9d4');
    const car=new T.Group();car.position.set(.0,.35,.3);car.rotation.y=-.12;group.add(car);motion=car;
    box('Volvo wagon / body',[0,.43,0],[2.78,.50,1.20],'#718ca2',car);
    box('Cabin',[.12,.83,0],[1.50,.50,1.05],glass,car);
    const shell=vault([.15,1.02,0],.56,1.52,.30,'#718ca2',car);shell.name='Roof';
    box('Hood',[-.99,.66,0],[.64,.10,1.13],'#718ca2',car);
    box('Rear hatch',[1.17,.80,0],[.18,.45,1.06],'#718ca2',car);
    for(const px of [-.53,.10,.81])for(const pz of [-.542,.542])box('Window pillar',[px,.87,pz],[.05,.46,.03],'#718ca2',car);
    for(const px of [-.91,.94])for(const pz of [-.64,.64]) {
      const w=mesh(new T.TorusGeometry(.22,.10,8,20),ink,v(px,.28,pz),car);w.rotation.y=Math.PI/2;
      const hub=cylinder([px,.28,pz>0?.719:-.719],.17,.02,white,car);hub.rotation.x=Math.PI/2;}
    box('Front grille',[-1.40,.46,0],[.03,.25,.60],ink,car);
    for(const pz of [-.43,.43]){box('Thor hammer headlamp',[-1.42,.62,pz],[.03,.05,.23],'#f7edd0',car);box('Headlamp stem',[-1.423,.57,pz],[.03,.12,.04],'#f7edd0',car);}
    label('VOLVO',[0,.52,.618],1.01,.21,white,'transparent',car);
    box('Haptics lab plinth',[.30,.47,-1.30],[2.4,.62,.40],white);
    label('VOLVO  /  HAPTICS',[.30,.55,-1.087],2.15,.30);
    const ripples=new T.Group();ripples.position.set(.1,.222,.28);group.add(ripples);
    for(let i=0;i<4;i++) {const r=mesh(new T.TorusGeometry(.34+i*.19,.011,4,64),'#84abc2',v(0,0,0),ripples);r.rotation.x=-Math.PI/2;r.scale.z=.66;}
    tree(-1.95,-1.15,.80);tree(-1.85,1.05,.65);shrub(1.85,1.2,.2);
  } else if(id===1) {
    function cottage(cx:number,cz:number,w:number,h:number,d:number,c:string) {
      box('Swedish timber building',[cx,.2+h/2,cz],[w,h,d],c);
      const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute([
        -w/2,0,d/2,w/2,0,d/2,0,.55,d/2,-w/2,0,-d/2,0,.55,-d/2,w/2,0,-d/2,
        -w/2,0,d/2,0,.55,d/2,0,.55,-d/2,-w/2,0,d/2,0,.55,-d/2,-w/2,0,-d/2,
        w/2,0,d/2,w/2,0,-d/2,0,.55,-d/2,w/2,0,d/2,0,.55,-d/2,0,.55,d/2],3));geom.computeVertexNormals();
      mesh(geom,'#656a6a',v(cx,h+.2,cz));
      for(const dx of [-w*.28,w*.28]) {box('White window trim',[cx+dx,h*.60,cz+d/2+.035],[.36,.48,.04],white);box('Window glass',[cx+dx,h*.60,cz+d/2+.06],[.26,.35,.02],glass);}
    }
    cottage(.50,-.58,2.3,1.33,1.65,'#b6614f');
    box('Clinic door',[.50,.59,.27],[.43,.77,.05],white);
    const canopy=vault([.50,1.14,.48],.31,.95,.42,white);canopy.name='Clinic canopy';
    box('Clinic cross vertical',[.5,1.47,.278],[.10,.35,.03],'#d35951');box('Clinic cross horizontal',[.5,1.47,.28],[.33,.10,.03],'#d35951');
    label('VÅRDCENTRAL',[.50,1.78,.27],1.12,.17);
    cottage(-1.07,1.0,.88,.72,.71,'#c28055');
    stones([.63,.30],[.35,1.75],6,.22);
    for(let i=0;i<5;i++)box('Timber facade batten',[-.48+i*.46,.87,.285],[.02,1.08,.02],white);
    const pole=cylinder([1.85,1.02,.90],.014,1.74,white);
    box('Swedish flag',[2.05,1.60,.90],[.4,.25,.03],'#4a83b5');box('Flag cross',[2.0,1.60,.918],[.05,.25,.01],'#e9c75b');box('Flag cross',[2.05,1.60,.919],[.4,.05,.01],'#e9c75b');
    tree(-1.9,-1.35,1,true);tree(-2.0,.05,.85,true);tree(1.75,-1.45,.8,true);shrub(-1.5,1.75,.19);
  } else if(id===5) {
    const profile=[[0,.61],[.4,.67],[1,.68],[1.8,.63],[2.6,.51],[3.15,.33],[3.55,.12],[3.7,.012]];
    const points=profile.map(([h,r])=>new T.Vector2(r,h));
    const tower=mesh(new T.LatheGeometry(points,40),'#88a4aa',v(0,.26,-.27));tower.name='Spring Bamboo / original tapered silhouette';
    const radius=(y:number)=>{for(let i=0;i<profile.length-1;i++){const [a,r]=profile[i],[b,s]=profile[i+1];if(y>=a&&y<=b)return r+(s-r)*(y-a)/(b-a);}return .012;};
    for(let j=0;j<28;j++) {const a=j*Math.PI*2/28;const pts=profile.map(([h,r])=>v((r+.01)*Math.cos(a),h+.26,-.27+(r+.01)*Math.sin(a)));for(let k=0;k<pts.length-1;k++)beam(pts[k],pts[k+1],.010,white);}
    for(let h=.4;h<3.3;h+=.27){const r=mesh(new T.TorusGeometry(radius(h)+.009,.005,3,40),white,v(0,h+.26,-.27));r.rotation.x=Math.PI/2;}
    for(let j=0;j<14;j++)for(const direction of [-1,1]){const a=j*Math.PI*2/14;beam(v(radius(2.7)*Math.cos(a),2.96,-.27+radius(2.7)*Math.sin(a)),v(.13*Math.cos(a+direction*.44),3.79,-.27+.13*Math.sin(a+direction*.44)),.012,white);}
    disc([0,.20,-.27],.95,.95,.14,white);
    const band=mesh(new T.CylinderGeometry(.66,.70,.59,32,1,true,-1.17,2.34),'#158b50',v(0,2.07,-.27));
    label('oppo',[0,2.09,.437],1.10,.46,'#ffffff');
    const entry=vault([0,.48,.50],.30,.86,.34,white);entry.name='Entrance canopy';
    box('Multimedia pavilion',[1.35,.56,.60],[.75,.74,.85],white);
    box('Phone screen',[1.35,.69,1.046],[.38,.48,.03],'#57a88b');
    label('ColorOS',[1.35,.69,1.063],.33,.13,'#ffffff');
    stones([-.9,1.5],[1.1,1.55],5,.18);
    tree(-1.85,-1.25,.8);tree(-1.9,.85,.8);tree(1.6,-1.3,.7);
  } else {
    // A bowed public facade — the office curves toward the street instead of
    // presenting a flat civic wall.
    const R=5.0,TH=1.5,SW=.55,RO=R+TH/2,cz=.30-RO,cx=.20;
    const wall=arcWall([cx,.16,cz],R,TH,SW,1.87,'#ddd6c5');wall.name='Public service building';
    arcWall([cx,2.03,cz],R,TH+.22,SW+.035,.15,white).name='Civic roof';
    for(let i=0;i<5;i++){const a=-.2+i*.10;
      const w=box('Window',[cx+RO*Math.sin(a)+.004,1.28,cz+RO*Math.cos(a)+.004],[.30,.44,.03],glass);w.rotation.y=a;
      const w2=box('Window',[cx+RO*Math.sin(a)+.004,.72,cz+RO*Math.cos(a)+.004],[.30,.44,.03],glass);w2.rotation.y=a;}
    box('Entrance frame',[cx,.69,.30],[.80,1.05,.22],white);
    box('Accessible entrance',[cx,.63,.42],[.53,.86,.03],glass);
    const shade=vault([cx,1.22,.60],.36,1.35,.32,'#43856d');shade.name='Service canopy';
    const logoMat=new T.MeshStandardMaterial({transparent:true,roughness:.9});
    const logo=new T.Mesh(new T.CylinderGeometry(RO+.02,RO+.02,.30,64,1,true,-SW*.46,SW*.92),logoMat);
    logo.position.set(cx,1.86,cz);group.add(logo);
    new T.TextureLoader().load(fkLogo,tex=>{if(group.userData.disposed){tex.dispose();return;}tex.colorSpace=T.SRGBColorSpace;logoMat.map=tex;logoMat.needsUpdate=true;});
    disc([.55,.17,1.05],1.05,.48,.09,'#d6d1c4');
    for(const px of [-.5,1.6])beam(v(px,.24,.86),v(px,.60,1.40),.018,white);
    box('Public bench',[-1.05,.42,1.30],[.72,.10,.26],'#43856d');
    tree(-1.9,-1.1,.85);tree(-1.95,.60,.7);tree(1.85,1.15,.65);shrub(2.0,-.9,.2);
  }
  group.traverse(o=>{o.userData.projectId=id;});
  return {id,group,materials,ring,motion,label:v(x,.22,z+2.25)};
}

// A single lane winding between the islands — no grid, no junctions.
export function createStreet(scene:T.Scene) {
  const curve=new T.CatmullRomCurve3([v(-12,0,1.15),v(-8.2,0,.15),v(-4.6,0,.75),v(-1.0,0,-.05),v(2.6,0,.7),v(6.2,0,.05),v(9.6,0,.95),v(12.5,0,.5)]);
  const steps=200,half=.52,y=-.075,position:number[]=[],normal:number[]=[],index:number[]=[];
  for(let i=0;i<=steps;i++) {
    const p=curve.getPointAt(i/steps),t=curve.getTangentAt(i/steps);
    const nx=-t.z,nz=t.x,len=Math.hypot(nx,nz)||1;
    position.push(p.x+nx/len*half,y,p.z+nz/len*half,p.x-nx/len*half,y,p.z-nz/len*half);
    normal.push(0,1,0,0,1,0);
  }
  for(let i=0;i<steps;i++){const a=i*2;index.push(a,a+1,a+2,a+1,a+3,a+2);}
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(position,3));
  geo.setAttribute('normal',new T.Float32BufferAttribute(normal,3));
  geo.setIndex(index);
  const road=new T.Mesh(geo,new T.MeshStandardMaterial({color:'#d3d7d4',roughness:1,side:T.DoubleSide}));
  road.receiveShadow=true;scene.add(road);
  const paint=new T.MeshStandardMaterial({color:'#f7f6f1'});
  const dash=new T.BoxGeometry(.30,.008,.026);shared.add(dash);
  for(let i=6;i<steps-6;i+=7) {
    const p=curve.getPointAt(i/steps),t=curve.getTangentAt(i/steps);
    const m=new T.Mesh(dash,paint);m.position.set(p.x,y+.012,p.z);m.rotation.y=Math.atan2(t.x,t.z)-Math.PI/2;scene.add(m);
  }
  // Loose planting scattered along the verge so the lane never reads as a ruler.
  for(let i=0;i<26;i++) {
    const k=.04+i/26*.92,p=curve.getPointAt(k),side=i%2?1:-1;
    const t=curve.getTangentAt(k),nx=-t.z,nz=t.x,len=Math.hypot(nx,nz)||1;
    const off=(.85+Math.abs(wobble(i,k))*.5)*side;
    const b=new T.Mesh(blobGeo,new T.MeshStandardMaterial({color:'#a9b8a2',roughness:.9}));
    const r=.10+Math.abs(wobble(k,i))*.09;
    b.position.set(p.x+nx/len*off,y+r*.6,p.z+nz/len*off);b.scale.set(r*1.3,r*.75,r);b.castShadow=true;scene.add(b);
  }
}

export function disposeCity(scene:T.Scene) {
  const geometries=new Set<T.BufferGeometry>(), mats=new Set<T.Material>(),textures=new Set<T.Texture>();
  scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){mats.add(m);for(const value of Object.values(m))if(value instanceof T.Texture)textures.add(value);}}});
  geometries.forEach(g=>{if(!shared.has(g))g.dispose();});mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
}
