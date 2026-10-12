import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import audioMusic from '../../../assets/audio_music.mp3';
import audioPhone from '../../../assets/audio_phone.mp3';
import audioPodcast from '../../../assets/audio_podcast.mp3';
import { createAudioScene, DOME_RADIUS, INITIAL_AUDIO_POSITIONS, AUDIO_SOURCE_MIN_HEIGHTS, AudioPosition } from './holo-scene';
import './audio-dome.css';

const SOURCES=[{name:'Music',file:audioMusic,volume:1},{name:'Phone',file:audioPhone,volume:.7},{name:'Podcast',file:audioPodcast,volume:.8}];
const INITIAL = INITIAL_AUDIO_POSITIONS;
const AXES=[{key:'z',start:'Front',end:'Back'},{key:'x',start:'Left',end:'Right'},{key:'y',start:'Above',end:'Below'}] as const;

export function AudioDome(){
  const containerRef=useRef<HTMLDivElement>(null);
  const [modelState,setModelState]=useState<'loading'|'ready'|'error'>('loading');
  const [activeIdx,setActiveIdx]=useState(0);const activeRef=useRef(0);activeRef.current=activeIdx;
  const [positions,setPositions]=useState(INITIAL);const positionsRef=useRef(positions);positionsRef.current=positions;
  const sourceButtons=useRef<(HTMLButtonElement|null)[]>([]);
  const [audioState,setAudioState]=useState<'off'|'loading'|'playing'>('off');
  const [error,setError]=useState('');const [muted,setMuted]=useState([false,true,false]);const mutedRef=useRef(muted);mutedRef.current=muted;
  const audioRef=useRef<{ctx:AudioContext;panners:PannerNode[];gains:GainNode[];buffers:AudioBufferSourceNode[]}|null>(null);
  const requestRef=useRef(0);
  function stopAudio(){requestRef.current++;const audio=audioRef.current;audioRef.current=null;if(audio){audio.buffers.forEach(s=>{try{s.stop();}catch{ /* already stopped */ }});void audio.ctx.close();}}
  useEffect(()=>()=>stopAudio(),[]);
  async function togglePreview(){
    if(audioState!=='off'){stopAudio();setAudioState('off');return;}
    const request=++requestRef.current;setError('');setAudioState('loading');
    const audio={ctx:new AudioContext(),panners:[] as PannerNode[],gains:[] as GainNode[],buffers:[] as AudioBufferSourceNode[]};audioRef.current=audio;
    try{
      await audio.ctx.resume();
      const decoded=await Promise.all(SOURCES.map(async s=>{const response=await fetch(s.file);if(!response.ok)throw new Error('Audio unavailable');return audio.ctx.decodeAudioData(await response.arrayBuffer());}));
      if(request!==requestRef.current)return;
      const startTime=audio.ctx.currentTime+.05;
      decoded.forEach((buffer,i)=>{const p=audio.ctx.createPanner();p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=5;p.rolloffFactor=.5;p.connect(audio.ctx.destination);audio.panners.push(p);
        const g=audio.ctx.createGain();g.gain.value=mutedRef.current[i]?0:SOURCES[i].volume;g.connect(p);audio.gains.push(g);
        const b=audio.ctx.createBufferSource();b.buffer=buffer;b.loop=true;b.connect(g);b.start(startTime);audio.buffers.push(b);});setAudioState('playing');
    }catch{if(request!==requestRef.current)return;stopAudio();setAudioState('off');setError('Audio could not load. Please try again.');}
  }
  function toggleMute(){const i=activeRef.current;const next=mutedRef.current.map((v,j)=>i===j?!v:v);setMuted(next);const audio=audioRef.current;if(audio)audio.gains[i]?.gain.setTargetAtTime(next[i]?0:SOURCES[i].volume,audio.ctx.currentTime,.04);}
  function updatePosition(index:number,p:AudioPosition){const next=positionsRef.current.map((v,i)=>i===index?p:v);positionsRef.current=next;setPositions(next);}
  function updateAxis(axis:'x'|'y'|'z',value:number){
    const i=activeRef.current;const p={...positionsRef.current[i]};
    // Keep the other axes fixed and constrain just the edited coordinate to the dome.
    const other=Object.entries(p).reduce((n,[k,v])=>k===axis?n:n+v*v,0);const limit=Math.sqrt(Math.max(0,(DOME_RADIUS-.45)**2-other));
    const world=axis==='y'?(100-value)/200*(DOME_RADIUS-.45):(axis==='x'?value:-value)/100*(DOME_RADIUS-.45);p[axis]=axis==='y'?Math.max(AUDIO_SOURCE_MIN_HEIGHTS[i],Math.min(limit,world)):Math.max(-limit,Math.min(limit,world));updatePosition(i,p);
  }
  useEffect(()=>{
    const container=containerRef.current;if(!container)return;
    const {scene,camera,renderer,sources,ready,dispose}=createAudioScene(container);
    let mounted=true,modelsReady=false;
    ready.then(()=>{if(mounted){modelsReady=true;setModelState('ready');}}).catch(()=>{if(mounted)setModelState('error');});
    const visual=INITIAL.map(p=>new THREE.Vector3(p.x,p.y,p.z));
    const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
    let dragging=false,pointerId=-1,dragIndex=0,frame=0;
    let startX=0,startY=0,lastX=0,lastY=0,initialPhi=0,phi=0,angle=0,radius=0;
    let lockedAxis: 'horizontal'|'vertical'|null=null;
    function cast(e:PointerEvent){const rect=container!.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);}
    function down(e:PointerEvent){if(e.button!==0||!modelsReady)return;cast(e);const intersects=ray.intersectObjects(sources,true);if(intersects.length){const idx=sources.findIndex(s=>{let o:THREE.Object3D|null=intersects[0].object;while(o){if(o===s)return true;o=o.parent;}return false;});if(idx>=0){activeRef.current=idx;setActiveIdx(idx);}}
      dragIndex=activeRef.current;dragging=true;pointerId=e.pointerId;container!.setPointerCapture(pointerId);
      const p=positionsRef.current[dragIndex];radius=Math.hypot(p.x,p.y,p.z);phi=initialPhi=Math.asin(p.x/radius);angle=Math.atan2(p.y,p.z);
      startX=lastX=e.clientX;startY=lastY=e.clientY;lockedAxis=null;container!.classList.add('is-dragging');e.preventDefault();}
    function move(e:PointerEvent){
      if(!dragging||e.pointerId!==pointerId)return;
      const dx=e.clientX-startX,dy=e.clientY-startY,deltaX=e.clientX-lastX,deltaY=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
      if(!lockedAxis){if(Math.hypot(dx,dy)<10)return;lockedAxis=Math.abs(dx)>Math.abs(dy)?'horizontal':'vertical';}
      // Preserve the prototype's slice switching and tangent-following arc gesture.
      const nearTop=Math.sin(angle)>.5;
      const sensitivity=120*container!.clientWidth/400;
      if(lockedAxis==='vertical'||(lockedAxis==='horizontal'&&nearTop)){
        const delta=(-deltaY*Math.cos(angle)-deltaX*.75*Math.sin(angle))/sensitivity;
        const previous=angle;angle=Math.max(.08,Math.min(Math.PI-.08,angle+delta));
        if((previous-Math.PI/2)*(angle-Math.PI/2)<0&&Math.abs(delta)>.004)angle=Math.PI/2+Math.sign(angle-Math.PI/2)*.12;
      }
      if(lockedAxis==='horizontal'&&!nearTop){const step=Math.PI/10;phi=Math.max(-Math.PI/2+.08,Math.min(Math.PI/2-.08,initialPhi+Math.round(dx/(40*container!.clientWidth/400))*step));}
      const minHeight=AUDIO_SOURCE_MIN_HEIGHTS[dragIndex];
      const phiLimit=Math.acos(Math.min(1,minHeight/radius));phi=Math.max(-phiLimit,Math.min(phiLimit,phi));
      const r=radius*Math.cos(phi);const angleLimit=Math.asin(Math.min(1,minHeight/r));angle=Math.max(angleLimit,Math.min(Math.PI-angleLimit,angle));updatePosition(dragIndex,{x:radius*Math.sin(phi),y:r*Math.sin(angle),z:r*Math.cos(angle)});
    }
    function up(e:PointerEvent){if(e.pointerId!==pointerId)return;dragging=false;container!.classList.remove('is-dragging');if(container!.hasPointerCapture(pointerId))container!.releasePointerCapture(pointerId);}
    container.addEventListener('pointerdown',down);container.addEventListener('pointermove',move);container.addEventListener('pointerup',up);container.addEventListener('pointercancel',up);
    let last=performance.now();
    function animate(now:number){frame=requestAnimationFrame(animate);const ease=1-Math.exp(-Math.min(now-last,50)/65);last=now;
      sources.forEach((source,i)=>{const target=positionsRef.current[i];visual[i].lerp(new THREE.Vector3(target.x,target.y,target.z),ease);source.position.copy(visual[i]);
        const scale=dragging&&i===activeRef.current?1.04:1;source.scale.lerp(new THREE.Vector3(scale,scale,scale),ease);
        const projected=visual[i].clone().project(camera);const button=sourceButtons.current[i];if(button){button.style.left=`${(projected.x+1)*50}%`;button.style.top=`${(1-projected.y)*50}%`;}
        const audio=audioRef.current;const p=audio?.panners[i];if(p&&audio){p.positionX.setTargetAtTime(visual[i].x,audio.ctx.currentTime,.03);p.positionY.setTargetAtTime(visual[i].y,audio.ctx.currentTime,.03);p.positionZ.setTargetAtTime(-visual[i].z,audio.ctx.currentTime,.03);}
      });renderer.render(scene,camera);}
    frame=requestAnimationFrame(animate);
    return()=>{mounted=false;cancelAnimationFrame(frame);container.removeEventListener('pointerdown',down);container.removeEventListener('pointermove',move);container.removeEventListener('pointerup',up);container.removeEventListener('pointercancel',up);dispose();};
  },[]);
  const position=positions[activeIdx];
  return <div className="holo-prototype">
    <div className="holo-card">
      <div className={`holo-scene ${modelState==='ready'?'is-ready':''}`} ref={containerRef} aria-busy={modelState==='loading'} aria-label="Interactive Holo Audio space. Select an audio source and drag to move it.">
        <img className="holo-model-preview" src="/models/holo-audio/preview.png" alt="Blender model preview: listener surrounded by audio sources" aria-hidden={modelState==='ready'} />
        {modelState!=="ready"&&<span className="holo-model-status" role="status">{modelState==='loading'?'Loading 3D models…':'3D models could not load. Refresh to try again.'}</span>}
        {SOURCES.map((s,i)=><button disabled={modelState!=='ready'} key={s.name} ref={el=>{sourceButtons.current[i]=el;}} className={`holo-source-target ${i===activeIdx?'is-active':''}`} aria-label={`Move ${s.name} audio source`} aria-pressed={i===activeIdx} title={`${s.name} · drag to move`} onClick={()=>setActiveIdx(i)} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const p={...positionsRef.current[i]};const axis=e.shiftKey?'z':e.key==='ArrowLeft'||e.key==='ArrowRight'?'x':'y';p[axis]+=e.key==='ArrowLeft'||e.key==='ArrowDown'?-.15:.15;p.y=Math.max(AUDIO_SOURCE_MIN_HEIGHTS[i],p.y);const v=new THREE.Vector3(p.x,p.y,p.z);if(v.length()>DOME_RADIUS-.45)v.setLength(DOME_RADIUS-.45);updatePosition(i,{x:v.x,y:v.y,z:v.z});}} />)}
      </div>
      <div className="holo-controls">
        <p className="holo-description">Connect your headphones to unlock an immersive listening experience.</p>
        <div className="holo-source-row"><div className="holo-select-wrap"><select aria-label="Audio source" value={activeIdx} onChange={e=>setActiveIdx(Number(e.target.value))}>{SOURCES.map((s,i)=><option key={s.name} value={i}>{s.name}</option>)}</select><span aria-hidden="true" /></div>
          {audioState==='playing'&&<button className="holo-mute" onClick={toggleMute} aria-pressed={muted[activeIdx]}>{muted[activeIdx]?'Unmute':'Mute'}</button>}
        </div>
        {AXES.map(axis=>{const value=Math.round(axis.key==='y'?100-position.y/(DOME_RADIUS-.45)*200:(axis.key==='x'?position.x:-position.z)/(DOME_RADIUS-.45)*100);const percent=(value+100)/2;return <label className="holo-slider" key={axis.key}><span className="holo-slider-labels"><span>{axis.start}</span><span>{axis.end}</span></span><input type="range" min="-100" max="100" step="1" value={value} aria-label={`${SOURCES[activeIdx].name}: ${axis.start} to ${axis.end}`} style={{'--segment-start':`${Math.min(50,percent)}%`,'--segment-end':`${Math.max(50,percent)}%`} as React.CSSProperties} onChange={e=>updateAxis(axis.key,Number(e.target.value))}/></label>;})}
      </div>
    </div>
    <div className="holo-preview"><button onClick={togglePreview} aria-pressed={audioState==='playing'}>{audioState==='loading'?'Cancel loading':audioState==='playing'?'Stop preview':'Listen'}<span aria-hidden="true">{audioState==='playing'?'Ⅱ':'▷'}</span></button><p>{error||'Select a source, then drag to place it. Best experienced with headphones.'}</p></div>
  </div>;
}
