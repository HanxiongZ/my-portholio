import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
      // Double check to override any browser scroll restoration
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
