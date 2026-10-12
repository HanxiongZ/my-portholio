import React, { useEffect, useRef, useState } from 'react';
import './oppo-audio-introduction.css';

const icon = (file: string) => `${['3fc8a','0803a'].includes(file) ? '/images/oppo-dolby-detail' : '/images/oppo-audio-intro'}/${file}.svg`;
const settings = [
  { name: 'Home screen & Lock screen', icon: '3fc8a', top: 0 },
  { name: 'Display & brightness', icon: 'd7189', top: 60 },
  { name: 'Sound & vibration', icon: '677d6', top: 120, selected: true },
  { name: 'Notifications & status bar', icon: '4b5c1', top: 179 },
];
const features = [
  { name: 'Dolby Atmos', description: 'Experience immersive sound with depth, clarity, and detail like never before.', target: 'oa-dolby', top: 46.9 },
  { name: 'Spatial Audio', description: 'Adds depth and dimension to sound', target: 'oa-spatial', top: 132.98 },
  { name: 'Holo Audio', description: 'Experience sound from different locations when playing multiple audio sources at the same time.', target: 'oa-holo', top: 197.24 },
];

/** Figma audio settings introduction, with original SVG assets and live text. */
export function OppoAudioIntroduction() {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!host.current) return;
    const measure = () => {
      const narrow = window.matchMedia('(max-width:620px)').matches;
      setScale(Math.min(1, host.current!.clientWidth / (narrow ? 360 : 786)));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host.current);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return <section id="oa-audio" className="oa-audio-introduction" data-node-id="3410:573">
    <div className="oa-context-index">02 / Audio</div>
    <div className="oa-audio-intro-row">
      <div className="oa-settings-viewport" ref={host} style={{ '--settings-scale': scale } as React.CSSProperties}>
        <div className="oa-settings-study">
          <figure className="oa-settings-entry">
            <div className="oa-settings-phone" role="img" aria-label="ColorOS Settings with Sound & vibration highlighted">
              <div className="oa-settings-status"><b>19:30</b><span><img src={icon('d44fc')} alt=""/><img src={icon('0731b')} alt=""/><img src={icon('d0eaf')} alt=""/></span></div>
              <div className="oa-settings-appbar">Settings</div>
              <div className="oa-settings-search"><img src={icon('5c72d')} alt=""/><span>Search...</span><img src={icon('7bf54')} alt=""/></div>
              <div className="oa-settings-rows">{settings.map(row => <div key={row.name} className={`oa-settings-row${row.selected ? ' is-selected' : ''}`} style={{top:row.top}}><img src={icon(row.icon)} alt=""/><span>{row.name}</span><img src={icon('5c017')} alt=""/></div>)}</div>
            </div>
            <figcaption>Settings / Sound &amp; vibration</figcaption>
          </figure>
          <div className="oa-settings-features">
            <p>Sound effects</p>
            {features.map((feature, i) => <a key={feature.name} href={`#${feature.target}`} className={`oa-settings-feature oa-settings-feature--${i}`} style={{top:feature.top}}><div><strong>{feature.name}</strong><span>{feature.description}</span></div><img src={icon('5c017')} alt=""/></a>)}
          </div>
          <img className="oa-settings-connector" src={icon('0803a')} alt="" aria-hidden="true"/>
        </div>
      </div>
      <div className="oa-audio-intro-copy">
        <h2>Take control of the listening experience</h2>
        <div><p>Interfaces to explore sound effects and fine-tune the listening experience.</p>
          <p>My focus was on making controls intuitive and fluid, with behaviour and visual expression consistent with ColorOS.</p></div>
      </div>
    </div>
  </section>;
}
