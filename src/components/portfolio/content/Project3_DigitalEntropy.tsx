import React, { useState } from 'react';
import type { Project } from '../Projects';
import forest from '../../../assets/imgForestryMachine.jpg';
import mockup from '../../../assets/coact_mockup.png';
import mechanic from '../../../assets/Mechanic1.png';
import apprentice from '../../../assets/Mechanic2.png';
import driver from '../../../assets/Driver1.png';
import board from '../../../assets/coact_researchboard.jpeg';
import operator from '../../../assets/coact_operatorhome.png';
import workspace from '../../../assets/coact_home.png';
import dashboard from '../../../assets/coact_dashboard.png';
import ai from '../../../assets/coact_smartai.png';
import office from '../../../assets/coact_officeview.jpg';
import collaboration from '../../../assets/coact_collabview.jpg';
import './coact-original-edit.css';

const media = 'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
function Image({src,alt,caption}:{src:string;alt:string;caption?:string}) {
  return <figure><a href={src} target="_blank" rel="noreferrer" aria-label={`View full-size: ${alt}`}><img src={src} alt={alt} loading="lazy"/></a>{caption&&<figcaption>{caption}</figcaption>}</figure>;
}
function Prototype({src,poster,label,phone=false}:{src:string;poster:string;label:string;phone?:boolean}) {
  const [play,setPlay]=useState(false);
  const [error,setError]=useState(false);
  return <figure className={`coe-prototype ${phone?'coe-phone':''}`}>
    <div>{play?<video controls autoPlay playsInline poster={poster} src={media+src} aria-label={label} onError={()=>setError(true)}/>:<button onClick={()=>setPlay(true)} aria-label={`Play ${label}`}><img src={poster} alt={label}/><span>▷ Play prototype</span></button>}</div>
    <figcaption>{label} · Concept prototype <a href={poster} target="_blank" rel="noreferrer">View interface ↗</a>{play&&<button onClick={()=>{setPlay(false);setError(false)}}>Show still</button>}</figcaption>
    {error&&<p role="status">Video unavailable. <a href={media+src}>Open video ↗</a></p>}
  </figure>;
}
export function Project3_DigitalEntropy({slugify}:{project:Project;slugify:(text:string)=>string}) {
 const [film,setFilm]=useState(false);
 const heading=(n:string,label:string,title:string)=><header className="coe-heading"><span>{n} / {label}</span><h2>{title}</h2></header>;
 return <div className="coe-case">
  <Image src={mockup} alt="Co-Act tablet and phone interfaces" caption="Machine data, diagnostics and collaboration in one workspace."/>
  <details><summary>Project & team <span>+</span></summary><p className="coe-note">Academic collaboration · Komatsu Forest · 2023<br/>Hanxiong Zhang, Anjuli Acharya, Dide Sevinçok and Lin Wang.<br/>Service vision, GUI design and interaction prototypes.</p></details>
  <section id={slugify('Background')}>
   {heading('01','Background','A machine stops. The work cannot wait.')}
   <div className="coe-context"><Image src={forest} alt="Forestry machine in a snowy forest" caption="Forestry maintenance / Sweden"/><div><p className="coe-lead">−20°C. A machine has stopped in the forest.</p><p>Calls, diagnostics and spare parts bring people together. Co-Act explores how they could share knowledge before and during the repair.</p><p className="coe-note">A five-year forestry service vision, developed with Komatsu Forest.</p></div></div>
  </section>
  <section id={slugify('Ethnography')}>
   {heading('02','Ethnography','Maintenance moves. Knowledge needs to follow.')}
   <p className="coe-section-intro">We followed mechanics in the field to understand the work beyond the screen.</p>
   <div className="coe-field"><figure><video controls muted playsInline preload="metadata" src={media+'navigate.mp4#t=0.1'} aria-label="Field observation: travelling between locations"/><figcaption>Home → workshop → forest. Information must travel with the job.</figcaption></figure><figure><video controls muted playsInline preload="metadata" src={media+'Oil%20leak.mp4#t=0.1'} aria-label="Field observation: inspecting an oil leak"/><figcaption>Gloves, grease and snow. Tools must work beyond the desk.</figcaption></figure></div>
   <div className="coe-quote"><img src={mechanic} alt="Mechanic illustration from the original research"/><div><blockquote>“But there are always back and forth.”</blockquote><p>Mechanic interview / Missing spare parts meant another trip.</p></div></div>
   <details><summary>More voices from the field <span>+</span></summary><div className="coe-voices"><div><img src={apprentice} alt="Mechanic illustration"/><blockquote>“The customers here, they know that it takes time to learn cause they’ve seen new mechanics learn before so...”</blockquote></div><div><img src={driver} alt="Operator illustration"/><blockquote>“This driver who helped alongside, he knows a lot about his machine, while the younger generations are often less involved in the mechanical aspects of machines.”</blockquote></div></div></details>
   <details><summary>Research synthesis board <span>+</span></summary><Image src={board} alt="Original research synthesis board" caption="Team synthesis / Open the image to inspect the full board."/></details>
  </section>
  <section id={slugify('Design Strategy')}>
   {heading('03','Design strategy','Three findings. Three design priorities.')}
   <div className="coe-strategy">{[
    ['Work spans locations','Keep communication mobile.','Connect reports and machine information.'],
    ['Fieldwork is demanding','Prepare before travelling.','Bring component-level diagnosis into preparation.'],
    ['Knowledge is tacit and distributed','Support shared judgement.','Use AI to assist troubleshooting and discussion.']
   ].map(([finding,choice,description],i)=><div key={finding}><span>0{i+1}</span><p>{finding}</p><div><h3>{choice}</h3><p>{description}</p></div></div>)}</div>
  </section>
  <section id={slugify('Collaborative Actions')}>
   {heading('04','Collaborative actions','Take care of the machine together.')}
   <div className="coe-feature coe-report"><Prototype phone src="coact_operatereport.mp4" poster={operator} label="Operator / Report an issue"/><div><span className="coe-label">01 / Report</span><h3>Give the mechanic a starting point.</h3><p>A service ticket shares the issue, machine data and recent activity.</p></div></div>
   <div className="coe-feature"><div className="coe-feature-copy"><h3>One workspace for the job.</h3><p>Jobs and machine information stay together as the work changes location.</p></div><Image src={workspace} alt="Mechanic workspace showing jobs and machine information"/></div>
   <div className="coe-feature"><div className="coe-feature-copy"><div><span className="coe-label">02 / Prepare</span><h3>Diagnose before the visit.</h3></div><p>A component-level view helps mechanics investigate potential faults before entering the forest.</p></div><Prototype src="coact_prognosis.mp4" poster={dashboard} label="Mechanic / Proactive diagnosis"/></div>
   <div className="coe-feature"><div className="coe-feature-copy"><div><span className="coe-label">03 / Reason together</span><h3>AI assistance. Human judgement.</h3></div><p>Signals, inspection records and past faults form a network of possible causes for mechanics to examine.</p></div><Prototype src="coact_smartai.mp4" poster={ai} label="AI assistance / Explore possible causes"/></div>
   <div className="coe-scenes"><Image src={office} alt="Co-Act concept in the workshop office" caption="Concept visualisation / In the workshop"/><Image src={collaboration} alt="Co-Act concept supporting discussion between colleagues" caption="Concept visualisation / In conversation"/></div>
   <p className="coe-closing">Technology supports the conversation. Expertise stays with the people.</p>
  </section>
  <section id={slugify('Concept Video')}>
   {heading('05','Concept film','The complete service vision.')}
   {film?<iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen/>:<button className="coe-film" onClick={()=>setFilm(true)}>Watch the concept film <span>▷</span></button>}
   <a className="coe-film-link" href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open on YouTube ↗</a>
   <p className="coe-note">Outcome / Service vision, GUI and interaction prototypes. Field impact has not been measured.</p>
  </section>
 </div>;
}
