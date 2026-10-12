import React, { useLayoutEffect, useRef, useState } from 'react';
import { OppoAudioOpeningPanel, OppoCreativeOpeningPanel } from './OppoOpeningArtwork';
import { OppoFluidBackdrop } from './OppoFluidBackdrop';
import './oppo-opening.css';

// Preserve the geometry of each complete Figma composition when resizing.
function OpeningPanel({ creative = false, shaderPath }: { creative?: boolean; shaderPath: string }) {
  const host = useRef<HTMLDivElement>(null);
  const width = creative ? 390 : 768;
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const element = host.current;
    if (!element) return;
    setScale(element.clientWidth / width);
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  return <div ref={host} className={`oa-opening-panel${creative ? ' oa-opening-panel--creative' : ''}`} role="img" aria-label={creative ? 'ColorOS handwriting tools and OPPO Pencil' : 'ColorOS audio interfaces and OPPO earbuds'}>
    <div className="oa-panel-mobile-motion" aria-hidden="true"><OppoFluidBackdrop shaderPath={shaderPath} cropStart={creative ? 788 / 1178 : 0} cropWidth={width / 1178} /></div>
    <div className="oa-opening-canvas" style={{ width, height: 525, transform: `scale(${scale})` }}>
      {creative ? <OppoCreativeOpeningPanel /> : <OppoAudioOpeningPanel />}
    </div>
  </div>;
}

export function OppoOpening() {
  // Keep the previous artwork available for direct visual comparison.
  const previous = new URLSearchParams(window.location.search).get('backdrop') === 'previous';
  const directory = `/coloros-fluid/${previous ? 'blue-teal' : 'mesh-grain'}`;
  const shaderPath = `${directory}/fluid.frag`;
  const backdropStyle = {
    '--oa-backdrop': `url('${directory}/fluid-python.png')`,
    '--oa-backdrop-left': `url('${directory}/${previous ? 'fluid-left-blue' : 'fluid-left-cyan'}.png')`,
    '--oa-backdrop-right': `url('${directory}/${previous ? 'fluid-right-cyan' : 'fluid-right-violet'}.png')`,
  } as React.CSSProperties;
  return <div className="oa-redesigned-opening" style={backdropStyle}>
    <header className="oa-new-heading">
      <h1>ColorOS<span>.</span></h1>
      <div className="oa-new-description"><p>Shaping everyday<br />multimedia experiences.</p><p>UX Design · 2023</p></div>
    </header>
    <figure className="oa-new-figure">
      <div className="oa-opening-gallery">
        <div className="oa-opening-background" aria-hidden="true"><OppoFluidBackdrop shaderPath={shaderPath} /></div>
        <OpeningPanel shaderPath={shaderPath} />
        <OpeningPanel creative shaderPath={shaderPath} />
      </div>
      <figcaption>Selected work samples from ColorOS 13.0 - 14.0</figcaption>
    </figure>
  </div>;
}
