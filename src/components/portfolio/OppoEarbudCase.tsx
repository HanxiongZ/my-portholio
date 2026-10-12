import { useRef, useId, type RefObject } from 'react';

export type CaseMotion = { progress: number; setProgress?: (value: number) => void };

/** Photo cutouts foreshorten at the seam; the case body never moves or crossfades. */
export function OppoEarbudCase({ motion }: { motion: RefObject<CaseMotion> }) {
 const outside = useRef<SVGGElement>(null);
 const inside = useRef<SVGGElement>(null);
 const id = useId().replace(/:/g, '');
 const update = (value: number) => {
  const p = Math.max(0, Math.min(1, value));
  // Two photographic faces meet edge-on, avoiding double exposure.
  const outerScale = Math.max(0, Math.cos(p * Math.PI));
  const innerScale = Math.max(0, -Math.cos(p * Math.PI));
  outside.current?.setAttribute('transform', `translate(0 100) scale(1 ${outerScale}) translate(0 -100)`);
  inside.current?.setAttribute('transform', `translate(0 100) scale(1 ${innerScale}) translate(0 -100)`);
 };
 // Callback refs keep the timeline connected without another animation loop.
 return <svg className="oa-case-photo" viewBox="0 0 220 240" role="img" aria-label="Photographic illustration of an earbud case opening and closing" ref={node => {
  if (node) { motion.current.setProgress = update; update(motion.current.progress); }
  else motion.current.setProgress = undefined;
 }}>
  <defs>
   <clipPath id={`${id}-upper`}><rect width="220" height="100"/></clipPath>
   <clipPath id={`${id}-body`}><rect y="100" width="220" height="140"/></clipPath>
  </defs>
  <g ref={inside} transform="translate(0 100) scale(1 0) translate(0 -100)">
   <g clipPath={`url(#${id}-upper)`}><image href="/images/oppo-dolby-detail/earbuds-open.png" x="15" y="24.2" width="190" height="190"/></g>
  </g>
  <g ref={outside}>
   <g clipPath={`url(#${id}-upper)`}><image href="/images/oppo-dolby-detail/293a7.png" x="15" y="45" width="190" height="152.55"/></g>
  </g>
  <g clipPath={`url(#${id}-body)`}><image href="/images/oppo-dolby-detail/293a7.png" x="15" y="45" width="190" height="152.55"/></g>
 </svg>;
}
