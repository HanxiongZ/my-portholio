import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import * as THREE from 'three';
import { ArrowUpRight, Box, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Project } from './Projects';
import { createDistrict, createStreet, disposeCity, type District } from './cityModels';
import './project-city.css';

// position is [x, z] in world units; turn tilts the island off the grid.
const places = [
  { id:3, client:'KOMATSU FOREST', name:'Co-Act', place:'The forestry workshop', category:'Collaborative interfaces', color:'#b18c2f', position:[-5.75,-2.75], turn:.16,
    detail:'A shared digital workspace for forestry service mechanics. Co-Act explores how AI can support human judgement and make practical, hard-earned knowledge easier to exchange.',tags:['GUI design','Tacit knowledge','Service collaboration'] },
  { id:2, client:'VOLVO CARS', name:'Beyond the Clicks', place:'The haptics test ground', category:'Physical UX internship', color:'#527e9b', position:[-2.95,3.45], turn:-.13,
    detail:'Exploring how tactile feedback can give physical controls more expressive interaction layers. Developed through hands-on prototyping during my internship at Volvo Cars.',tags:['Haptics','Physical controls','Prototyping'] },
  { id:1, client:'RURAL SWEDEN', name:'From Novelty to Normality', place:'The village health centre', category:'Master’s thesis · 2026', color:'#b2694c', position:[3.0,3.3], turn:.11,
    detail:'Exploring long-term interactions with AI in rural Swedish healthcare: how a new technology becomes part of everyday care, relationships and routines over time.',tags:['Rural healthcare','Physical AI','Long-term interaction'] },
  { id:5, client:'OPPO · COLOROS', name:'Multimedia Experiences', place:'The Spring Bamboo tower', category:'Interaction & interface design', color:'#288755', position:[.05,-3.25], turn:-.06,
    detail:'Work on phone multimedia experiences as a ColorOS designer, including Dolby Atmos and spatial audio. A focus on clear controls, consistent interfaces and understandable language.',tags:['Multimedia UX','ColorOS','Spatial audio'] },
  { id:4, client:'FÖRSÄKRINGSKASSAN', name:'Inside the Machine', place:'The public service office', category:'Service & strategic design', color:'#3f816b', position:[5.85,-2.5], turn:-.19,
    detail:'Reframing the sick-leave experience with Sweden’s social insurance agency. Research and co-creation make hidden processes more visible, supporting clarity, trust and agency.',tags:['Service design','Co-creation','Public services'] },
];
type CityProps={projects:Project[]};

export default function ProjectCity({projects}:CityProps) {
  const host=useRef<HTMLDivElement>(null);
  const labelRefs=useRef(new Map<number,HTMLButtonElement>());
  const [hovered,setHovered]=useState<number|null>(null),[pinned,setPinned]=useState<number|null>(null),[last,setLast]=useState<number|null>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[wire,setWire]=useState(false);
  const active=hovered??pinned;
  const activeRef=useRef<number|null>(null);activeRef.current=active;
  const wireRef=useRef(false);wireRef.current=wire;
  const zoomRef=useRef(1);
  const interactRef=useRef<(id:number|null)=>void>(()=>{});
  interactRef.current=id=>{setHovered(id);if(id!==null)setLast(id);};
  const selectRef=useRef<(id:number|null)=>void>(()=>{});
  selectRef.current=id=>{setPinned(prev=>prev===id?null:id);if(id!==null)setLast(id);};
  const info=places.find(p=>p.id===(active??last));
  const existing=projects.find(p=>p.id===info?.id);
  // The card settles on whichever side of the stage the district is not on.
  const side=info&&info.position[0]>.4?'is-left':'is-right';

  useEffect(()=>{
    const mount=host.current;if(!mount)return;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});} catch {setFailed(true);return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
    renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;
    renderer.domElement.setAttribute('aria-label','Interactive miniature city of five design projects. Use the project buttons to explore.');
    renderer.domElement.setAttribute('role','img');mount.prepend(renderer.domElement);
    const scene=new THREE.Scene();
    scene.add(new THREE.HemisphereLight('#ffffff','#b4bbb1',1.75));
    const sun=new THREE.DirectionalLight('#fff6e7',1.9);sun.position.set(-8,16,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;sun.shadow.normalBias=.045;sun.shadow.bias=-.00015;scene.add(sun);
    const fill=new THREE.DirectionalLight('#dce8f0',.6);fill.position.set(12,6,-6);scene.add(fill);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.13;ground.receiveShadow=true;scene.add(ground);
    createStreet(scene);
    const districts:District[]=places.map(p=>createDistrict(p.id,p.position[0],p.position[1],p.turn));districts.forEach(d=>scene.add(d.group));
    const camera=new THREE.OrthographicCamera(-10,10,7,-7,.1,120);
    // The camera drifts toward whatever is being explored, so the city feels
    // walked through rather than looked at from a fixed vantage point.
    const eye=new THREE.Vector3(7.5,15,24),focus=new THREE.Vector3(),goal=new THREE.Vector3();
    let span=0;
    let width=1,height=1,raf=0,visible=true,disposed=false;
    const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let currentHit:number|null=null;
    function hit(event:PointerEvent) {
      const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);
      ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(districts.map(d=>d.group),true);
      return hits.length?(hits[0].object.userData.projectId as number):null;
    }
    function move(e:PointerEvent){if(e.pointerType==='touch')return;const id=hit(e);if(id!==currentHit){currentHit=id;interactRef.current(id);}renderer.domElement.style.cursor=id?'pointer':'default';}
    function leave(){currentHit=null;interactRef.current(null);}
    function click(e:PointerEvent){const id=hit(e);selectRef.current(id);}
    const lost=(e:Event)=>{e.preventDefault();setFailed(true);};
    renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('pointerup',click);renderer.domElement.addEventListener('webglcontextlost',lost);
    const resize=new ResizeObserver(()=>{width=mount.clientWidth;height=mount.clientHeight;renderer.setSize(width,height);});resize.observe(mount);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(mount);
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');let lastTime=0;
    function frame(time:number){
      if(disposed)return;raf=requestAnimationFrame(frame);if(!visible||document.hidden)return;
      const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;const t=media.matches?1:1-Math.exp(-dt*9);
      const focused=places.find(p=>p.id===activeRef.current);
      goal.set(focused?focused.position[0]*.62:0,0,focused?focused.position[1]*.42:0);
      focus.lerp(goal,media.matches?1:1-Math.exp(-dt*3.2));
      const target=Math.max(19.4,11.6*width/height)/(zoomRef.current*(focused?1.2:1));
      span=span===0||media.matches?target:span+(target-span)*(1-Math.exp(-dt*3.2));
      camera.left=-span/2;camera.right=span/2;camera.top=span*height/width/2;camera.bottom=-camera.top;
      camera.position.copy(focus).add(eye);camera.lookAt(focus.x,.9,focus.z+.2);
      camera.updateProjectionMatrix();camera.updateMatrixWorld();
      for(const d of districts){
        const selected=d.id===activeRef.current;
        for(const m of d.materials){m.color.lerp(selected?m.userData.targetColor:m.userData.neutralColor,t);m.wireframe=wireRef.current&&!selected;}
        const rm=d.ring.material as THREE.MeshStandardMaterial;rm.opacity=THREE.MathUtils.lerp(rm.opacity,selected?.88:0,t);
        d.group.position.y=THREE.MathUtils.lerp(d.group.position.y,selected&&!media.matches?.14:0,t);
        if(d.motion){const wave=selected&&!media.matches?Math.sin(time*.0017):0;if(d.id===3)d.motion.rotation.z=wave*.06;else d.motion.position.y=THREE.MathUtils.lerp(d.motion.position.y,.35+Math.abs(wave)*.035,t);}
        const point=d.label.clone().project(camera),el=labelRefs.current.get(d.id);
        if(el){el.style.left=`${(point.x*.5+.5)*width}px`;el.style.top=`${(-point.y*.5+.5)*height}px`;el.style.opacity=point.x<-1.05||point.x>1.05?'0':'';}
      }
      renderer.render(scene,camera);
    }
    raf=requestAnimationFrame(frame);setReady(true);
    return ()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();districts.forEach(d=>d.group.userData.disposed=true);
      renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('pointerup',click);renderer.domElement.removeEventListener('webglcontextlost',lost);
      disposeCity(scene);renderer.dispose();renderer.domElement.remove();};
  },[]);

  const reset=()=>{setHovered(null);setPinned(null);setLast(null);zoomRef.current=1;};
  const enter=(id:number)=>{setHovered(id);setLast(id);};
  return <div className="project-city" onKeyDown={e=>{if(e.key==='Escape')reset();}}>
    <div className="city-heading">
      <span className="city-kicker">A SMALL CITY OF DESIGN</span>
      <h2>Different contexts.<br/>Connected by curiosity.</h2>
      <p>Five projects, five places. Wander in.</p>
    </div>

    <div className={`city-stage ${info?'is-exploring':''}`}>
      <div className="city-scene" ref={host}>
        {!ready&&!failed&&<div className="city-state">Building your neighbourhood…</div>}
        {failed&&<div className="city-state">The 3D view is unavailable here.<br/>Choose a project below to explore its details.</div>}
        {ready&&!failed&&places.map((p,i)=>
          <button key={p.id} type="button" className={`city-pin ${active===p.id?'is-active':''}`} style={{'--district-color':p.color} as React.CSSProperties}
            ref={el=>{if(el)labelRefs.current.set(p.id,el);else labelRefs.current.delete(p.id);}}
            onPointerEnter={()=>enter(p.id)} onPointerLeave={()=>setHovered(null)} onFocus={()=>enter(p.id)} onBlur={()=>setHovered(null)}
            onClick={()=>selectRef.current(p.id)} aria-label={`Explore ${p.name}, ${p.client}`} aria-pressed={pinned===p.id}>
            <i/><span>0{i+1}</span>{p.client}
          </button>)}
      </div>

      <div className="city-tools">
        <button type="button" className={wire?'is-on':''} aria-pressed={wire} onClick={()=>setWire(!wire)} aria-label="Show inactive buildings as wireframe"><Box size={15}/></button>
        <button type="button" onClick={()=>{zoomRef.current=Math.min(1.35,zoomRef.current+.1);}} aria-label="Zoom in"><Plus size={15}/></button>
        <button type="button" onClick={()=>{zoomRef.current=Math.max(.8,zoomRef.current-.1);}} aria-label="Zoom out"><Minus size={15}/></button>
        <button type="button" onClick={reset} aria-label="Reset city view"><RotateCcw size={14}/></button>
      </div>

      <p className="city-welcome">Every place has a story.<br/><small>Hover a building · click to hold it</small></p>

      <aside className={`city-panel ${side} ${info?'is-open':''}`} aria-live="polite" aria-atomic="true">
        {info&&<div key={info.id} className="city-card" style={{'--district-color':info.color} as React.CSSProperties}>
          <span className="city-kicker">{info.client}</span>
          <h3>{info.name}</h3>
          <p className="city-place">{info.place} · {info.category}</p>
          {existing?.image&&<img className="city-shot" src={existing.image} alt={`${info.name} project preview`} loading="lazy"/>}
          <p className="city-description">{info.detail}</p>
          <div className="city-tags">{info.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
          <Link to={`/project/${info.id}`} className="city-case-link">{info.id===5?'Explore Holo Audio':'View case study'}<ArrowUpRight size={16}/></Link>
        </div>}
      </aside>
    </div>

    <nav className="city-index" aria-label="Choose a project">
      {places.map((p,i)=>
        <button type="button" key={p.id} style={{'--district-color':p.color} as React.CSSProperties} className={active===p.id?'is-active':''}
          onPointerEnter={()=>enter(p.id)} onPointerLeave={()=>setHovered(null)} onFocus={()=>enter(p.id)} onBlur={()=>setHovered(null)}
          onClick={()=>selectRef.current(p.id)} aria-pressed={pinned===p.id}>
          <span>0{i+1}</span><small>{p.client}</small><strong>{p.name}</strong>
        </button>)}
    </nav>
  </div>;
}
