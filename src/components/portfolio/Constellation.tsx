import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Music, Code, Palette } from 'lucide-react';

interface SpecialStar {
  id: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SPECIAL_STARS: SpecialStar[] = [
  {
    id: 1,
    x: 12, // Bottom Left Area
    y: 65,
    title: "UI/UX",
    description: "Crafting intuitive interfaces.",
    icon: <Palette size={14} />,
  },
  {
    id: 2,
    x: 22, // Bottom Left Area (Lower)
    y: 80,
    title: "Creative Coding",
    description: "React & WebGL experiments.",
    icon: <Code size={14} />,
  },
  {
    id: 3,
    x: 78, // Mid Right Area (Higher)
    y: 25,
    title: "Analog Photography",
    description: "Capturing moments on 35mm film.",
    icon: <Camera size={14} />,
  },
  {
    id: 4,
    x: 90, // Mid Right Area (Lower)
    y: 40,
    title: "Sound Design",
    description: "Synthesizer enthusiast.",
    icon: <Music size={14} />,
  }
];

export const Constellation: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 h-screen z-30 pointer-events-none overflow-hidden">
      {/* Constellation Lines (Bezier Curves) */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {SPECIAL_STARS.map((star, i) => {
            if (i === SPECIAL_STARS.length - 1) return null;
            const next = SPECIAL_STARS[i + 1];
            
            // Calculate Control Points for a smooth S-curve
            // CP1: Midpoint X, Start Y
            // CP2: Midpoint X, End Y
            const midX = (star.x + next.x) / 2;
            const d = `M ${star.x} ${star.y} C ${midX} ${star.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;

            return (
                <motion.path
                    key={`line-${i}`}
                    d={d}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 2, delay: 0.5 + (i * 0.3), ease: "easeInOut" }}
                    stroke={isDark ? "white" : "#1e293b"}
                    strokeWidth="0.5" // Scaled relative to viewBox 0-100, so 0.5 is roughly 0.5% width
                    vectorEffect="non-scaling-stroke" // Ensures line stays thin (1px-ish)
                    fill="none"
                    strokeDasharray="4 6"
                />
            );
        })}
      </svg>

      {SPECIAL_STARS.map((star, index) => (
        <StarPoint 
            key={star.id} 
            star={star} 
            isDark={isDark} 
            hasGuide={index === 0} // Only show guide on the first star
        />
      ))}
    </div>
  );
};

const StarPoint: React.FC<{ star: SpecialStar; isDark: boolean; hasGuide: boolean }> = ({ star, isDark, hasGuide }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
    >
      {/* Tiny Title "HOVER" for the first star */}
      {hasGuide && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2, duration: 1 }}
           className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap pointer-events-none ${
             isDark ? 'text-white/40' : 'text-slate-900/40'
           }`}
         >
           Hover
         </motion.div>
      )}

      {/* The Star Itself */}
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.2 }}
        className="relative group focus:outline-none flex items-center justify-center z-30"
      >
        {/* Visual Guide: Breathing Line Circle (Only on first star) */}
        {hasGuide && !isHovered && (
            <motion.div
                animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className={`absolute -inset-3 rounded-full border-[1px] pointer-events-none ${
                    isDark ? 'border-white/50' : 'border-slate-800/50'
                }`}
            />
        )}

        {/* Pulsing Core Glow (All stars) */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -inset-1 rounded-full blur-[2px] ${
            isDark ? 'bg-white' : 'bg-slate-500'
          }`}
        />
        
        {/* Core Star */}
        <div 
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-slate-700 shadow-[0_0_8px_rgba(71,85,105,0.6)]'
            }`} 
        />
      </motion.button>

      {/* Floating Info (Star Chart Style) */}
      <AnimatePresence mode="wait">
        {isHovered ? (
          /* Full Tooltip (Hover State) */
          <motion.div
            key="full-tooltip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-5 flex flex-col items-center pointer-events-none z-20 w-56"
          >
             {/* Animated Connector Line */}
             <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 24, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`w-[1px] mb-2 ${
                    isDark 
                    ? 'bg-gradient-to-b from-white/0 via-white/40 to-white/0' 
                    : 'bg-gradient-to-b from-slate-800/0 via-slate-800/30 to-slate-800/0'
                }`}
             />

             {/* Text Content - Floating & Clean */}
             <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center text-center"
             >
                {/* Title Row */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-[2px] ${
                    isDark ? 'bg-black/20 text-blue-100' : 'bg-white/40 text-slate-800'
                }`}>
                   <span className="opacity-80">{star.icon}</span>
                   <span className="text-xs font-bold tracking-[0.15em] uppercase">
                      {star.title}
                   </span>
                </div>
                
                {/* Description */}
                <p className={`text-[10px] font-medium tracking-wide mt-1 max-w-[180px] ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                   {star.description}
                </p>
             </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
