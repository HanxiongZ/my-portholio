import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import forest from '../../assets/imgForestryMachine.jpg';
import mockup from '../../assets/coact_mockup.png';
import operator from '../../assets/coact_operatorhome.png';
import home from '../../assets/coact_home.png';
import dashboard from '../../assets/coact_dashboard.png';
import ai from '../../assets/coact_smartai.png';
import mechanic from '../../assets/Mechanic1.png';
import apprentice from '../../assets/Mechanic2.png';
import driver from '../../assets/Driver1.png';
import research from '../../assets/coact_researchboard.jpeg';
import office from '../../assets/coact_officeview.jpg';
import collaboration from '../../assets/coact_collabview.jpg';
import './coact-journal.css';
const media='https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
const chapters=[['background','01','Background'],['research','02','Field research'],['strategy','03','Design strategy'],['design','04','The design']];
function Picture({src,alt,caption}:{src:string;alt:string;caption?:string}){return <figure><a href={src} target="_blank" rel="noreferrer" aria-label={`Open image: ${alt}`}><img src={src} alt={alt} loading="lazy"/></a>{caption&&<figcaption>{caption}</figcaption>}</figure>}
function Prototype({src,poster,label,phone=false}:{src:string;poster:string;label:string;phone?:boolean}){const[play,setPlay]=useState(false);return <figure className={`cj-prototype ${phone?'cj-phone':''}`}><div className="cj-screen">{play?<video controls autoPlay playsInline poster={poster} src={media+src} aria-label={label}/>:<button onClick={()=>setPlay(true)} aria-label={`Play ${label}`}><img src={poster} alt={label}/><span>Play prototype ↗</span></button>}</div><figcaption><span>{label}</span><a href={poster} target="_blank" rel="noreferrer">View image ↗</a>{play&&<button onClick={()=>setPlay(false)}>Back to still</button>}</figcaption></figure>}
export function CoActJournal(){
 const[active,setActive]=useState('background');
 useEffect(()=>{if(!location.hash)window.scrollTo(0,0);let frame=0;const update=()=>{frame=0;let next='background';for(const [id] of chapters){const el=document.getElementById(`cj-${id}`);if(el&&el.getBoundingClientRect().top<innerHeight*.35)next=id;}setActive(next)};const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule)}},[]);
 return <article className="cj-page"><div className="cj-wrap">
 <div className="cj-topline"><Link to="/">Selected work / 2023</Link><span>Interaction design · Komatsu Forest</span></div>
 <header className="cj-hero"><div className="cj-hero-intro"><p>Taking care of machines,<br/>together.</p><p>Interaction design<br/>Komatsu Forest, Sweden</p></div><h1>Co—Act<span>2023</span></h1></header>
 <div className="cj-opening"><div className="cj-opening-copy"><p className="cj-eyebrow">A five-year service vision</p><h2>People.<br/>Machines.<br/>Knowledge.</h2><p>Bringing machine data, diagnostics, and collaboration into one workspace.</p><a href="#cj-background">Inside the project <span aria-hidden="true">↓</span></a></div><figure className="cj-cover"><img src={mockup} alt="Co-Act mobile and tablet workspace"/><figcaption>One workspace / Operator & mechanic interfaces</figcaption></figure></div>
 <div className="cj-layout"><aside className="cj-nav"><div><p className="cj-eyebrow">Inside the project</p><nav aria-label="Co-Act chapters">{chapters.map(([id,n,title])=><a key={id} href={`#cj-${id}`} aria-current={active===id?'location':undefined}><span>{n}</span>{title}</a>)}</nav><p className="cj-credit">Co-Act<br/>Komatsu Forest, 2023</p><Link className="cj-original" to="/project/3">Original project ↗</Link></div></aside>
 <div className="cj-story">
 <section id="cj-background" className="cj-section"><div className="cj-sectionbar"><span>01 / Background</span><span>People · Machines · Knowledge</span></div>
 <div className="cj-context"><h2>When a machine stops,<br/>people come together.</h2><div><p className="cj-lead">Co-Act explores how people, machines and AI can reason together in forestry maintenance.</p><p>A five-year service vision developed with Komatsu Forest, connecting the operator’s experience with the mechanic’s knowledge and machine data.</p></div></div>
 <dl className="cj-facts"><div><dt>My contribution</dt><dd>Field research & synthesis<br/>Concept development<br/>AI-assisted decision-making<br/>Figma interaction prototypes</dd></div><div><dt>Project</dt><dd>Academic collaboration<br/>Service vision & GUI design<br/>2023</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang · Anjuli Acharya<br/>Dide Sevinçok · Lin Wang</dd></div></dl>
 <div className="cj-scenario"><Picture src={forest} alt="Forestry machine in a snow-covered forest" caption="The setting / Forestry maintenance in Sweden"/><div><span className="cj-temperature">−20°<small>C</small></span><h3>A forestry machine<br/>has stopped working.</h3><p>Calls are made.<br/>People arrive on-site.<br/>Diagnostics are pulled.<br/>Parts are checked.</p><p className="cj-scenario-end">The work cannot wait.</p></div></div>
 </section>
 <section id="cj-research" className="cj-section"><div className="cj-sectionbar"><span>02 / Field research</span><span>Observation & conversation</span></div>
 <div className="cj-heading"><h2>Into<br/><span>the field.</span></h2><p>We spent time with mechanics to understand how work unfolds in the field—from travelling between locations to inspecting a machine and drawing on past experience.</p></div>
 <div className="cj-fieldspread"><figure><video controls muted playsInline preload="metadata" src={media+'Oil%20leak.mp4#t=0.1'} aria-label="Field observation: investigating an oil leak"/><figcaption>Field observation / Investigating an oil leak</figcaption></figure><div><h3>Far from a desk.</h3><p>Digital tools must compete with gloves, grease, snow, and unstable surfaces. Jobs take mechanics from home to workshop to deep forest.</p><figure className="cj-travel"><video controls muted playsInline preload="metadata" src={media+'navigate.mp4#t=0.1'} aria-label="Field observation: navigating between locations"/><figcaption>Moving between locations</figcaption></figure></div></div>
 <div className="cj-interviews"><p className="cj-eyebrow">Voices from the field</p>{[
 [mechanic,'Mechanic','“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”'],
 [apprentice,'Mechanic','“When I was new to here, I didn’t experience the hard time. The customers here, they know that it takes time to learn cause they’ve seen new mechanics learn before so...”'],
 [driver,'On the operator’s experience','“This driver who helped alongside, he knows a lot about his machine, while the younger generations are often less involved in the mechanical aspects of machines.”']
 ].map(([src,label,quote])=><div className="cj-interview" key={label+src}><img src={src} alt="Participant illustration from the original research" loading="lazy"/><p className="cj-caption">{label}</p><blockquote>{quote}</blockquote></div>)}</div>
 <Picture src={research} alt="Original Co-Act research synthesis board" caption="Research synthesis / Connecting field observations and conversations"/>
 <div className="cj-findings">{[
 ['Mobile ways of working','Maintenance happens across locations, but tools and information do not.'],
 ['Harsh conditions for field work','Field conditions demand tools that work beyond desks and controlled environments.'],
 ['Tacit and distributed knowledge','Machine knowledge is scattered across systems, documents, and human experience.']
 ].map(([title,body],i)=><div key={title}><span className="cj-caption">0{i+1}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
 </section>
 <section id="cj-strategy" className="cj-section"><div className="cj-sectionbar"><span>03 / Design strategy</span><span>From research to direction</span></div>
 <h2 className="cj-statement">Connect the knowledge.<br/><span>Keep the human.</span></h2>
 <div className="cj-strategies">{[
 ['How might we support maintenance across locations?','Strengthen communication','Make reporting and machine information available to both operators and mechanics.'],
 ['How might we support more accurate troubleshooting?','Diagnose proactively','Bring component-level information into preparation, with AI assisting the investigation.'],
 ['How might we make tacit knowledge easier to exchange?','Design for collaboration','Create room for shared reasoning while keeping human experience central.']
 ].map(([q,title,body])=><div key={title}><p>{q}</p><div><h3>{title}</h3><p>{body}</p></div></div>)}</div>
 </section>
 <section id="cj-design" className="cj-section"><div className="cj-sectionbar"><span>04 / The design</span><span>Interface & interaction</span></div>
 <div className="cj-heading"><h2>From insight<br/><span>to interaction.</span></h2><p>Co-Act brings reporting, diagnosis and discussion into a collaborative interface for the people taking care of a machine.</p></div>
 <div className="cj-report"><Prototype phone src="coact_operatereport.mp4" poster={operator} label="Operator / Reporting an issue"/><div><p className="cj-eyebrow">01 / Stay connected</p><h3>Report issues<br/>in seconds.</h3><p>Operators can create a service ticket with a few clicks, sharing machine data and recent activity with the mechanics.</p><p className="cj-note">Design focus / Carry the context of the issue into the next conversation.</p></div></div>
 <div className="cj-workspace"><div><p className="cj-eyebrow">02 / Prepare for the job</p><h3>Synced information<br/>for the jobs.</h3><p>A mechanic’s view brings jobs and machine information into a common workspace.</p></div><Picture src={home} alt="Mechanic’s workspace with jobs and machine information"/></div>
 <div className="cj-feature"><div className="cj-featurecopy"><h3>Run a proactive<br/>diagnosis.</h3><p>Component-level visualisation helps mechanics identify where issues might occur. The goal is more accurate troubleshooting before going into the field.</p></div><Prototype src="coact_prognosis.mp4" poster={dashboard} label="Mechanic / Component-level diagnosis"/></div>
 <div className="cj-feature cj-ai"><div className="cj-featurecopy"><div><p className="cj-eyebrow">03 / Reason together</p><h3>AI-assisted<br/>troubleshooting.</h3></div><div><p>Instead of presenting a single AI-generated answer, Co-Act reveals the reasoning process behind potential causes. Signals, inspection records, and historical faults are connected through a visual network.</p><p className="cj-note">My focus / The AI-assisted decision-making concept and its Figma prototype.</p></div></div><Prototype src="coact_smartai.mp4" poster={ai} label="AI assistance / Connecting possible causes"/></div>
 <div className="cj-expertise"><h3>Supporting expert judgement.</h3><p>Co-Act facilitates mobile work and open discussions. Technology assists the process—it does not replace experience.</p></div>
 <div className="cj-scenes"><Picture src={office} alt="Co-Act concept in a workshop office" caption="In the workshop"/><Picture src={collaboration} alt="Mechanics discussing information together" caption="In conversation"/></div>
 <a className="cj-film" href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer"><span>Watch the concept film</span><span>↗</span></a><p className="cj-outcome">Project outcome / Service vision, GUI concept and interaction prototypes. Proposed benefits have not been measured in field deployment.</p>
 </section><footer className="cj-footer"><Link to="/">← Selected work</Link><Link to="/project/3">Original Co-Act project ↗</Link></footer>
 </div></div></div></article>
}
