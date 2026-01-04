import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "./svg-pieu9xx8xe";

export function AnalogButton() {
  const [isPressed, setIsPressed] = useState(false);
  
  // Audio context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
        }
    }
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playClickSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const playReleaseSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handlePress = () => {
    setIsPressed(true);
    playClickSound();
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleRelease = () => {
    setIsPressed(false);
    playReleaseSound();
  };

  return (
    <div 
      className="relative w-[179.686px] h-[107px] cursor-pointer touch-none select-none"
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onTouchEnd={handleRelease}
    >
      <svg
        className="block w-full h-full drop-shadow-2xl"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 179.686 107"
      >
        <g id="Group 7">
          {/* Base Plate */}
          <path
            d={svgPaths.pb42b300}
            fill="var(--fill-0, #626262)"
            id="Vector 23"
          />
          
          {/* Well Bottom (Darkened for depth) */}
          <path
            d={svgPaths.p15d08580}
            fill="#4a4a4a"
            id="Ellipse 7"
            stroke="var(--stroke-0, white)"
            strokeWidth="0.737931"
          />

          {/* Moving Parts */}
          <motion.g
            initial={false}
            animate={{ y: isPressed ? 4 : 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              mass: 0.8
            }}
          >
            {/* Cylinder Side */}
            <path
              d={svgPaths.p3e527c00}
              fill="var(--fill-0, #626262)"
              id="Ellipse 8"
              stroke="var(--stroke-0, white)"
              strokeWidth="0.737931"
            />
            {/* Top Face */}
            <path
              d={svgPaths.p2199cf80}
              fill="var(--fill-0, #626262)"
              id="Ellipse 6"
              stroke="var(--stroke-0, white)"
              strokeWidth="0.737931"
            />
          </motion.g>

          {/* Visual Impact Ripple (Tactile Visualization) */}
          <AnimatePresence>
            {isPressed && (
              <>
                <motion.ellipse
                  cx="90"
                  cy="53"
                  rx="40"
                  ry="20"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  initial={{ scale: 0.8, opacity: 1, strokeWidth: 3 }}
                  animate={{ scale: 1.4, opacity: 0, strokeWidth: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
}
