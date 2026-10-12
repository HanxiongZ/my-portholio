import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import mockup from '../../assets/coact_mockup.png';
import forest from '../../assets/imgForestryMachine.jpg';
import research from '../../assets/coact_researchboard.jpeg';
import operator from '../../assets/coact_operatorhome.png';
import home from '../../assets/coact_home.png';
import dashboard from '../../assets/coact_dashboard.png';
import ai from '../../assets/coact_smartai.png';
import office from '../../assets/coact_officeview.jpg';
import collaboration from '../../assets/coact_collabview.jpg';
import './coact-refined.css';

const steps = [
  { title: 'Report an issue', role: 'Operator → mechanic', image: operator, text: 'A service ticket brings the issue, machine data and recent activity into the same conversation.', video: 'coact_operatereport.mp4', why: 'Carry the context with the request, so the next person has a clearer starting point.' },
  { title: 'Prepare for the visit', role: 'Mechanic · diagnosis', image: dashboard, text: 'Component-level information helps mechanics investigate possible faults before travelling into the field.', video: 'coact_prognosis.mp4', why: 'Connect preparation to the machine’s condition, with the aim of making troubleshooting more informed.' },
  { title: 'Reason through the fault', role: 'Mechanic · AI support', image: ai, text: 'Signals, inspection records and historical faults form a visual network of possible causes.', video: 'coact_smartai.mp4', why: 'Make the connections visible so mechanics can examine suggestions using their own experience.' },
];

export function CoActRefined() {
  const [selected, setSelected] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [showFilm, setShowFilm] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const step = steps[selected];
  return <article className="co-refined">
    <div className="co-wrap">
      <div className="co-version"><Link to="/">← All projects</Link><span>Co-Act / Editorial study 02</span><Link to="/project/3">View original ↗</Link></div>
      <header className="co-hero">
        <div className="co-masthead"><p className="co-eyebrow">Interaction design<br/>Komatsu Forest · 2023</p><h1>Co-Act<span className="co-title-dot">.</span></h1><p className="co-masthead-note">Forestry service<br/>A collaborative GUI concept</p></div>
        <div className="co-hero-intro"><h2>Keeping machines working.<br/><span>Connecting the people<br/>who know them.</span></h2><div><p className="co-lead">A shared workspace that brings machine data and practical experience into the same maintenance conversation.</p><a className="co-action" href="#co-interaction">Explore the interactions <span>↓</span></a></div></div>
        <div className="co-cover"><figure className="co-cover-context"><img src={forest} alt="Forestry machine among snow-covered trees"/><figcaption>01 / The field</figcaption></figure><figure className="co-hero-visual"><span className="co-figure-label">02 / The shared workspace</span><img src={mockup} alt="Co-Act interface on rugged blue tablet and phone"/><figcaption>Machine data, diagnostics and collaboration.</figcaption></figure></div>
      </header>
      <dl className="co-meta"><div><dt>Context</dt><dd>Academic collaboration<br/>with Komatsu Forest</dd></div><div><dt>Focus</dt><dd>Collaborative GUI<br/>Tacit knowledge & AI</dd></div><div><dt>Project horizon</dt><dd>A five-year vision<br/>for forestry service</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang, Anjuli Acharya,<br/>Dide Sevinçok & Lin Wang</dd></div></dl>
      <nav className="co-nav" aria-label="Case study sections"><a href="#co-context">01 Context</a><a href="#co-research">02 Fieldwork</a><a href="#co-strategy">03 Decisions</a><a href="#co-interaction">04 Interactions</a><a href="#co-film">05 Film</a></nav>
      <section id="co-context" className="co-section co-context"><figure><img src={forest} alt="Forestry machine working in a snowy forest" loading="lazy"/><figcaption>Maintenance extends beyond the workshop.</figcaption></figure><div><p className="co-eyebrow">01 / The context</p><h2>When a machine stops,<br/>the work cannot wait.</h2><p>In the forest, a breakdown sets a chain of people and decisions in motion. Operators call for help. Mechanics gather information, check parts and travel to the machine.</p><p>Co-Act explores how this work could be supported when technical information and practical experience are brought into one shared workspace.</p></div></section>
      <section id="co-research" className="co-section"><div className="co-section-heading"><p className="co-eyebrow">02 / Understanding work in context</p><h2>Learning alongside<br/>service mechanics.</h2><p>Time with mechanics revealed how maintenance unfolds across locations, demanding conditions and years of accumulated experience.</p></div>
        <div className="co-observations">{[
          ['01','Work moves between places','From home to workshop to deep forest, tools and information do not always travel with the mechanic.','navigate.mp4'],
          ['02','The field changes the interaction','Gloves, grease, snow and unstable surfaces shape how digital tools can be used.','Inspection.mp4'],
          ['03','Every machine has a history','Past failures, temporary fixes and local conditions live partly in people’s experience.','Oil%20leak.mp4'],
        ].map(([n,title,text,file])=><figure key={n}><video controls muted playsInline preload="metadata" src={'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/'+file+'#t=0.1'} aria-label={title}/><figcaption><span className="co-eyebrow">Field observation / {n}</span><h3>{title}</h3><p>{text}</p></figcaption></figure>)}</div>
        <div className="co-research-detail"><figure><a href={research} target="_blank" rel="noreferrer"><img src={research} alt="Research synthesis board from the Co-Act project; open full image" loading="lazy"/></a><figcaption>Research synthesis · Open to inspect the full board ↗</figcaption></figure><div><p className="co-eyebrow">From the conversations</p><blockquote>“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”</blockquote><p className="co-note">Mechanic interview · Fieldwork excerpt</p><p>The conversations also highlighted learning on the job and the detailed knowledge operators hold about their own machines.</p></div></div>
      </section>
      <section id="co-strategy" className="co-section"><div className="co-section-heading"><p className="co-eyebrow">03 / From research to decisions</p><h2>Three observations.<br/>Three design responses.</h2></div><div className="co-decisions">{[
        ['Information is scattered','Keep people connected across locations','Bring reports, machine information and job context into a collaborative interface.'],
        ['Preparation is uncertain','Make diagnosis more informed','Use component-level information to support investigation before a field visit.'],
        ['Expertise is hard to capture','Keep human judgement central','Show relationships behind potential causes, supporting discussion and the exchange of tacit knowledge.'],
      ].map(([observation,decision,description],i)=><div key={decision}><span className="co-eyebrow">0{i+1} / {observation}</span><h3>{decision}</h3><p>{description}</p></div>)}</div></section>
      <section id="co-interaction" className="co-section"><div className="co-section-heading"><p className="co-eyebrow">04 / Collaborative actions</p><h2>From reporting an issue<br/>to investigating its cause.</h2><p>Follow the concept from an operator’s report to the mechanic’s investigation. Each view supports a different part of the same maintenance conversation.</p></div>
        <div className="co-step-buttons" role="group" aria-label="Choose an interaction">{steps.map((s,i)=><button key={s.title} aria-pressed={i===selected} onClick={()=>{setSelected(i);setShowDemo(false);}}><span>0{i+1}</span>{s.title}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="co-interaction-panel"><div className={'co-screen '+(selected===0?'co-phone':'')} key={`${selected}-${showDemo}`} >{showDemo?<video controls playsInline preload="metadata" aria-label={`${step.title} prototype demonstration`} src={'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/'+step.video}/>:<a href={step.image} target="_blank" rel="noreferrer"><img src={step.image} alt={`${step.title}: original Co-Act interface; open full image`}/></a>}</div><div className="co-step-copy"><p className="co-eyebrow">{step.role}</p><h3>{step.title}</h3><p>{step.text}</p><div className="co-design-intent"><span className="co-eyebrow">Design intention</span><p>{step.why}</p></div><button className="co-action" onClick={()=>setShowDemo(!showDemo)}>{showDemo?'View interface':'Watch prototype'} <span>{showDemo?'↗':'▷'}</span></button><p className="co-note">Concept prototype · Select play to start the video.</p></div></div>
        <figure className="co-workspace"><img src={home} loading="lazy" alt="Co-Act mechanic workspace showing a job list and machine overview"/><figcaption><span className="co-eyebrow">The mechanic’s workspace</span><p>A common starting point for jobs and machine information.</p></figcaption></figure>
        <div className="co-pair"><figure><img src={office} alt="Co-Act concept in an office setting" loading="lazy"/><figcaption>Preparing and reviewing information.</figcaption></figure><figure><img src={collaboration} alt="Co-Act concept supporting discussion between colleagues" loading="lazy"/><figcaption>Making space for shared reasoning.</figcaption></figure></div>
        <div className="co-closing"><p className="co-eyebrow">The principle behind Co-Act</p><h2>Make expertise part<br/>of the interface.</h2><p>The concept brings machine information and human knowledge together to support maintenance decisions. It explores how visible connections between data and experience can support a more informed discussion.</p></div>
      </section>
      <section id="co-film" className="co-section co-film"><div><p className="co-eyebrow">05 / Concept film</p><h2>See Co-Act<br/>in context.</h2><p>The team’s film brings the proposed service experience together.</p></div><div>{showFilm?<iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen/>:<button className="co-film-cover" onClick={()=>setShowFilm(true)}><img src={mockup} alt=""/><span>▷ Load concept film</span></button>}<a className="co-note" href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open film on YouTube ↗</a></div></section>
      <footer className="co-bottom"><Link to="/project/3">← Compare with the original case</Link><Link to="/">Back to selected works ↗</Link></footer>
    </div>
  </article>;
}
