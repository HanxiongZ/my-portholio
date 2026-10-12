import React from "react";
import { motion } from "motion/react";
import { PortfolioArrow } from "./PortfolioArrow";

export function Hero() {
  const bioText =
    "Hi, I'm an interaction designer who tells stories about human, technology and life :)";

  const handleScrollToProjects = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    const projectsSection =
      document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen relative w-full pt-[140px] pb-12 flex flex-col justify-between overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col">
        {/* Preserve the original metadata row rhythm without displaying its content. */}
        <div
          aria-hidden="true"
          className="h-[59px] shrink-0 mb-12"
        />

        {/* PRIMARY CONTENT: CENTERED VERTICALLY */}
        <div
          className="flex-grow flex flex-col justify-center pb-24 relative"
          style={{ transform: "translateY(40px)" }}
        >
          {/* NAME CLUSTER: Anchored to Col 1 & Col 5 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
            {/* Hanxiong: Col 1-5 */}
            <div className="col-span-12 md:col-span-5 relative z-20 pl-2 md:pl-3 backdrop-blur-sm">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hero-name-type uppercase text-foreground"
              >
                Hanxiong
              </motion.h1>
            </div>

            {/* Zhang: Col 5-9 (Indented Stack) */}
            <div className="col-span-12 md:col-start-5 md:col-span-5 relative z-20 pl-2 md:pl-3 pt-4 md:pt-0 backdrop-blur-sm">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hero-name-type uppercase text-foreground"
              >
                Zhang
              </motion.h1>
            </div>
          </div>

          {/* BIO: Anchored to Col 9 (Separate Group) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mt-16 md:mt-24">
            <div className="col-span-12 md:col-start-9 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div aria-hidden="true" className="w-8 h-px mb-6" />
                <p className="hero-body-type text-justify hyphens-auto text-foreground/90">
                  {bioText}
                </p>
                <div className="mt-8">
                  <a
                    href="#projects"
                    onClick={handleScrollToProjects}
                    className="portfolio-button portfolio-button--down"
                  >
                    <span>Explore Projects</span>
                    <PortfolioArrow direction="down" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
