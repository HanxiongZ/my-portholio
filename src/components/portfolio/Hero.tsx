import React from "react";
import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  const bioText =
    "Hi, I'm an interaction designer who tells stories about human, technology and life :)";

  const handleScrollToProjects = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    const projectsSection =
      document.getElementById("selected works");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen relative w-full pt-[140px] pb-12 flex flex-col justify-between overflow-hidden">
      {/* 
        GESTALT GRID SYSTEM VISUALIZATION
      */}
      <div className="absolute inset-0 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-full border-l border-foreground/5 relative first:border-l-0 md:first:border-l"
            >
              {/* Visualizing the columns. */}
            </div>
          ))}
          {/* Close the grid on the far right */}
          <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-foreground/5" />
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-foreground/5" />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col">
        {/* ROW 1: Meta Data */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 border-b border-foreground/10 pb-6 mb-12 items-start">
          {/* Axis 1: Left */}
          <div className="col-span-1 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
            <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 leading-none">
              Role
            </span>
            <div className="flex items-center h-4">
              <span className="text-xs font-bold uppercase tracking-wider leading-none">
                Designer
              </span>
            </div>
          </div>

          {/* Axis 2: Center (Col 5) */}
          <div className="hidden md:block md:col-start-5 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
            <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 leading-none">
              Focus
            </span>
            <div className="flex items-center h-4">
              <span className="text-xs font-bold uppercase tracking-wider leading-none">
                UX/Interaction
              </span>
            </div>
          </div>

          {/* Axis 3: Right (Col 9) */}
          <div className="col-span-1 md:col-start-9 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
            <div className="flex flex-col items-end md:items-start">
              <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 leading-none">
                Status
              </span>
              <div className="flex items-center gap-2 h-4">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider leading-none">
                  Working on Thesis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY CONTENT: CENTERED VERTICALLY */}
        <div className="flex-grow flex flex-col justify-center pb-24 relative">
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
                className="text-6xl md:text-8xl font-light uppercase tracking-wide text-foreground leading-none"
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
                className="text-6xl md:text-8xl font-light uppercase tracking-wide text-foreground leading-none"
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
                <div className="w-8 h-px bg-foreground/30 mb-6" />{" "}
                {/* Minimalist Separator */}
                <p className="text-sm md:text-sm font-medium leading-relaxed text-justify hyphens-auto text-foreground/80">
                  {bioText}
                </p>
                <div className="mt-8">
                  <a
                    href="#projects"
                    onClick={handleScrollToProjects}
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/70 hover:text-background hover:bg-foreground transition-colors px-2 py-1 whitespace-nowrap cursor-pointer"
                  >
                    <span>Go to Projects</span>
                    <ArrowDownRight className="w-3 h-3" />
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