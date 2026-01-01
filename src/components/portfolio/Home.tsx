import React from 'react';
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { Experience } from "./Experience";
import { Constellation } from "./Constellation";
import { Footer } from "./Footer";
import { motion } from "motion/react";

interface HomeProps {
  isDark: boolean;
}

export function Home({ isDark }: HomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Interactive Constellation (Foreground Highlights) */}
      <Constellation isDark={isDark} />

      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </motion.div>
  );
}
