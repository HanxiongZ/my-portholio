import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Link } from 'react-router';
import './oppo-audio.css';
import { OppoHeroArtwork } from './OppoHeroArtwork';
import { OppoChapterNav } from './OppoChapterNav';
import { OppoAudioIntroduction } from './OppoAudioIntroduction';
import { OppoDolbyDetail } from './OppoDolbyDetail';
import { OppoSpatialAudio } from './OppoSpatialAudio';
import { allProjects } from './Projects';
const HoloContent = React.lazy(() => import('./content/Project5_SilentForm').then(m => ({ default: m.Project5_SilentForm })));
function HeroArtwork() {
 const host = useRef<HTMLDivElement>(null);
 const [scale, setScale] = useState(1);
 useEffect(() => {
   if (!host.current) return;
   const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1178));
   observer.observe(host.current);
   return () => observer.disconnect();
 }, []);
 return <div ref={host} className="oa-art-viewport" role="img" aria-label="ColorOS interfaces for handwriting, Dolby Atmos and Spatial Audio, with OPPO Pencil and earbuds on a blue fluid background">
   <div className="oa-art-canvas" style={{ transform: `scale(${scale})` }}><OppoHeroArtwork /></div>
 </div>;
}

export function OppoAudio({ opening }: { opening?: React.ReactNode } = {}) {
 useEffect(()=>{window.scrollTo(0,0);},[]);
 return <article className="oa-page">
  <div className="oa-wrap">
   <div className="oa-top"><Link className="portfolio-button portfolio-button--up oa-back" to="/"><img src="/images/oppo-coloros/back-arrow.svg" alt="" aria-hidden="true" />Back to home</Link></div>
   {opening || <><header className="oa-opening">
    <h1>ColorOS <span>.</span></h1>
    <div className="oa-opening-description"><p>Shaping the multimedia experiences for OPPO smart devices</p><p>UX Design · 2023</p></div>
   </header>
   <figure className="oa-opening-figure"><HeroArtwork /><figcaption>Selected work samples from ColorOS 13.0 - 14.0</figcaption></figure></>}
   <div className="oa-reading"><aside className="oa-sidebar"><OppoChapterNav /></aside><div className="oa-body">
   <section id="oa-background" className="oa-context oa-background oa-section" data-node-id="3370:1002">
    <div className="oa-context-index">01 / Background</div>
    <div className="oa-context-content">
      <div className="oa-context-heading"><div className="oa-context-intro-left"><h2>Designing UX at the scale of an OS level.</h2><div className="oa-context-paragraph"><p>Designing for ColorOS meant shaping pixel-perfect interfaces, rational interactions, and clear UX copy to create cohesive, intuitive experiences.</p></div></div><img src="/images/oppo-coloros/c376e.png" alt="ColorOS" width="260" height="72.8" /></div>
    </div>
    <dl className="oa-context-meta">
      <div><dt>Company</dt><dd>OPPO</dd></div>
      <div><dt>Role / Team</dt><dd>UX Designer / System UX Team 2</dd></div>
      <div><dt>Focus</dt><dd>Audio | Video | Creative</dd></div>
    </dl>
   </section>
   <OppoAudioIntroduction />
   <OppoDolbyDetail />
  <OppoSpatialAudio />
  <section id="oa-holo" className="oa-section oa-holo"><div className="oa-sectionbar"><span>04 / Holo Audio</span><span>Spatial interaction</span></div><h2>Holo Audio</h2>
   <Suspense fallback={<p>Loading the interaction study…</p>}><HoloContent project={allProjects.find(p => p.id === 5)!} slugify={text => 'oa-holo-' + text.toLowerCase().replace(/\s+/g, '-')} /></Suspense>
  </section>
  </div></div></div>
  <div className="oa-wrap"><footer className="oa-footer"><div><p className="oa-eyebrow">OPPO / ColorOS</p><p>Small details.<br/>A more coherent experience.</p></div><Link to="/">Back to selected work ↗</Link></footer></div>
 </article>;
}
