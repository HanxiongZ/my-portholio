import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import forest from '../../assets/imgForestryMachine.jpg';
import mockup from '../../assets/coact_mockup.png';
import operator from '../../assets/coact_operatorhome.png';
import dashboard from '../../assets/coact_dashboard.png';
import ai from '../../assets/coact_smartai.png';
import mechanic from '../../assets/Mechanic1.png';
import research from '../../assets/coact_researchboard.jpeg';
import collaboration from '../../assets/coact_collabview.jpg';
import './coact-fieldnotes-light.css';

const media = 'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
const interactions = [
  {title:'Report', role:'Operator → mechanic', heading:'A useful conversation starts before the visit.', body:'The operator creates a service ticket with machine data and recent activity. The mechanic receives the context alongside the problem.', detail:'Carry information between people and places.', image:operator, file:'coact_operatereport.mp4', alt:'Operator issue-reporting interface'},
  {title:'Prepare', role:'Mechanic → machine', heading:'Inspect the machine before going into the forest.', body:'A component-level view makes machine condition available during preparation. Mechanics can investigate potential faults before deciding what to bring.', detail:'Bring machine condition into the planning process.', image:dashboard, file:'coact_prognosis.mp4', alt:'Component-level machine diagnosis interface'},
  {title:'Reason together', role:'Experience + machine data', heading:'Make possible causes available for discussion.', body:'A visual network connects signals, inspection records and past faults. AI-assisted suggestions sit alongside the mechanic’s experience, keeping expert judgement central.', detail:'Expose relationships rather than present an unexplained answer.', image:ai, file:'coact_smartai.mp4', alt:'AI-assisted troubleshooting network'},
];
export function CoActFieldnotesLight() {
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [chapter,setChapter]=useState('cfl-context');
  const [film,setFilm]=useState(false);
  const item=interactions[step];
  useEffect(()=>{
    window.scrollTo(0,0);
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting);
      if(visible.length) setChapter(visible[0].target.id);
    },{rootMargin:'-15% 0px -55% 0px'});
    document.querySelectorAll('.cfl-chapter').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  return <article className="cfl-page">
    <div className="cfl-wrap">
      <div className="cfl-breadcrumb"><Link to="/">Selected work</Link><span>/</span><span>Co-Act</span><Link to="/project/3">Original case ↗</Link></div>
      <header className="cfl-hero">
        <figure className="cfl-landscape"><img src={forest} alt="Forestry machine working among snow-covered trees"/><figcaption><span>In the field</span><span>Komatsu Forest · 2023</span></figcaption></figure>
        <div className="cfl-hero-copy"><p className="cfl-kicker">Interaction design / Service vision</p><h1>Co-Act</h1><p className="cfl-headline">The knowledge<br/>behind the repair.</p><p className="cfl-introduction">A collaborative workspace connecting forestry operators, service mechanics and the machines they care for.</p><a className="cfl-textlink" href="#cfl-interactions">Explore the interactions <span>↓</span></a><div className="cfl-hero-meta"><span>Academic collaboration<br/><b>Komatsu Forest</b></span><span>Outcome<br/><b>GUI concept & prototype</b></span></div></div>
      </header>
      <div className="cfl-product-spread"><div className="cfl-product-note"><span className="cfl-kicker">The proposal</span><p>A shared view.<br/>From the workshop<br/>to the forest.</p><span className="cfl-tiny">Operator + mechanic<br/>Mobile & tablet interfaces</span></div><img src={mockup} alt="Co-Act interface presented on a rugged tablet and mobile device"/></div>
      <div className="cfl-body"><aside className="cfl-aside"><div><span className="cfl-kicker">Inside the project</span><nav aria-label="Case study chapters">{[['cfl-context','01','Context'],['cfl-field','02','Field notes'],['cfl-interactions','03','Interactions'],['cfl-outcome','04','In use']].map(([id,n,label])=><a key={id} href={'#'+id} aria-current={chapter===id?'location':undefined}><span>{n}</span>{label}</a>)}</nav><p>Co-Act<br/>Komatsu Forest, 2023</p></div></aside>
      <div className="cfl-story">
        <section className="cfl-chapter" id="cfl-context"><p className="cfl-kicker">01 / Context</p><h2>Not everything a mechanic<br/>knows is in the system.</h2><div className="cfl-context-copy"><p>A fault code is only part of the story. A previous repair, an unfamiliar sound or an operator’s experience can be just as important when understanding a machine.</p><p>Developed with Komatsu Forest as a five-year service vision, Co-Act explores how machine information and practical knowledge can meet in one workspace.</p></div><dl className="cfl-credits"><div><dt>Focus</dt><dd>Collaborative maintenance<br/>Interaction & GUI design</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang · Anjuli Acharya<br/>Dide Sevinçok · Lin Wang</dd></div></dl></section>
        <section className="cfl-chapter" id="cfl-field"><p className="cfl-kicker">02 / Field notes</p><h2>Learning where<br/>the work happens.</h2><div className="cfl-observation"><figure><video controls muted playsInline preload="metadata" src={media+'navigate.mp4#t=0.1'} aria-label="Fieldwork: moving between locations"/><figcaption>Fieldwork excerpt / Moving between locations</figcaption></figure><div><h3>Work moves.<br/>Knowledge needs to follow.</h3><p>Mechanics move between home, workshop and forest. The information needed for a repair has to travel with them. This led us to bring the operator’s report and machine data into one shared workspace.</p><a href="#cfl-interactions" onClick={()=>{setStep(0);setPlaying(false);}}>Design response: shared reporting ↗</a></div></div>
        <div className="cfl-quote-spread"><img src={mechanic} alt="Mechanic from the original fieldwork material" loading="lazy"/><div><span className="cfl-kicker">A mechanic’s perspective</span><blockquote>“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”</blockquote><span className="cfl-tiny">Interview excerpt / Original project research</span></div></div>
        <div className="cfl-observation cfl-observation-reverse"><figure><video controls muted playsInline preload="metadata" src={media+'Oil%20leak.mp4#t=0.1'} aria-label="Fieldwork: investigating an oil leak"/><figcaption>Fieldwork excerpt / Investigating an oil leak</figcaption></figure><div><h3>Preparation is part<br/>of the repair.</h3><p>Unexpected problems can mean another trip for parts. This shaped the remote diagnosis concept: make component-level information available while the mechanic is still preparing for the visit.</p><a href="#cfl-interactions" onClick={()=>{setStep(1);setPlaying(false);}}>Design response: remote diagnosis ↗</a></div></div>
        <div className="cfl-research-bridge"><h3>Experience gives the data meaning.</h3><p>A previous repair, an unfamiliar sound and the operator’s knowledge add context to machine data. Co-Act therefore makes possible causes visible for discussion, keeping the mechanic’s judgement central.</p><a href="#cfl-interactions" onClick={()=>{setStep(2);setPlaying(false);}}>Design response: shared reasoning ↗</a></div><details className="cfl-research"><summary>Behind the decisions <span>Research synthesis +</span></summary><figure><a href={research} target="_blank" rel="noreferrer"><img src={research} alt="Co-Act research synthesis board; open full-size image" loading="lazy"/></a><figcaption>Team synthesis board. Select the image to inspect the original.</figcaption></figure></details></section>
        <section className="cfl-chapter" id="cfl-interactions"><p className="cfl-kicker">03 / Interactions</p><div className="cfl-section-intro"><h2>One machine.<br/>A shared understanding.</h2><p>The field observations become three connected interactions: carry the context, prepare before travelling, and reason through the fault together.</p></div>
        <div className="cfl-switcher" role="group" aria-label="Choose an interaction">{interactions.map((s,i)=><button key={s.title} aria-pressed={step===i} onClick={()=>{setStep(i);setPlaying(false);}}><span>0{i+1}</span>{s.title}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="cfl-demo-copy" aria-live="polite"><div><span className="cfl-kicker">{item.role}</span><h3>{item.heading}</h3></div><p>{item.body}</p></div>
        <div className={'cfl-demo '+(step===0?'cfl-demo-phone':'')}>
          {playing?<video key={item.file} controls playsInline preload="metadata" poster={item.image} src={media+item.file} aria-label={item.alt}/>:<button className="cfl-demo-open" onClick={()=>setPlaying(true)} aria-label={'Watch prototype: '+item.title}><img src={item.image} alt={item.alt} loading="lazy"/></button>}
        </div><div className="cfl-demo-actions"><button type="button" onClick={()=>setPlaying(!playing)}>{playing?"Show interface":"Watch prototype"} <span aria-hidden="true">{playing?"↗":"▷"}</span></button><a href={item.image} target="_blank" rel="noreferrer">Open full-size interface ↗</a></div><div className="cfl-demo-caption"><span>Design intention</span><p>{item.detail}</p><span>0{step+1} / 03</span></div></section>
        <section className="cfl-chapter" id="cfl-outcome"><p className="cfl-kicker">04 / In use</p><h2>Designed around<br/>a working conversation.</h2><figure className="cfl-in-use"><img src={collaboration} alt="Co-Act concept showing colleagues discussing machine information" loading="lazy"/><figcaption>Concept visualisation / Bringing information into the conversation.</figcaption></figure><div className="cfl-closing"><h3>Supporting expertise,<br/>wherever it is needed.</h3><div><p>Co-Act brings reporting, diagnosis and AI-assisted reasoning into a connected service concept. Its central question is how digital tools can make experience easier to share.</p><p className="cfl-tiny">Academic concept and prototype. Proposed benefits are design intentions, not measured service outcomes.</p></div></div>
        <div className="cfl-film">{film?<iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen/>:<button onClick={()=>setFilm(true)}><span>▷</span><div><span className="cfl-kicker">The complete story</span><b>Watch the concept film</b></div><span>↗</span></button>}<a href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open on YouTube ↗</a></div></section>
      </div></div>
      <footer className="cfl-footer"><span>Co-Act / Komatsu Forest</span><Link to="/project/co-act-fieldnotes">Compare Fieldnotes ↗</Link><Link to="/">Back to selected work ↗</Link></footer>
    </div>
  </article>;
}
