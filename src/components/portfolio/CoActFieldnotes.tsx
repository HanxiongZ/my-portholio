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
import './coact-fieldnotes.css';

const media = 'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
const interactions = [
  {title:'Report', role:'Operator → mechanic', heading:'A useful conversation starts before the visit.', body:'The operator creates a service ticket with machine data and recent activity. The mechanic receives the context alongside the problem.', detail:'Carry information between people and places.', image:operator, file:'coact_operatereport.mp4', alt:'Operator issue-reporting interface'},
  {title:'Prepare', role:'Mechanic → machine', heading:'Inspect the machine before going into the forest.', body:'A component-level view makes machine condition available during preparation. Mechanics can investigate potential faults before deciding what to bring.', detail:'Bring machine condition into the planning process.', image:dashboard, file:'coact_prognosis.mp4', alt:'Component-level machine diagnosis interface'},
  {title:'Reason together', role:'Experience + machine data', heading:'Make possible causes available for discussion.', body:'A visual network connects signals, inspection records and past faults. AI-assisted suggestions sit alongside the mechanic’s experience, keeping expert judgement central.', detail:'Expose relationships rather than present an unexplained answer.', image:ai, file:'coact_smartai.mp4', alt:'AI-assisted troubleshooting network'},
];
export function CoActFieldnotes() {
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [chapter,setChapter]=useState('cf-context');
  const [film,setFilm]=useState(false);
  const item=interactions[step];
  useEffect(()=>{
    window.scrollTo(0,0);
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting);
      if(visible.length) setChapter(visible[0].target.id);
    },{rootMargin:'-15% 0px -55% 0px'});
    document.querySelectorAll('.cf-chapter').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  return <article className="cf-page">
    <div className="cf-wrap">
      <div className="cf-breadcrumb"><Link to="/">Selected work</Link><span>/</span><span>Co-Act</span><Link to="/project/3">Original case ↗</Link></div>
      <header className="cf-hero">
        <figure className="cf-landscape"><img src={forest} alt="Forestry machine working among snow-covered trees"/><figcaption><span>In the field</span><span>Komatsu Forest · 2023</span></figcaption></figure>
        <div className="cf-hero-copy"><p className="cf-kicker"><span className="cf-dot"/>Interaction design / Service vision</p><h1>Co-Act<span>↗</span></h1><p className="cf-headline">The knowledge<br/>behind the repair.</p><p className="cf-introduction">A collaborative workspace connecting forestry operators, service mechanics and the machines they care for.</p><a className="cf-textlink" href="#cf-interactions">Explore the interactions <span>↓</span></a><div className="cf-hero-meta"><span>Academic collaboration<br/><b>Komatsu Forest</b></span><span>Outcome<br/><b>GUI concept & prototype</b></span></div></div>
      </header>
      <div className="cf-product-spread"><div className="cf-product-note"><span className="cf-kicker">The proposal</span><p>A shared view.<br/>From the workshop<br/>to the forest.</p><span className="cf-tiny">Operator + mechanic<br/>Mobile & tablet interfaces</span></div><img src={mockup} alt="Co-Act interface presented on a rugged tablet and mobile device"/><span className="cf-figure-number">FIG. 01</span></div>
      <div className="cf-body"><aside className="cf-aside"><div><span className="cf-kicker">Inside the project</span><nav aria-label="Case study chapters">{[['cf-context','01','Context'],['cf-field','02','Field notes'],['cf-interactions','03','Interactions'],['cf-outcome','04','In use']].map(([id,n,label])=><a key={id} href={'#'+id} aria-current={chapter===id?'location':undefined}><span>{n}</span>{label}</a>)}</nav><p>Co-Act<br/>Komatsu Forest, 2023</p></div></aside>
      <div className="cf-story">
        <section className="cf-chapter" id="cf-context"><p className="cf-kicker">01 / Context</p><h2>Not everything a mechanic<br/>knows is in the system.</h2><div className="cf-context-copy"><p>A fault code is only part of the story. A previous repair, an unfamiliar sound or an operator’s experience can be just as important when understanding a machine.</p><p>Developed with Komatsu Forest as a five-year service vision, Co-Act explores how machine information and practical knowledge can meet in one workspace.</p></div><dl className="cf-credits"><div><dt>Focus</dt><dd>Collaborative maintenance<br/>Interaction & GUI design</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang · Anjuli Acharya<br/>Dide Sevinçok · Lin Wang</dd></div></dl></section>
        <section className="cf-chapter" id="cf-field"><p className="cf-kicker">02 / Field notes</p><h2>Learning where<br/>the work happens.</h2><div className="cf-observation"><figure><video controls muted playsInline preload="metadata" src={media+'navigate.mp4#t=0.1'} aria-label="Fieldwork: moving between locations"/><figcaption>Fieldwork excerpt / Moving between locations</figcaption></figure><div><span className="cf-mark">A</span><h3>Work moves.<br/>Knowledge needs to follow.</h3><p>Mechanics move between home, workshop and forest. Co-Act brings the report and machine information into a shared workspace.</p><a href="#cf-interactions" onClick={()=>{setStep(0);setPlaying(false);}}>Design response: shared reporting ↗</a></div></div>
        <div className="cf-quote-spread"><img src={mechanic} alt="Mechanic from the original fieldwork material" loading="lazy"/><div><span className="cf-kicker">A mechanic’s perspective</span><blockquote>“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”</blockquote><span className="cf-tiny">Interview excerpt / Original project research</span></div></div>
        <div className="cf-observation cf-observation-reverse"><figure><video controls muted playsInline preload="metadata" src={media+'Oil%20leak.mp4#t=0.1'} aria-label="Fieldwork: investigating an oil leak"/><figcaption>Fieldwork excerpt / Investigating an oil leak</figcaption></figure><div><span className="cf-mark">B</span><h3>Preparation is part<br/>of the repair.</h3><p>Unexpected problems can mean another trip for parts. The concept makes component-level information available before the visit.</p><a href="#cf-interactions" onClick={()=>{setStep(1);setPlaying(false);}}>Design response: remote diagnosis ↗</a></div></div>
        <details className="cf-research"><summary>Behind the decisions <span>Research synthesis +</span></summary><figure><a href={research} target="_blank" rel="noreferrer"><img src={research} alt="Co-Act research synthesis board; open full-size image" loading="lazy"/></a><figcaption>Team synthesis board. Select the image to inspect the original.</figcaption></figure></details></section>
        <section className="cf-chapter" id="cf-interactions"><p className="cf-kicker">03 / Interactions</p><div className="cf-section-intro"><h2>One machine.<br/>A shared understanding.</h2><p>Follow the proposed service from the first report to an informed discussion of possible causes.</p></div>
        <div className="cf-switcher" role="group" aria-label="Choose an interaction">{interactions.map((s,i)=><button key={s.title} aria-pressed={step===i} onClick={()=>{setStep(i);setPlaying(false);}}><span>0{i+1}</span>{s.title}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="cf-demo-copy" aria-live="polite"><div><span className="cf-kicker">{item.role}</span><h3>{item.heading}</h3></div><p>{item.body}</p></div>
        <div className={'cf-demo '+(step===0?'cf-demo-phone':'')}>
          {playing?<video key={item.file} controls playsInline preload="metadata" poster={item.image} src={media+item.file} aria-label={item.alt}/>:<button className="cf-demo-open" onClick={()=>setPlaying(true)} aria-label={'Watch prototype: '+item.title}><img src={item.image} alt={item.alt} loading="lazy"/><span className="cf-play">▷ <span>Watch prototype</span></span></button>}
        </div><div className="cf-demo-caption"><span>Design intention</span><p>{item.detail}</p><span>0{step+1} / 03</span></div></section>
        <section className="cf-chapter" id="cf-outcome"><p className="cf-kicker">04 / In use</p><h2>Designed around<br/>a working conversation.</h2><figure className="cf-in-use"><img src={collaboration} alt="Co-Act concept showing colleagues discussing machine information" loading="lazy"/><figcaption>Concept visualisation / Bringing information into the conversation.</figcaption></figure><div className="cf-closing"><h3>Supporting expertise,<br/>wherever it is needed.</h3><div><p>Co-Act brings reporting, diagnosis and AI-assisted reasoning into a connected service concept. Its central question is how digital tools can make experience easier to share.</p><p className="cf-tiny">Academic concept and prototype. Proposed benefits are design intentions, not measured service outcomes.</p></div></div>
        <div className="cf-film">{film?<iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen/>:<button onClick={()=>setFilm(true)}><span>▷</span><div><span className="cf-kicker">The complete story</span><b>Watch the concept film</b></div><span>↗</span></button>}<a href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open on YouTube ↗</a></div></section>
      </div></div>
      <footer className="cf-footer"><span>Co-Act / Komatsu Forest</span><Link to="/project/co-act-studio">Previous version ↗</Link><Link to="/">Back to selected work ↗</Link></footer>
    </div>
  </article>;
}
