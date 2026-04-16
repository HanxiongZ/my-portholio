import React, { useLayoutEffect } from 'react';
import { useLocation, useOutletContext } from "react-router";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { Experience } from "./Experience";
import { Constellation } from "./Constellation";
import { Footer } from "./Footer";
import { motion } from "motion/react";
import type { OutletContextType } from "./Layout";

export function Home() {
  const location = useLocation();
  const { isDark } = useOutletContext<OutletContextType>();

  useLayoutEffect(() => {
    if (location.state?.scrollToProjects) {
      const timer = setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    } else if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
      // Double check to override any browser scroll restoration
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div>
      {/* Interactive Constellation (Foreground Highlights) */}
      <Constellation isDark={isDark} />

      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </div>
  );
}
