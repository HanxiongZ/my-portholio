import { useEffect, useRef, useState } from 'react';

const ATLAS = '/images/oppo-dolby-detail/earbuds-motion-ai-v1.png';
const FRAME_COUNT = 16;
// Align generated poses to the LED; keep the original lower shell fixed.
const LED = [[157.41,256.28],[156.28,256.41],[154.28,256.41],[154.11,256.48],
 [157,239.5],[155.42,239.45],[153.72,239.59],[154.21,239.5],
 [156.68,225.32],[155.72,225.41],[154.1,225.31],[154.28,225.41],
 [157.59,201.72],[155.5,202],[154.32,201.9],[153.28,201.59]];
export const CASE_MOTION_MS = 1100;

/** AI keyframes run in both directions; interrupted motion resumes from its current frame. */
export function EarbudCaseSequence({ open, reduced }: { open: boolean; reduced: boolean }) {
 const canvas = useRef<HTMLCanvasElement>(null);
 const progress = useRef(FRAME_COUNT - 1);
 const [sheet, setSheet] = useState<HTMLImageElement | null>(null);
 useEffect(() => {
  const image = new Image();
  image.onload = () => setSheet(image);
  image.src = ATLAS;
  return () => { image.onload = null; };
 }, []);
 useEffect(() => {
  const context = canvas.current?.getContext('2d');
  if (!sheet || !context) return;
  const start = progress.current;
  const end = open ? 0 : FRAME_COUNT - 1;
  const duration = reduced ? 0 : CASE_MOTION_MS * Math.abs(end - start) / (FRAME_COUNT - 1);
  const began = performance.now();
  let request = 0;
  const cellWidth = sheet.naturalWidth / 4;
  const cellHeight = sheet.naturalHeight / 4;
  const draw = (now: number) => {
   const time = duration ? Math.min(1, (now - began) / duration) : 1;
   // Gentle acceleration, with a deliberate slowdown as the lid meets the case.
   const eased = time * time * (3 - 2 * time);
   progress.current = start + (end - start) * eased;
   const frame = Math.floor(progress.current);
   const fraction = progress.current - frame;
   const renderFrame = (index: number) => {
    context.drawImage(sheet, Math.round(index % 4 * cellWidth), Math.round(Math.floor(index / 4) * cellHeight),
     cellWidth, cellHeight, (LED[0][0] - LED[index][0]) * 512 / cellWidth,
     (LED[0][1] - LED[index][1]) * 512 / cellHeight, 512, 512);
   };
   context.clearRect(0, 0, 512, 512);
   context.save();
   context.beginPath();
   context.rect(0, 0, 512, 161 * 512 / cellHeight);
   context.clip();
   renderFrame(frame);
   if (fraction > 0 && frame < FRAME_COUNT - 1) {
    context.globalAlpha = fraction;
    renderFrame(frame + 1);
   }
   context.restore();
   // The lower body is photographic and remains pixel-stable throughout the loop.
   const seam = 161;
   context.drawImage(sheet, 0, seam, cellWidth, cellHeight - seam,
    0, seam * 512 / cellHeight, 512, (cellHeight - seam) * 512 / cellHeight);
   if (canvas.current) canvas.current.dataset.frame = String(Math.round(progress.current));
   if (time < 1) request = requestAnimationFrame(draw);
  };
  draw(began);
  return () => cancelAnimationFrame(request);
 }, [sheet, open, reduced]);
 return <canvas ref={canvas} width={512} height={512} aria-hidden="true" />;
}
