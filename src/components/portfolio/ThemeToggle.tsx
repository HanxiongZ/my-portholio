import React from 'react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      className={`group relative w-16 h-8 rounded-full overflow-hidden shadow-lg transition-all duration-500 active:scale-95 ${
        isDark 
          ? 'border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)] bg-slate-800' 
          : 'border border-white/10 shadow-md bg-sky-200'
      }`}
      aria-label="Toggle Theme"
    >
      {/* Background Sky - Smooth Crossfade */}
      <div className={`absolute inset-0 transition-colors duration-700 ease-in-out ${isDark ? 'bg-slate-900/80' : 'bg-[#60A5FA]'}`} />

      {/* Clouds (Day Only) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute top-1.5 left-2 w-3 h-1 bg-white/40 rounded-full blur-[1px]" />
          <div className="absolute bottom-2 right-3 w-4 h-1.5 bg-white/30 rounded-full blur-[1px]" />
      </div>

      {/* Stars (Night Only) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-90" />
          <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
          <div className="absolute top-2 right-2 w-1 h-1 bg-white/80 rounded-full blur-[0.5px]" />
      </div>

      {/* The Rotator Arm */}
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 12 }}
        className="absolute top-[100%] left-1/2 w-0 h-0" 
      >
        {/* Sun - Positioned above the pivot (Visible at 0deg) */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center">
           <div className="w-4 h-4 bg-[#FDB813] rounded-full shadow-[0_0_8px_rgba(253,184,19,0.8)] relative z-10">
              <div className="absolute inset-0 bg-yellow-200 blur-[1px] opacity-60 rounded-full" />
           </div>
        </div>

        {/* Moon - Positioned below the pivot (Visible at 180deg) */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center rotate-180">
           <div className="w-4 h-4 bg-slate-200 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.5)] relative overflow-hidden z-10">
              <div className="absolute top-0.5 right-1 w-1 h-1 bg-slate-400/40 rounded-full" />
              <div className="absolute bottom-1 left-0.5 w-0.5 h-0.5 bg-slate-400/40 rounded-full" />
           </div>
        </div>
      </motion.div>

      {/* Inner Shadow/Gloss for Depth */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] pointer-events-none" />
    </button>
  );
}
