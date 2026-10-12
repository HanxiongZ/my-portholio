import React, { useEffect, useRef, useState } from 'react';

/** Keep each technical diagram at its Figma proportions within the reading column. */
export function Artwork({ width, height, children, className = '' }: { width: number; height: number; children: React.ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [width]);
  return <div ref={host} className={`oa-dolby-art-host ${className}`} style={{maxWidth:width,height:height*scale}}><div className="oa-dolby-art-content" style={{width,height,transform:`scale(${scale})`}}>{children}</div></div>;
}
