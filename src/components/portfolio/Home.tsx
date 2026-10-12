import React, { useLayoutEffect } from 'react';
import { useOutletContext } from "react-router";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { Experience } from "./Experience";
import { Constellation } from "./Constellation";
import { Footer } from "./Footer";
import { motion } from "motion/react";
import type { OutletContextType } from "./Layout";

export function Home() {
  const { isDark } = useOutletContext<OutletContextType>();

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <div className="portfolio-home">
      {/* Interactive Constellation (Foreground Highlights) */}
      <Constellation isDark={isDark} />

      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </div>
  );
}
