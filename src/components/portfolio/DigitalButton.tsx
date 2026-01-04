import { motion } from "motion/react";

export function DigitalButton() {
  return (
    <motion.button
      className="relative flex items-center justify-center bg-[#626262] h-[42px] w-[140px] rounded-[28px] outline-none touch-none select-none cursor-pointer overflow-hidden border border-white/10 shadow-lg"
      whileTap={{ scale: 0.95, backgroundColor: "#525252" }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      <span className="font-['Manrope'] text-[12px] font-medium text-white/90 tracking-[0.2em] uppercase">
        Click
      </span>
    </motion.button>
  );
}