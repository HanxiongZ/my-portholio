import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const oppoChapters = [
  { id: 'oa-background', number: '01', title: 'Background' },
  { id: 'oa-audio', number: '02', title: 'Audio' },
  { id: 'oa-spatial', number: '03', title: 'Spatial Audio' },
  { id: 'oa-holo', number: '04', title: 'Holo Audio' },
];

/** Keep reading state stable while allowing a quiet, reversible hover preview. */
export function OppoChapterNav() {
  const [active, setActive] = useState(oppoChapters[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const scrollingFrame = useRef(0);
  const targetChapter = useRef<string | null>(null);
  const hoverEnterTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearHoverTimers = () => {
    clearTimeout(hoverEnterTimer.current);
    clearTimeout(hoverLeaveTimer.current);
  };
  const preview = (id: string) => {
    if (targetChapter.current) return;
    clearHoverTimers();
    setFocused(null);
    // Filter accidental crossings before showing a preview.
    hoverEnterTimer.current = setTimeout(() => setHovered(id), 70);
  };
  const dismissPreview = () => {
    clearHoverTimers();
    hoverLeaveTimer.current = setTimeout(() => setHovered(null), 120);
  };
  useEffect(() => {
    const cancel = () => {
      cancelAnimationFrame(scrollingFrame.current);
      targetChapter.current = null;
    };
    const keyCancel = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Escape'].includes(event.key)) cancel();
    };
    window.addEventListener('keydown', keyCancel);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    return () => { cancel(); clearHoverTimers(); window.removeEventListener('keydown', keyCancel); window.removeEventListener('wheel', cancel); window.removeEventListener('touchstart', cancel); };
  }, []);
  const jump = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    cancelAnimationFrame(scrollingFrame.current);
    clearHoverTimers();
    setHovered(null);
    setFocused(null);
    targetChapter.current = id;
    setActive(id);
    const start = window.scrollY;
    const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 120;
    const end = Math.max(0, Math.min(start + element.getBoundingClientRect().top - offset, document.documentElement.scrollHeight - innerHeight));
    if (reducedMotion || Math.abs(end - start) < 2) { window.scrollTo({ top: end, behavior: 'instant' }); targetChapter.current = null; return; }
    const began = performance.now();
    const duration = Math.min(850, Math.max(450, Math.abs(end - start) * .3));
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      const ease = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: start + (end - start) * ease, behavior: 'instant' });
      if (progress < 1) scrollingFrame.current = requestAnimationFrame(step);
      else { scrollingFrame.current = 0; targetChapter.current = null; }
    };
    scrollingFrame.current = requestAnimationFrame(step);
  };
  const previewed = focused ?? hovered;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (targetChapter.current) return;
      const readingLine = Math.min(window.innerHeight * .3, 220);
      let current = oppoChapters[0].id;
      for (const chapter of oppoChapters) {
        const element = document.getElementById(chapter.id);
        if (element && element.getBoundingClientRect().top <= readingLine) current = chapter.id;
      }
      // A short final chapter still becomes current at the bottom of the page.
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = oppoChapters[oppoChapters.length - 1].id;
      }
      setActive(current);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return <nav className="oa-rail" aria-label="Project chapters">
    <div className="oa-rail-items" onPointerLeave={dismissPreview}>
      {oppoChapters.map(chapter => {
        const isCurrent = active === chapter.id;
        const expanded = isCurrent || previewed === chapter.id;
        return <a key={chapter.id} className="oa-rail-link" href={`#${chapter.id}`}
          aria-label={`${chapter.number} / ${chapter.title}`}
          aria-current={active === chapter.id ? 'location' : undefined}
          onPointerEnter={event => { if (event.pointerType === 'mouse') preview(chapter.id); }}
          onPointerLeave={event => { if (event.pointerType === 'mouse') dismissPreview(); }}
          onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { clearHoverTimers(); setHovered(null); setFocused(chapter.id); } }}
          onBlur={() => setFocused(null)}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            setFocused(null);
            jump(chapter.id);
            window.history.replaceState(null, '', `#${chapter.id}`);
          }}>
          <motion.span className="oa-rail-title" aria-hidden="true" initial={false}
            animate={{ opacity: expanded ? 1 : 0, y: reducedMotion || expanded ? 0 : 3,
              color: isCurrent ? '#000000' : 'rgba(0, 0, 0, .62)' }}
            transition={{ opacity: { duration: reducedMotion ? 0 : .2 },
              y: { duration: reducedMotion ? 0 : .3, ease: [.22, 1, .36, 1] },
              color: { duration: reducedMotion ? 0 : .2 } }}>
            <span className="oa-rail-label-copy">{chapter.title}</span>
          </motion.span>
          <motion.span className="oa-rail-square" aria-hidden="true"
            initial={false}
            whileTap={reducedMotion ? undefined : { scale: .95 }}
            animate={{ backgroundColor: isCurrent ? 'rgba(0, 0, 0, .9)' : expanded ? 'rgba(0, 0, 0, .055)' : 'rgba(0, 0, 0, 0)',
              borderColor: isCurrent ? 'rgba(0, 0, 0, .9)' : expanded ? 'rgba(0, 0, 0, .8)' : 'rgba(0, 0, 0, .54)',
              color: isCurrent ? '#ffffff' : 'rgba(0, 0, 0, .9)' }}
            transition={{ duration: reducedMotion ? 0 : .18, ease: [.22, 1, .36, 1] }}>
            <motion.span initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : .16 }}>{chapter.number}</motion.span>
          </motion.span>
        </a>;
      })}
    </div>
  </nav>;
}
