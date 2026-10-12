import React, { useEffect, useRef, useState } from 'react';
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
import mechanic from '../../assets/Mechanic1.png';
import ipad from '../../assets/iPadpro11.png';
import './coact-editorial.css';

const media = 'https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/';
const chapters = [
  ['ce-context', '01', 'Context'], ['ce-field', '02', 'Field notes'],
  ['ce-interactions', '03', 'Interactions'], ['ce-use', '04', 'In use'],
];

function ImageFigure({ src, alt, caption, className = '' }: { src: string; alt: string; caption: string; className?: string }) {
  return <figure className={`ce-figure ${className}`}>
    <a href={src} target="_blank" rel="noreferrer" aria-label={`${alt} — open full image`}><img src={src} alt={alt} loading="lazy" /></a>
    <figcaption>{caption}</figcaption>
  </figure>;
}

function Prototype({ kind, image, file, title }: { kind: 'phone' | 'prognosis' | 'ai'; image: string; file: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const toggle = async () => {
    if (!video.current) return;
    if (!video.current.paused) video.current.pause();
    else { try { await video.current.play(); } catch { setPlaying(false); } }
  };
  // Keep the original Figma-derived tablet frame and screen geometry together.
  const screen = <video ref={video} src={media + file} poster={image} muted loop playsInline preload="none"
    onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label={title} />;
  return <figure className={`ce-prototype ce-prototype--${kind}`}>
    {kind === 'phone' ? <div className="ce-phone-screen">{screen}</div> :
      <div className="ce-tablet">
        <div className="ce-tablet-screen">{kind === 'prognosis' ? <div className="ce-prognosis-crop">{screen}</div> : screen}</div>
        <img className="ce-tablet-frame" src={ipad} alt="" />
      </div>}
    <figcaption><button type="button" onClick={toggle} aria-pressed={playing}>{playing ? 'Pause prototype' : 'Play prototype'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button><a href={image} target="_blank" rel="noreferrer">View interface ↗</a></figcaption>
  </figure>;
}

export function CoActEditorial() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState('ce-context');
  const [film, setFilm] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(root.current?.querySelectorAll<HTMLElement>('.ce-chapter') ?? []);
      let active = sections[0]?.id;
      for (const section of sections) if (section.getBoundingClientRect().top <= window.innerHeight * .35) active = section.id;
      if (active) setChapter(active);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);

  return <article ref={root} className="ce-page">
    <div className="ce-shell">
      <div className="ce-back"><Link to="/">← Selected work</Link></div>
      <div className="ce-layout">
        <aside className="ce-aside"><div>
          <p className="ce-eyebrow">Inside the project</p>
          <nav aria-label="Case study chapters">{chapters.map(([id, number, title]) =>
            <a key={id} href={`#${id}`} aria-current={chapter === id ? 'location' : undefined} onClick={() => setChapter(id)}><span>{number}</span>{title}</a>)}</nav>
          <p className="ce-aside-credit">Co-Act<br />Komatsu Forest, 2023</p>
        </div></aside>
        <div className="ce-story">
          <header className="ce-hero">
            <p className="ce-eyebrow">Interaction design · Komatsu Forest · 2023</p>
            <h1>Co-Act</h1>
            <p className="ce-lead">Bringing machine data and practical knowledge into the same conversation.</p>
            <figure className="ce-cover"><img src={mockup} alt="Co-Act collaborative workspace on a tablet and phone" /><figcaption>A service concept connecting forestry operators and mechanics.</figcaption></figure>
          </header>

          <section id="ce-context" className="ce-chapter">
            <div className="ce-reading"><h2>Maintenance begins with people.</h2>
              <p>When a forestry machine needs attention, the repair begins before a mechanic arrives. Operators report the problem, mechanics prepare for the visit, and information travels between the forest and the workshop.</p>
              <p>Developed with Komatsu Forest as a five-year service vision, Co-Act explores how machine data and the knowledge held by these people can come together in a shared workspace.</p>
            </div>
            <dl className="ce-meta"><div><dt>Context</dt><dd>Academic collaboration<br />Komatsu Forest</dd></div><div><dt>Focus</dt><dd>Interaction & GUI design<br />Collaborative maintenance</dd></div><div><dt>Outcome</dt><dd>Service concept<br />Interface prototypes</dd></div><div><dt>Team</dt><dd>Hanxiong Zhang, Anjuli Acharya,<br />Dide Sevinçok & Lin Wang</dd></div></dl>
            <ImageFigure src={forest} alt="Forestry machine in a snowy forest" caption="The working context extends beyond the workshop." />
          </section>

          <section id="ce-field" className="ce-chapter">
            <div className="ce-reading"><h2>Learning alongside the mechanics.</h2><p>Fieldwork brought the team into the places where maintenance happens. Moving between locations, inspecting a fault and preparing spare parts revealed how much of the work depends on context and experience.</p></div>
            <div className="ce-field-pair">
              <figure><video controls muted playsInline preload="metadata" src={media + 'navigate.mp4#t=0.1'} aria-label="Fieldwork: travelling between locations" /><figcaption>Moving between the workshop and the field.</figcaption></figure>
              <figure><video controls muted playsInline preload="metadata" src={media + 'Oil%20leak.mp4#t=0.1'} aria-label="Fieldwork: investigating an oil leak" /><figcaption>Investigating a fault at the machine.</figcaption></figure>
            </div>
            <div className="ce-testimony"><img src={mechanic} alt="Mechanic from the project fieldwork" loading="lazy" /><div><blockquote>“I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth.”</blockquote><p className="ce-caption">Mechanic interview · Original project research</p></div></div>
            <div className="ce-reading"><h3>Carry the context into the next decision.</h3><p>A fault code is only part of the story. Previous repairs and an operator’s experience can help explain what is happening. Unexpected problems can also mean another journey for parts.</p><p>These observations shaped the proposal: share the context with the report, make machine condition available before the visit, and keep the mechanic’s judgement central during troubleshooting.</p></div>
            <details className="ce-research"><summary>View the research synthesis <span aria-hidden="true">+</span></summary><ImageFigure src={research} alt="Original Co-Act team research synthesis board" caption="Team synthesis board. Open the image to read it at its original size." /></details>
          </section>

          <section id="ce-interactions" className="ce-chapter">
            <div className="ce-reading"><h2>From a report to a shared understanding.</h2><p>The interface follows a service conversation: an operator raises an issue, a mechanic investigates the machine, and possible causes become available for discussion.</p></div>
            <div className="ce-phone-row"><div className="ce-step-copy"><p className="ce-eyebrow">Operator → mechanic</p><h3>Report the issue with its context.</h3><p>The operator creates a service ticket and shares machine data and recent activity. The mechanic receives the context alongside the problem, before the field visit.</p></div><Prototype kind="phone" image={operator} file="coact_operatereport.mp4" title="Operator reporting prototype" /></div>
            <div className="ce-interaction"><div className="ce-reading"><p className="ce-eyebrow">Preparing for the visit</p><h3>Investigate the machine before travelling.</h3><p>A component-level view makes machine condition available during preparation. Mechanics can explore potential faults before deciding what to bring into the field.</p></div><Prototype kind="prognosis" image={dashboard} file="coact_prognosis.mp4" title="Component diagnosis prototype" /></div>
            <div className="ce-interaction"><div className="ce-reading"><p className="ce-eyebrow">AI-assisted troubleshooting</p><h3>Make the reasoning visible.</h3><p>Signals, inspection records and historical faults form a visual network of possible causes. Instead of presenting a single unexplained answer, the concept places these relationships alongside the mechanic’s experience.</p></div><Prototype kind="ai" image={ai} file="coact_smartai.mp4" title="AI-assisted troubleshooting prototype" /></div>
            <ImageFigure src={home} alt="Co-Act mechanic workspace with jobs and machine information" caption="The mechanic’s workspace brings jobs and machine information together." className="ce-workspace" />
          </section>

          <section id="ce-use" className="ce-chapter">
            <div className="ce-reading"><h2>A workspace for a working conversation.</h2><p>Co-Act connects reporting, preparation and troubleshooting. The proposal gives people a shared view of the machine while leaving room for the knowledge that comes from working with it.</p></div>
            <ImageFigure src={collaboration} alt="Co-Act concept visualisation showing colleagues discussing machine information" caption="Concept visualisation · Discussing machine information together." />
            <div className="ce-use-row"><ImageFigure src={office} alt="Co-Act concept visualisation in an office" caption="Concept visualisation · Preparing and reviewing a job." /><div><h3>Supporting expertise across locations.</h3><p>The same information can support preparation in the office and a conversation in the field. The design intention is to make practical experience easier to share.</p><p className="ce-caption">Academic concept and prototype; service benefits have not been measured.</p></div></div>
            <div className="ce-film"><h3>The concept in motion.</h3>{film ? <iframe title="Co-Act concept film" src="https://www.youtube-nocookie.com/embed/KNZilN_i7OM" allow="fullscreen; picture-in-picture" allowFullScreen /> : <button onClick={() => setFilm(true)}>Watch the concept film <span aria-hidden="true">▷</span></button>}<a href="https://www.youtube.com/watch?v=KNZilN_i7OM" target="_blank" rel="noreferrer">Open on YouTube ↗</a></div>
          </section>
          <footer className="ce-footer"><Link to="/">← Selected work</Link><Link to="/project/co-act-fieldnotes">Fieldnotes version ↗</Link></footer>
        </div>
      </div>
    </div>
  </article>;
}
