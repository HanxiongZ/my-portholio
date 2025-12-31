import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Project, mainProjects } from './Projects';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
}

export function ProjectDetail({ project, onBack, onSelectProject }: ProjectDetailProps) {
  
  // Scroll to top on mount or project change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentIndex = mainProjects.findIndex(p => p.id === project.id);
  // Loop navigation
  const nextProject = currentIndex === -1 ? mainProjects[0] : (mainProjects[currentIndex + 1] || mainProjects[0]);
  const prevProject = currentIndex === -1 ? mainProjects[mainProjects.length - 1] : (mainProjects[currentIndex - 1] || mainProjects[mainProjects.length - 1]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen pt-32 pb-12 md:pt-40 md:pb-0"
    >
      
      {/* BACKGROUND GRID (Consistent with Projects.tsx) */}
      <div className="fixed inset-0 container mx-auto px-6 md:px-12 pointer-events-none z-0">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="h-full border-l border-foreground/5 relative first:border-l-0 md:first:border-l"></div>
           ))}
           <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-foreground/5" />
           <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-foreground/5" />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* --- NAVIGATION --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-12 md:mb-24">
           <div className="col-span-2 md:col-span-12 backdrop-blur-sm">
             <button 
               onClick={onBack}
               className="group inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
             >
               <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
               Back to Index
             </button>
           </div>
        </div>

        {/* --- HERO HEADER --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-12 md:mb-20 items-end">
           <div className="col-span-1 md:col-span-8 md:col-start-1 backdrop-blur-sm">
              <span className="inline-block text-[10px] font-mono uppercase text-foreground/40 mb-4 md:mb-6">
                 {project.category} — {project.year}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none mb-6">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                 {project.tags.map((tag, i) => (
                   <span key={i} className="inline-block text-[9px] font-mono text-foreground/50 uppercase border border-foreground/15 px-2 py-1 rounded-full">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>
        </div>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
            
            {/* LEFT COLUMN: TABLE OF CONTENTS & META */}
            <div className="col-span-1 md:col-span-3 mb-12 md:mb-0 backdrop-blur-sm">
               <div className="sticky top-32 space-y-12">
                  
                  {/* Table of Contents */}
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-4">Index</span>
                    <ul className="space-y-3">
                       {['01 Context', '02 Approach', '03 Visuals', '04 Outcome'].map((item) => (
                         <li key={item} className="group cursor-pointer flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-foreground/30 group-hover:bg-foreground group-hover:border-foreground transition-colors"></span>
                            {item}
                         </li>
                       ))}
                    </ul>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2">Description</span>
                    <p className="text-xs font-medium leading-relaxed text-foreground/80">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2">Role</span>
                    <ul className="space-y-1">
                      {project.tags.map((tag, i) => (
                        <li key={i} className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

               </div>
            </div>

            {/* RIGHT COLUMN: VISUALS */}
            <div className="col-span-1 md:col-span-8 md:col-start-5 space-y-8 md:space-y-16 backdrop-blur-sm mb-24 md:mb-40">
               
               {/* Hero Image */}
               <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
               </div>

               {/* Content Block 1 */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                     <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                       The project began with a fundamental question: how can we reduce visual noise while maximizing information density? The solution lay in the strict application of a 12-column grid and a limited typographic scale.
                     </p>
                  </div>
                  <div className="col-span-1">
                     <p className="text-sm md:text-base leading-relaxed text-foreground/80">
                       By leveraging negative space as an active design element, we created a system that feels both expansive and precise—echoing the vast landscapes of Northern Sweden.
                     </p>
                  </div>
               </div>

               {/* Secondary Images (Placeholder Grid) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="aspect-[3/4] bg-foreground/5 border border-foreground/10 overflow-hidden">
                      <ImageWithFallback 
                        src={project.image} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                  </div>
                  <div className="aspect-[3/4] bg-foreground/5 border border-foreground/10 overflow-hidden mt-0 md:mt-12">
                       <ImageWithFallback 
                        src={project.image} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                  </div>
               </div>
               
               {/* Full Width Image */}
                <div className="aspect-[2.5/1] w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
                  <ImageWithFallback 
                    src={project.image} 
                    className="w-full h-full object-cover"
                  />
               </div>

            </div>

        </div>

      </div>

      {/* --- FOOTER NAVIGATION --- */}
      <div className="border-t border-foreground/10 bg-background/50 backdrop-blur-md">
         <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2">
               
               {/* PREVIOUS */}
               <button 
                 onClick={() => onSelectProject(prevProject)}
                 className="group border-r border-foreground/10 py-12 md:py-16 pr-6 flex flex-col items-start text-left hover:bg-foreground/5 transition-colors"
               >
                  <span className="text-[10px] font-mono uppercase text-foreground/40 mb-2 flex items-center gap-2">
                     <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                     Previous Project
                  </span>
                  <span className="text-lg md:text-xl font-bold uppercase tracking-wide">
                    {prevProject.title}
                  </span>
               </button>

               {/* NEXT */}
               <button 
                 onClick={() => onSelectProject(nextProject)}
                 className="group py-12 md:py-16 pl-6 flex flex-col items-end text-right hover:bg-foreground/5 transition-colors"
               >
                  <span className="text-[10px] font-mono uppercase text-foreground/40 mb-2 flex items-center gap-2">
                     Next Project
                     <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-lg md:text-xl font-bold uppercase tracking-wide">
                    {nextProject.title}
                  </span>
               </button>

            </div>
         </div>
      </div>

      {/* --- BACK TO TOP --- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 bg-background border border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors backdrop-blur-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </motion.section>
  );
}
