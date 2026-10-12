import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import forest from '../../assets/imgForestryMachine.jpg';
import mockup from '../../assets/coact_mockup.png';
import operator from '../../assets/coact_operatorhome.png';
import dashboard from '../../assets/coact_dashboard.png';
import ai from '../../assets/coact_smartai.png';
import mechanic from '../../assets/Mechanic1.png';
import research from '../../assets/coact_researchboard.jpeg';
import collaboration from '../../assets/coact_collabview.jpg';
import workspace from '../../assets/coact_home.png';
import { PortfolioArrow } from './PortfolioArrow';
import './coact-case.css';

const media = 'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
const chapters = [['cc-context','01','Context'],['cc-field','02','Field notes'],['cc-strategy','03','Design decisions'],['cc-interactions','04','Interactions'],['cc-use','05','Outcome']];

function Figure({src,alt,caption,className=''}:{src:string;alt:string;caption:string;className?:string}) {
  return <figure className={`cc-figure ${className}`}><a href={src} target="_blank" rel="noreferrer" aria-label={`${alt}. Open full-size image`}><img src={src} alt={alt} loading="lazy" /></a><figcaption>{caption}</figcaption></figure>;
}
function Demo({src,poster,title,phone=false}:{src:string;poster:string;title:string;phone?:boolean}) {
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState(false);
  return <figure className={`cc-demo ${phone?'cc-demo-phone':''}`}>
    <div className="cc-demo-media">{loaded?<video src={media+src} controls autoPlay playsInline preload="metadata" poster={poster} aria-label={title} onError={()=>setError(true)}/>:<button className="cc-demo-cover" onClick={()=>setLoaded(true)} aria-label={`Play ${title}`}><img src={poster} alt={title}/><span className="cc-play"><span aria-hidden="true">▷</span> Play interaction</span></button>}</div>
    <figcaption><span>Concept prototype</span><a href={poster} target="_blank" rel="noreferrer">View full-size interface ↗</a>{loaded&&<button onClick={()=>{setLoaded(false);setError(false);}}>Show still</button>}</figcaption>
    {error&&<p role="status" className="cc-media-error">The video could not load. <a href={media+src} target="_blank" rel="noreferrer">Open the prototype video ↗</a></p>}
  </figure>;
}
export function CoActCase() {
  const root=useRef<HTMLElement>(null);
  const [active,setActive]=useState('cc-context');
  const [film,setFilm]=useState(false);
  useEffect(()=>{
    if(!window.location.hash) window.scrollTo(0,0);
    let frame=0;
    const update=()=>{frame=0;const sections=Array.from(root.current?.querySelectorAll<HTMLElement>('.cc-chapter')??[]);let id=sections[0]?.id;for(const s of sections) if(s.getBoundingClientRect().top<window.innerHeight*.4) id=s.id;if(id)setActive(id);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[]);
  return <article className="cc-page" ref={root}>
    <div className="cc-shell">
      <header className="cc-hero">
        <div className="cc-title"><Link className="cc-back" to="/">← Selected work</Link><h1>Co-Act<span className="cc-title-dot">.</span></h1><p>Komatsu Forest<br/>Interaction design · 2023</p></div>
        <div className="cc-hero-copy"><p className="cc-label">A connected service concept</p><h2>Shared expertise.<br/>From forest to workshop.</h2><p>When a forestry machine stops, the right knowledge is rarely in one place. Co-Act connects operators, mechanics and machine data in a shared maintenance workspace.</p><a className="portfolio-button portfolio-button--down cc-link" href="#cc-interactions">Explore the interactions <PortfolioArrow direction="down"/></a></div>
      </header>
      <div className="cc-opening">
        <figure className="cc-opening-field"><img src={forest} width="750" height="450" alt="Forestry machine being serviced in a snowy forest"/><figcaption>Where the work happens.<br/>Komatsu Forest, Sweden.</figcaption></figure>
        <figure className="cc-opening-product"><a href={mockup} target="_blank" rel="noreferrer" aria-label="View the Co-Act concept interface at full size"><img src={mockup} width="1396" height="824" alt="Co-Act interface on a rugged tablet and phone"/></a><figcaption>The proposal / Operator reporting and mechanic diagnosis. Concept prototype.</figcaption></figure>
      </div>
      <div className="cc-body">
        <aside className="cc-aside"><div><p className="cc-label">Inside the project</p><nav aria-label="Case study chapters">{chapters.map(([id,n,label])=><a href={`#${id}`} key={id} aria-current={active===id?'location':undefined}><span>{n}</span>{label}</a>)}</nav><p className="cc-aside-credit">Co-Act<br/>Komatsu Forest, 2023</p></div></aside>
        <div className="cc-story">
          <section className="cc-chapter" id="cc-context">
            <div className="cc-section-heading"><p className="cc-label">01 / Context</p><h2>Connecting people,<br/>machines and knowledge.</h2></div>
            <div className="cc-context-grid"><div><p className="cc-intro">A machine’s condition lives in more than its data. It also lives in the experience of the people who operate and maintain it.</p><p>Previous repairs, temporary fixes and local conditions can all help explain a fault. Yet this knowledge is distributed across people, documents and systems.</p><p>Co-Act is a five-year service vision developed with Komatsu Forest. It explores how a shared interface could connect that practical knowledge with machine information, before and during a repair.</p></div><dl className="cc-meta"><div><dt>Project</dt><dd>Academic collaboration<br/>Komatsu Forest</dd></div><div><dt>Deliverable</dt><dd>Service vision, GUI concept<br/>and interaction prototypes</dd></div><div><dt>My contribution</dt><dd>Field research & synthesis<br/>Concept development, with a focus on AI-assisted decisions<br/>Figma interaction prototypes</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang<br/>Anjuli Acharya<br/>Dide Sevinçok<br/>Lin Wang</dd></div></dl></div>
          </section>
          <section className="cc-chapter" id="cc-field">
            <div className="cc-section-heading"><p className="cc-label">02 / Field notes</p><h2>Understanding<br/>the work.</h2></div>
            <div className="cc-field-intro"><p>Time alongside mechanics revealed a service that moves between the workshop and the forest. Preparation, travel and hands-on investigation are all part of the same job.</p></div>
            <div className="cc-observation"><figure><video controls muted playsInline preload="metadata" src={media+'navigate.mp4#t=0.1'} aria-label="Fieldwork: moving between locations"/><figcaption>Fieldwork · Moving between locations.</figcaption></figure><div><h3>Information needs<br/>to travel with the job.</h3><p>Mechanics move between home, workshop and forest. The operator’s account and machine history need to remain available as the work changes location.</p><p className="cc-decision"><span>Design response</span>Bring the report and machine context into a shared workspace.</p></div></div>
            <div className="cc-quote"><img src={mechanic} alt="Mechanic from the original fieldwork" loading="lazy"/><div><blockquote>“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”</blockquote><p className="cc-caption">Mechanic interview · Original research excerpt</p></div></div>
            <div className="cc-observation cc-observation-reverse"><figure><video controls muted playsInline preload="metadata" src={media+'Oil%20leak.mp4#t=0.1'} aria-label="Fieldwork: investigating an oil leak"/><figcaption>Fieldwork · Inspecting an oil leak.</figcaption></figure><div><h3>Preparation is<br/>part of the repair.</h3><p>Unexpected problems can mean another journey for parts. Knowing more about the machine before setting out becomes an important part of the service.</p><p className="cc-decision"><span>Design response</span>Make component-level diagnosis available before the visit.</p></div></div>
            <div className="cc-synthesis"><h3>Keep the mechanic’s judgement in the loop.</h3><p>Machine data becomes more useful when it can be considered alongside experience. Co-Act proposes a visual network of possible causes, giving mechanics relationships to examine and discuss.</p><details><summary>Read the research synthesis <span aria-hidden="true">+</span></summary><Figure src={research} alt="Co-Act research synthesis board" caption="Team synthesis · Open the full-size image to inspect the evidence."/></details></div>
          </section>
          <section className="cc-chapter" id="cc-strategy">
            <div className="cc-section-heading"><p className="cc-label">03 / Design decisions</p><h2>Make knowledge travel.<br/>Keep judgement human.</h2></div>
            <p className="cc-interactions-lead">The fieldwork led to three priorities. Each translates a maintenance problem into an interaction the prototype can demonstrate.</p>
            <div className="cc-decisions">
              <div><span className="cc-label">01 / Across locations</span><h3>Carry the context.</h3><p>Reports and machine history are distributed across people and places.</p><p className="cc-decision"><span>Design choice</span>A service ticket links the operator’s account to machine data, giving the mechanic a shared starting point.</p><a href="#cc-report">See reporting <span aria-hidden="true">↘</span></a></div>
              <div><span className="cc-label">02 / Before the visit</span><h3>Prepare with evidence.</h3><p>Unexpected faults and missing parts can mean another trip.</p><p className="cc-decision"><span>Design choice</span>A component-level view brings diagnosis into preparation, before the mechanic travels to the machine.</p><a href="#cc-prepare">See diagnosis <span aria-hidden="true">↘</span></a></div>
              <div><span className="cc-label">03 / With AI assistance</span><h3>Expose relationships.</h3><p>Practical experience holds context that machine data alone cannot explain.</p><p className="cc-decision"><span>Design choice</span>A network of possible causes supports discussion and investigation while leaving the judgement with the mechanic.</p><a href="#cc-reason">See shared reasoning <span aria-hidden="true">↘</span></a></div>
            </div>
          </section>
          <section className="cc-chapter" id="cc-interactions">
            <div className="cc-section-heading"><p className="cc-label">04 / Interactions</p><h2>From a reported fault<br/>to a shared diagnosis.</h2></div>
            <p className="cc-interactions-lead">Three moments bring the proposal into focus: reporting the issue, preparing for the visit, and reasoning through the fault.</p>
            <nav className="cc-task-nav" aria-label="Interaction sequence"><a href="#cc-report">Report <span>↗</span></a><a href="#cc-prepare">Prepare <span>↗</span></a><a href="#cc-reason">Reason together <span>↗</span></a></nav>
            <div className="cc-phone-feature" id="cc-report"><div><p className="cc-label">Operator → mechanic</p><h3>Give the mechanic<br/>a useful starting point.</h3><p>The operator creates a service ticket and shares machine data and recent activity. The report carries the context into the mechanic’s preparation.</p><p className="cc-decision"><span>Interaction focus</span>Connect the issue to the machine, rather than leave it as an isolated message.</p></div><Demo phone src="coact_operatereport.mp4" poster={operator} title="Operator reporting prototype"/></div>
            <div className="cc-feature" id="cc-prepare"><div className="cc-feature-heading"><div><p className="cc-label">Before the visit</p><h3>Inspect the machine<br/>before entering the forest.</h3></div><p>A component-level view helps mechanics investigate potential faults while preparing for a job. The intention is to support a more informed decision about what to bring.</p></div><Demo src="coact_prognosis.mp4" poster={dashboard} title="Component diagnosis prototype"/></div>
            <div className="cc-feature" id="cc-reason"><div className="cc-feature-heading"><div><p className="cc-label">AI-assisted troubleshooting</p><h3>Show the connections.<br/>Support the judgement.</h3></div><p>I focused on the AI-assisted decision-making concept and its Figma prototype. Signals, inspection records and past faults form a network of possible causes. The interface exposes relationships for the mechanic to consider, instead of presenting a single unexplained answer.</p></div><Demo src="coact_smartai.mp4" poster={ai} title="AI-assisted troubleshooting prototype"/></div>
          </section>
          <section className="cc-chapter" id="cc-use">
            <div className="cc-section-heading"><p className="cc-label">05 / Outcome</p><h2>A workspace<br/>for shared expertise.</h2></div>
            <Figure src={collaboration} alt="Co-Act concept showing colleagues discussing a machine" caption="Concept visualisation · Information becomes part of a working conversation."/>
            <div className="cc-use-grid"><Figure src={workspace} alt="Co-Act mechanic workspace with jobs and machine information" caption="A common starting point for jobs and machine information."/><div><h3>From individual knowledge<br/>to shared context.</h3><p>Co-Act brings reporting, diagnosis and discussion together. Its contribution is a service concept that treats machine information and human experience as complementary parts of maintenance.</p></div></div>
            <div className="cc-reflection"><h3>What the concept establishes.<br/>What remains open.</h3><div><p>The project proposes a connected workflow and demonstrates its key interactions through GUI prototypes.</p><p>The effect on repair journeys, knowledge sharing and maintenance decisions has not been measured. These remain questions for evaluation in real service work.</p></div></div>
            <div className="cc-film">{film?<iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen/>:<button onClick={()=>setFilm(true)}>Watch the complete concept film <span aria-hidden="true">▷</span></button>}<a href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open on YouTube ↗</a></div>
          </section>
          <footer className="cc-footer"><Link className="portfolio-button" to="/">← Selected work</Link><Link className="portfolio-button portfolio-button--right" to="/project/4">Next / Inside the Machine <PortfolioArrow direction="right"/></Link></footer>
        </div>
      </div>
    </div>
  </article>;
}
