import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "./svg-blbo3fno2n";

export function AugmentedButton() {
  const [isPressed, setIsPressed] = useState(false);
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

      // "Augmented" sound: darker, digital-mechanical hybrid
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(100, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handlePress = () => {
    setIsPressed(true);
    playClickSound();
    if (navigator.vibrate) {
      navigator.vibrate([10, 30, 10]); // Complex vibration pattern
    }
  };

  return (
    <div 
      className="relative w-[82.96px] h-[117.933px] cursor-pointer touch-none select-none group"
      onMouseDown={handlePress}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onTouchEnd={() => setIsPressed(false)}
    >
      <svg className="block w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" fill="none" preserveAspectRatio="none" viewBox="0 0 82.96 117.933">
        <g clipPath="url(#clip0_1_90)" id="Group 2">
          
          {/* Glass Body */}
          <motion.g 
            id="Rectangle 21" 
            filter="url(#filter0_n_1_90)"
            animate={{ scale: isPressed ? 0.98 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <path d={svgPaths.p33f19df0} fill="var(--fill-0, white)" fillOpacity="0.1" />
          </motion.g>

          {/* Border Outline - Glows on press */}
          <motion.path 
            d={svgPaths.pbca6800} 
            id="Rectangle 22" 
            stroke="var(--stroke-0, white)" 
            animate={{ 
              stroke: isPressed ? "#ffffff" : "rgba(255,255,255,0.4)",
              strokeWidth: isPressed ? 2 : 1
            }}
          />

          {/* The "Button" Ellipse - Moves and Glows */}
          <motion.path 
            d={svgPaths.p25729440} 
            id="Ellipse 5" 
            stroke="var(--stroke-0, white)" 
            fill={isPressed ? "rgba(255,255,255,0.2)" : "transparent"}
            animate={{ 
              x: isPressed ? 2 : 0,
              y: isPressed ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          />

          {/* Digital Feedback Ring */}
          <AnimatePresence>
            {isPressed && (
              <motion.circle
                cx="30"
                cy="55"
                r="15"
                stroke="white"
                strokeWidth="2"
                fill="none"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="107.295" id="filter0_n_1_90" width="69.9466" x="13.0133" y="8.82696">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feTurbulence baseFrequency="2 2" numOctaves="3" result="noise" seed="8499" stitchTiles="stitch" type="fractalNoise" />
            <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA type="discrete" />
            </feComponentTransfer>
            <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
            <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
            <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
            <feMerge result="effect1_noise_1_90">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
          <clipPath id="clip0_1_90">
            <rect fill="white" height="117.933" width="82.96" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
