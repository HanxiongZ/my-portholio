import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Music, Code, Palette } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import meImage from "figma:asset/48475c04b4dc4f7672591e38d16075f857e522a3.png";

interface SpecialStar {
  id: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const SPECIAL_STARS: SpecialStar[] = [
  {
    id: 1,
    x: 12, // Bottom Left Area
    y: 65,
    title: "Prototyping",
    description: "Learning by making physical interfaces.",
    icon: <Palette size={14} />,
    image: meImage
  },
  {
    id: 2,
    x: 22, // Bottom Left Area (Lower)
    y: 80,
    title: "Creative Coding",
    description: "Experimenting with React & WebGL.",
    icon: <Code size={14} />,
    image: meImage
  },
  {
    id: 3,
    x: 78, // Mid Right Area (Higher)
    y: 25,
    title: "Analog Photo",
    description: "Capturing moments on 35mm film.",
    icon: <Camera size={14} />,
    image: meImage
  },
  {
    id: 4,
    x: 90, // Mid Right Area (Lower)
    y: 40,
    title: "Sound Design",
    description: "Synthesizer enthusiast & noisemaker.",
    icon: <Music size={14} />,
    image: meImage
  },
];

export const Constellation: React.FC<{ isDark: boolean }> = ({
  isDark,
}) => {
  return (
    <div className="absolute inset-0 h-screen z-30 pointer-events-none">
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
          const midX = (star.x + next.x) / 2;
          const d = `M ${star.x} ${star.y} C ${midX} ${star.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;

          return (
            <motion.path
              key={`line-${i}`}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.3,
                ease: "easeInOut",
              }}
              stroke={isDark ? "white" : "#1e293b"}
              strokeWidth="0.3" 
              vectorEffect="non-scaling-stroke"
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

const StarPoint: React.FC<{
  star: SpecialStar;
  isDark: boolean;
  hasGuide: boolean;
}> = ({ star, isDark, hasGuide }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isBottomArea = star.y > 60; // If star is in lower 40% of screen, show tooltip above

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
            isDark ? "text-white/40" : "text-slate-900/40"
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
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute -inset-3 rounded-full border-[1px] pointer-events-none ${
              isDark ? "border-white/50" : "border-slate-800/50"
            }`}
          />
        )}

        {/* Pulsing Core Glow (All stars) */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -inset-1 rounded-full blur-[2px] ${
            isDark ? "bg-white" : "bg-slate-500"
          }`}
        />

        {/* Core Star */}
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isDark
              ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              : "bg-slate-700 shadow-[0_0_8px_rgba(71,85,105,0.6)]"
          }`}
        />
      </motion.button>

      {/* Floating Info (Star Chart Style) */}
      <AnimatePresence mode="wait">
        {isHovered ? (
          /* CARD LAYOUT: Picture + Text */
          <motion.div
            key="card-tooltip"
            initial={{ opacity: 0, scale: 0.95, y: isBottomArea ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isBottomArea ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-1/2 -translate-x-1/2 z-40 w-56 rounded-lg border backdrop-blur-md shadow-2xl p-3 ${
               isBottomArea ? "bottom-6" : "top-6"
            } ${
               isDark 
                 ? "bg-black/80 border-white/10 text-white" 
                 : "bg-white/80 border-black/10 text-black"
            }`}
          >
            {/* Image */}
            <div className="w-full aspect-[4/3] rounded overflow-hidden mb-3 bg-foreground/5 relative">
              <ImageWithFallback 
                src={star.image} 
                alt={star.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1 rounded-full text-white">
                {star.icon}
              </div>
            </div>

            {/* Text Content */}
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                {star.title}
              </h4>
              <p className={`text-[10px] leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
                {star.description}
              </p>
            </div>

            {/* Decorative Corner */}
            <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-r border-b ${isDark ? "border-white/30" : "border-black/30"}`} />
            <div className={`absolute -top-1 -left-1 w-2 h-2 border-l border-t ${isDark ? "border-white/30" : "border-black/30"}`} />
            
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
