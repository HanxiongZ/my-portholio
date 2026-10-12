import React, { useEffect, useRef } from 'react';
import { getSpatialStarColor, rgbaString } from './starColor';

interface StarFieldProps {
  isDark: boolean;
}

export const StarField: React.FC<StarFieldProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Standard density
    const starCount = 300; 
    const stars: { x: number; originalX: number; y: number; originalY: number; size: number; opacity: number; seed: number }[] = [];

    // Helper to check if a star is inside a text/element area (Hero Section)
    const isExcluded = (x: number, y: number, w: number, h: number) => {
        // 1. Header & Meta Data (Top Band)
        if (y < h * 0.15) return true;

        // 2. "Hanxiong" Text Area (Top Left to Center)
        if (x < w * 0.6 && y > h * 0.15 && y < h * 0.5) return true;
        
        // 3. "Zhang" Text Area (Center to Right)
        if (x > w * 0.35 && y > h * 0.5 && y < h * 0.85) return true;

        // 4. Bio Section (Bottom Right)
        if (x > w * 0.65 && y > h * 0.85) return true;

        return false;
    };

    const initStars = () => {
        stars.length = 0;
        // A fixed seed keeps every star in the same position across theme changes.
        let seed = 28473;
        const random = () => {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            return seed / 4294967296;
        };
        // Use a grid-like distribution with randomness to ensure even coverage
        const cols = Math.floor(Math.sqrt(starCount * (width / height)));
        const rows = Math.floor(starCount / cols);
        const cellW = width / cols;
        const cellH = height / rows;

        for(let i=0; i<cols; i++) {
            for(let j=0; j<rows; j++) {
                const x = (i * cellW) + (random() * cellW);
                const y = (j * cellH) + (random() * cellH);

                // Only add star if it's NOT in a text area
                if (!isExcluded(x, y, width, height)) {
                    stars.push({
                        x, originalX: x,
                        y, originalY: y,
                        size: random() * 1.15 + 0.35,
                        opacity: random() > 0.9
                          ? random() * 0.12 + 0.7
                          : random() * 0.2 + 0.42,
                        // Preserve the original seeded sequence so dark-star positions stay unchanged.
                        seed: random(),
                    });
                }
            }
        }
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let animationFrameId: number;

    const render = () => {
        ctx.clearRect(0, 0, width, height);
        for (const star of stars) {
            const dx = mouseRef.current.x - star.originalX;
            const dy = mouseRef.current.y - star.originalY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 250; 
            
            if (dist < repulsionRadius) {
                const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
                const angle = Math.atan2(dy, dx);
                const moveDist = force * 80;
                
                const targetX = star.originalX - Math.cos(angle) * moveDist;
                const targetY = star.originalY - Math.sin(angle) * moveDist;

                star.x += (targetX - star.x) * 0.08;
                star.y += (targetY - star.y) * 0.08;
            } else {
                star.x += (star.originalX - star.x) * 0.03;
                star.y += (star.originalY - star.y) * 0.03;
            }
            
            ctx.beginPath();
            if (isDark) {
              ctx.shadowBlur = 0;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            } else {
              const color = getSpatialStarColor(star.originalX / width, star.originalY / height);
              ctx.shadowBlur = star.size > 1.1 ? 4 : 1.5;
              ctx.shadowColor = rgbaString(color, 0.62);
              ctx.fillStyle = rgbaString(color, Math.min(1, star.opacity + 0.2));
            }
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
