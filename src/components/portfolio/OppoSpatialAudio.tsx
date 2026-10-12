import { Artwork } from './OppoDolbyArtwork';
import './oppo-spatial-audio.css';

const asset = (file: string) => `/images/oppo-spatial/${file}`;
function Tip({ children, direction, className }: { children: string; direction: 'left' | 'down'; className: string }) {
 return <div className={`os-tip os-tip--${direction} ${className}`}><span>{children}</span><img src={asset(direction === 'down' ? '8b904.svg' : '5b8d3.svg')} alt=""/></div>;
}
function OrientationDiagram() {
 return <Artwork width={646.1} height={409} className="os-orientation-diagram">
 <div className="os-crop os-source-left"><img src={asset('9823c.png')} alt=""/></div>
 <div className="os-crop os-source-right"><img src={asset('9823c.png')} alt=""/></div>
 <div className="os-crop os-listener"><img src={asset('9823c.png')} alt="Listener holding a screen, surrounded by sound sources"/></div>
 <Tip direction="down" className="os-tip-head">Head</Tip><Tip direction="left" className="os-tip-audio">Audio</Tip><Tip direction="left" className="os-tip-screen">Screen</Tip>
 </Artwork>;
}
function ModeIllustration({ mode }: { mode: 'Off' | 'Fixed' | 'Head tracking' }) {
 return <figure className="os-mode-figure"><Artwork width={345} height={266} className="os-mode-art">
 {mode === 'Off' ? <><div className="os-crop os-off-listener"><img src={asset('9823c.png')} alt=""/></div><img className="os-off-sources" src={asset('e2f3a.png')} alt="Spatial Audio off"/></> : mode === 'Fixed' ? <div className="os-crop os-fixed"><img src={asset('ab156.png')} alt="Fixed spatial audio"/></div> : <>
 <div className="os-crop os-tracking"><img src={asset('9ef66.png')} alt="Head tracking spatial audio"/></div>
 <img className="os-tracking-mask os-tracking-mask-one" src={asset('54758.svg')} alt=""/>
 <img className="os-tracking-mask os-tracking-mask-two" src={asset('54758.svg')} alt=""/>
 <div className="os-crop os-tracking-source-right"><img src={asset('9ef66.png')} alt=""/></div>
 <div className="os-tracking-source-top"><div className="os-crop"><img src={asset('9ef66.png')} alt=""/></div><img className="os-tracking-source-highlight" src={asset('d9a84.svg')} alt=""/></div>
 </>}
 </Artwork><figcaption>{mode}</figcaption></figure>;
}
function HierarchyDiagram() {
 return <Artwork width={646} height={457} className="os-hierarchy-diagram"><div className="os-hierarchy-phone"><div className="os-hierarchy-card">
 <div className="os-crop os-hierarchy-listener"><img src={asset('c517d.png')} alt="Spatial Audio illustration above a compact Listen button and three mode controls"/></div>
 <span className="os-wire-listen">Listen button</span>
 <div className="os-wire-mode os-wire-mode-one"><span/><p>Mode 1</p></div><div className="os-wire-mode os-wire-mode-two"><span/><p>Mode 2</p></div><div className="os-wire-mode os-wire-mode-three"><span/><p>Mode 3</p></div>
 <img className="os-guide os-guide-a" src={asset('50b18.svg')} alt=""/><img className="os-guide os-guide-b" src={asset('c65a5.svg')} alt=""/><img className="os-guide os-guide-c" src={asset('c65a5.svg')} alt=""/>
 <img className="os-guide os-guide-d" src={asset('45ff9.svg')} alt=""/><img className="os-guide os-guide-e" src={asset('45ff9.svg')} alt=""/><img className="os-guide os-guide-f" src={asset('0dc5f.svg')} alt=""/>
 <img className="os-guide os-guide-g" src={asset('3619e.svg')} alt=""/><img className="os-guide os-guide-h" src={asset('3a166.svg')} alt=""/>
 </div></div></Artwork>;
}
function ListenState({ active }: { active: boolean }) {
 return <div className={`os-listen-state ${active ? 'is-active' : ''}`}><div className="os-listen-button"><img src={asset(active ? 'e0977.svg' : '07bd8.svg')} alt=""/><span>Listen</span></div><p>{active ? 'Active' : 'Default'}</p></div>;
}
const iconStates = [
 { label: 'Fixed', file: '349bf.svg' }, { label: 'Off', file: '5a937.svg' }, { label: 'Head tracking', file: '5d8cb.svg' },
 { label: 'Head tracking', file: 'e4d09.svg' }, { label: 'Fixed', file: 'd1959.svg' }, { label: 'Off', file: '29d5c.svg' },
];
/** Spatial Audio: feature overview, spatial relationships and control hierarchy. */
export function OppoSpatialAudio() {
 return <section id="oa-spatial" className="os-section">
 <div className="os-overview" data-node-id="3430:3532"><div className="os-overview-panel">
 <div className="os-overview-title"><h2>Spatial Audio</h2><p>To experience, configure the spatial audio play with earbuds.</p></div>
 <Artwork width={549} height={518} className="os-phone-art"><img className="os-screen" src={asset('ad4ad.png')} alt="Spatial Audio settings showing Listen and the three listening modes"/><img className="os-device" src={asset('0a9bf.png')} alt=""/></Artwork>
 <div className="os-overview-contribution"><img src={asset('c3613.png')} alt="OPPO earbuds with spatial sound illustration"/><p>Designed clear expressions and component hierarchies to communicate functionality and support intuitive interactions.</p><p className="os-muted">UX / Functional UI</p></div>
 </div></div>
 <div className="os-visual" data-node-id="3437:3572"><div className="os-main-row"><OrientationDiagram/><div className="os-copy"><p className="os-label">Visual expressions</p><h3>Spatial orientation</h3><p>Each mode places sound differently around the listener. Illustrations and animation show how the head, sound sources, and screen relate to one another, helping users understand how each mode responds to head movement.</p></div></div>
 <div className="os-mode-row">{(['Off','Fixed','Head tracking'] as const).map(mode=><ModeIllustration key={mode} mode={mode}/>)}</div>
 </div>
 <div className="os-hierarchy" data-node-id="3437:3977"><div className="os-main-row"><HierarchyDiagram/><div className="os-copy"><p className="os-label">Component hierarchy</p><h3>Experience and configure in one view</h3><p>Buttons let people take actions or make choices,<br/>different types of buttons come from different user experience touch points hierarchy.</p></div></div>
 <div className="os-detail-row"><div className="os-detail"><h4>01 Lightweight button to preview</h4><div className="os-state-panel os-state-panel--listen"><p className="os-state-title">Small Capsule Button</p><div className="os-listen-states"><ListenState active={false}/><ListenState active/></div></div><div className="os-detail-copy"><p>User will try to learn from the audio effect for the very first beginning interaction with their earbuds.</p><p>a small capsule button is a good choice for taking less space and effort while it will not be used very frequently.</p></div></div>
 <div className="os-detail"><h4>02 Visible selection</h4><div className="os-state-panel"><p className="os-state-title">Icon Button</p><div className="os-icon-states">{iconStates.map(({label,file},index)=><div key={file} className={`os-icon-state ${index>2 ? 'is-active' : ''}`}><div><img src={asset(file)} alt=""/></div><p>{label}</p></div>)}</div></div><div className="os-detail-copy"><p>Larger dimension button with Icon while help reduce user cognitive load when they try to switch among the three modes.</p></div></div></div>
 </div>
 </section>;
}
