import { useEffect, useRef, useState } from 'react';
import { OppoEarbudCase, type CaseMotion } from './OppoEarbudCase';
import { Artwork } from './OppoDolbyArtwork';
import './oppo-dolby-improvements.css';
const asset = (name: string) => `/images/oppo-dolby-detail/${name}`;
const environment = [
 ['Smart','fd3aa.png','Adapts to different media content (Recommended)'],
 ['Indoor','c248c.png','Suited to low-noise environments'],
 ['On-the-go','538ac.png','Ideal for noisy places with lots of people'],
 ['Commute','6e729.png','Perfect for public transportation'],
 ['Flight','16b08.png','Ideal for enjoying entertainment on a flight'],
];
const scenarios = [
 ['Smart','54f7b.png','Adapts to different media content (Recommended)'],
 ['Movie','15cf2.png','Stereo sounds and clear vocals for a cinematic experience'],
 ['Gaming','93506.png','As if you were at the eSports arena'],
 ['Music','2fbaf.png','Balanced and rich sounds, perfect for music'],
];
function ProfileCards({ connected }: { connected: boolean }) {
 return <div className={`oa-demo-profiles ${connected ? 'oa-demo-profiles--environment' : ''}`}>
 {(connected ? environment : scenarios).map(([name,file,description],index)=><div key={name} className={`oa-demo-profile ${index === (connected ? 2 : 0) ? 'is-selected' : ''}`} data-selected={index === (connected ? 2 : 0)}>
 <div className={`oa-demo-preview ${file === '54f7b.png' ? 'oa-demo-preview--smart' : ''}`}><img src={asset(file)} alt=""/>{connected && <span>{name}</span>}</div><p>{description}</p>
 </div>)}
 </div>;
}
function DemoPhone({ connected }: { connected: boolean }) {
 return <div className="oa-output-phone" role="img" aria-label={connected ? 'Earphones connected: Environment profile, On-the-go restored' : 'Speakers: Scenario-specific profile, Smart restored'}>
 <div className="oa-demo-status"><span>19:30</span><span className="oa-demo-camera"><img src={asset('471a4.svg')} alt=""/></span><div>{['4cbc9.svg','4b171.svg','d9806.svg'].map(file=><img key={file} src={asset(file)} alt=""/>)}</div></div>
 <div className="oa-demo-appbar"><img src={asset('06b85.svg')} alt=""/>Dolby Atmos</div>
 <div className="oa-demo-dolby"><div className="oa-demo-logo"><div><img src={asset('5b7f1.png')} alt=""/><img className="oa-demo-logo-patch" src={asset('508b0.svg')} alt=""/></div></div><span>Dolby Atmos</span><img src={asset('748ff.svg')} alt=""/></div>
 <div className="oa-demo-modes"><div><span>Environment profile<small>Can only be turned on when earphones are connected</small></span><img src={asset(connected ? 'ac958.svg' : 'b0bac.svg')} alt=""/></div><div><span>Scenario-specific profile</span><img src={asset(connected ? 'b0bac.svg' : 'ac958.svg')} alt=""/></div></div>
 <p className="oa-demo-select">Select sound profile</p>
 <div key={connected ? 'environment' : 'scenario'} className="oa-demo-profile-layer" data-active={connected ? 'environment' : 'scenario'}><ProfileCards connected={connected}/></div>
 </div>;
}
function inverseCaseEase(value: number) {
 let low=0, high=1;
 for(let i=0;i<20;i++){const t=(low+high)/2; const eased=t*t*t*(t*(t*6-15)+10); if(eased<value)low=t;else high=t;}
 return (low+high)/2;
}
/** A shared timeline keeps the illustrative case motion and restored UI state in sync. */
function OutputContinuityDemo() {
 const host = useRef<HTMLDivElement>(null);
 const [paused, setPaused] = useState(false);
 const [reduced, setReduced] = useState(false);
 const [state, setState] = useState({ open: false, connected: false });
 const elapsed = useRef(0);
 const motion = useRef<CaseMotion>({ progress: 0 });
 const [scrub, setScrub] = useState(0);
 useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReduced(media.matches);
  update(); media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
 }, []);
 useEffect(() => {
  if (reduced) { motion.current.progress = 0; motion.current.setProgress?.(0); return; }
  if (paused) return;
  let visible = false, frame = 0, last = 0;
  let lastOpen: boolean | undefined, lastConnected: boolean | undefined;
  const ease = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t*t*t*(t*(t*6-15)+10); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; last = 0; }, { threshold: .2 });
  if (host.current) observer.observe(host.current);
  const tick = (now: number) => {
   if (visible && !document.hidden) {
    if (last) elapsed.current += Math.min(now - last, 100);
    const t = elapsed.current % 12000;
    // Original photographs share a fixed body and a reversible seam transition.
    const progress = t < 2000 ? 0 : t < 3400 ? ease((t-2000)/1400) : t < 7200 ? 1 : t < 8500 ? 1-ease((t-7200)/1300) : 0;
    motion.current.progress = progress;
    motion.current.setProgress?.(progress);
    const open = progress > .5;
    const connected = t >= 3700 && t < 8850;
    if(open !== lastOpen || connected !== lastConnected) { setState({open, connected}); lastOpen=open; lastConnected=connected; }
    last = now;
   } else last = 0;
   frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(frame); observer.disconnect(); };
 }, [paused, reduced]);
 const open = reduced ? false : state.open;
 const connected = reduced ? false : state.connected;
 return <div ref={host} id="oa-output-continuity" className="oa-output-demo" data-output={connected ? 'earphones' : 'speakers'} data-case-open={open}>
 <Artwork width={525} height={412} className="oa-output-art"><DemoPhone connected={connected}/>
 <OppoEarbudCase motion={motion}/>
 <div className="oa-case-caption"><span>{connected ? 'Earphones connected' : 'Phone speakers'}</span><small>{connected ? 'On-the-go restored' : 'Smart restored'}</small></div>
 </Artwork>
 {!reduced && <button type="button" className="oa-demo-playback" aria-pressed={paused} onClick={() => { setScrub(Math.round(motion.current.progress*100)); setPaused(value => !value); }}>{paused ? 'Resume animation' : 'Pause animation'}</button>}
 {paused && !reduced && <label className="oa-case-scrubber"><span>Closed</span><input aria-label="Case opening" type="range" min="0" max="100" step="1" value={scrub} onChange={event => { const value=Number(event.target.value); setScrub(value); motion.current.progress=value/100; motion.current.setProgress?.(value/100); elapsed.current=2000+1400*inverseCaseEase(value/100); setState({open:value>50,connected:value>80}); }}/><span>Open</span></label>}
 </div>;
}
export function OppoDolbyImprovements() {
 return <>
 <div className="oa-dolby-improvement-one" data-node-id="3420:3833">
 <div className="oa-improvement-copy"><p className="oa-improvement-label">UX Improvements - 1</p><h3>Avoid confusions, decrease the frustrations</h3><p>This feature has dependency of connecting with earbuds, adding a toast to explain why an interaction is unavailable, minimal interruption</p></div>
 <Artwork width={660} height={492} className="oa-toast-art"><div className="oa-toast-phone-crop"><img src={asset('5139a.png')} alt="Dolby Atmos setting unavailable until earphones connect"/></div><div className="oa-demo-toast"><img src={asset('02647.png')} alt=""/><span>Connect earphones to your device to turn this off</span></div></Artwork>
 </div>
 <div className="oa-dolby-improvement-two" data-node-id="3420:3940"><OutputContinuityDemo/><div className="oa-improvement-copy"><p className="oa-improvement-label">UX Improvements / 2</p><h3>An edge case could be someone’s regular scenario</h3><p>To support a consistent listening experience, switching between earphones and speakers automatically restores the last selected sound mode for each mode.</p></div></div>
 </>;
}
