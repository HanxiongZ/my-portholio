import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Music, Code, Palette } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import meImage from "figma:asset/48475c04b4dc4f7672591e38d16075f857e522a3.png";
import { getSpatialStarColor, rgbString, rgbaString } from "./starColor";

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
  const positionedStars = SPECIAL_STARS;

  return (
    <div className="absolute inset-0 h-screen z-30 pointer-events-none">
      {/* Constellation Lines (Bezier Curves) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {positionedStars.map((star, i) => {
          if (i === positionedStars.length - 1) return null;
          const next = positionedStars[i + 1];

          // Calculate Control Points for a smooth S-curve
          const midX = (star.x + next.x) / 2;
          const d = `M ${star.x} ${star.y} C ${midX} ${star.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;

          return (
            <motion.path
              key={`line-${i}`}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isDark ? 0.2 : 0.16 }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.3,
                ease: "easeInOut",
              }}
              stroke={isDark ? "white" : "#9CB4CE"}
              strokeWidth="0.3" 
              vectorEffect="non-scaling-stroke"
              fill="none"
              strokeDasharray="4 6"
            />
          );
        })}
      </svg>

      {positionedStars.map((star, index) => (
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
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocused = useRef(false);
  const isBottomArea = star.y > 60;
  const lightStarColor = getSpatialStarColor(star.x / 100, star.y / 100);

  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setIsHovered(true);
  };
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      if (!isFocused.current) setIsHovered(false);
    }, 180);
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${star.x}%`, top: `${star.y}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* "HOVER" guide label */}
      {hasGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap pointer-events-none ${
            isDark ? "text-white/40" : "text-[#7893AF]/50"
          }`}
        >
          Hover
        </motion.div>
      )}

      {/* ── Enlarged hit zone — transparent, no cursor change ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${star.title}`}
        className="absolute rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9EB8D1]"
        style={{
          width: 52,
          height: 52,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
          cursor: "pointer",
          zIndex: 1,
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={() => {
          isFocused.current = true;
          handleEnter();
        }}
        onBlur={() => {
          isFocused.current = false;
          handleLeave();
        }}
        onClick={() => setIsHovered(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsHovered(true);
          }
        }}
      />

      {/* ── Visuals — pointer-events-none, scale driven by state ── */}
      <motion.div
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative pointer-events-none flex items-center justify-center"
        style={{ width: 8, height: 8 }}
      >
        {/* Breathing guide circle — 32×32px, only on first star */}
        {hasGuide && !isHovered && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute rounded-full border-[1px] ${
              isDark ? "border-white/50" : "border-[#8FAED0]/50"
            }`}
            style={{
              width: 32,
              height: 32,
              ...(!isDark ? { boxShadow: `0 0 10px ${rgbaString(lightStarColor, 0.55)}` } : {}),
            }}
          />
        )}

        {/* Pulsing glow — 16×16px */}
        <motion.div
          animate={
            { scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }
          }
          transition={
            { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          className={`absolute ${isDark ? "rounded-full bg-white" : ""}`}
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            filter: "blur(2px)",
            ...(!isDark
              ? {
                  background: rgbaString(lightStarColor, 0.75),
                }
              : {}),
          }}
        />

        {/* Core star — 8×8px */}
        <div
          className={`w-2 h-2 rounded-full relative z-10 transition-all ${
            isDark
              ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] duration-300"
              : "duration-700"
          }`}
          style={
            isDark
              ? undefined
              : {
                  width: 8,
                  height: 8,
                  background: rgbString(lightStarColor),
                  boxShadow: isHovered
                    ? `0 0 12px ${rgbaString(lightStarColor, 0.85)}`
                    : `0 0 8px ${rgbaString(lightStarColor, 0.68)}`,
                }
          }
        />
      </motion.div>

      {/* ── Tooltip card — also keeps hover alive ── */}
      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            key="card-tooltip"
            initial={{ opacity: 0, scale: 0.95, y: isBottomArea ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isBottomArea ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={`absolute left-1/2 -translate-x-1/2 z-40 w-56 rounded-lg border backdrop-blur-md shadow-2xl p-3 pointer-events-auto ${
              isBottomArea ? "bottom-6" : "top-6"
            } ${
              isDark
                ? "bg-black/80 border-white/10 text-white"
                : "bg-white/80 border-black/10 text-black"
            }`}
          >
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
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
                {star.title}
              </h4>
              <p className={`text-[10px] leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
                {star.description}
              </p>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-r border-b ${isDark ? "border-white/30" : "border-black/30"}`} />
            <div className={`absolute -top-1 -left-1 w-2 h-2 border-l border-t ${isDark ? "border-white/30" : "border-black/30"}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
