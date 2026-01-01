import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowUp } from 'lucide-react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { allProjects, mainProjects, sideProjects } from './Projects';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function ProjectDetail() {
  const { id } = useParams();
  const projectId = Number(id);
  const project = allProjects.find(p => p.id === projectId);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on mount or project change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Project not found
      </div>
    );
  }

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
               onClick={handleBack}
               className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/70 hover:text-background hover:bg-foreground px-3 py-1.5 border border-transparent hover:border-foreground transition-colors cursor-pointer"
             >
               <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
               Back to Index
             </button>
           </div>
        </div>

        {/* --- HERO HEADER --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-12 md:mb-24 items-end">
           <div className="col-span-1 md:col-span-10 md:col-start-1 backdrop-blur-sm">
              <span className="inline-block text-xs font-mono uppercase text-foreground/50 mb-4 md:mb-6 tracking-widest">
                 {project.category} — {project.year}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium uppercase tracking-tighter leading-[0.85] mb-8">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                 {project.tags.map((tag, i) => (
                   <span key={i} className="inline-block text-[10px] md:text-xs font-mono text-foreground/60 uppercase border border-foreground/20 px-2 py-1 rounded-full bg-background/50">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>
        </div>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
            
            {/* LEFT COLUMN: META & TOC - DESIGNED */}
            <div className="col-span-1 md:col-span-3 mb-16 md:mb-0 backdrop-blur-sm">
               <div className="sticky top-32 flex flex-col gap-10">
                  
                  {/* Brief */}
                  <div className="border-t border-foreground/10 pt-3">
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                       (01) Brief
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/80 font-normal text-pretty">
                      {project.description}
                    </p>
                  </div>

                  {/* Scope */}
                  <div className="border-t border-foreground/10 pt-3">
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                       (02) Scope
                    </span>
                    <ul className="space-y-2">
                      {project.tags.map((tag, i) => (
                        <li key={i} className="text-xs font-bold uppercase tracking-wide text-foreground/70 flex items-center gap-2">
                          <span className="w-1 h-1 bg-foreground/30 rounded-full"></span>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Navigator */}
                  <div className="border-t border-foreground/10 pt-3">
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                       (03) Jump To
                    </span>
                    <ul className="space-y-0">
                       {['Context', 'Approach', 'Visuals', 'Outcome'].map((item, i) => (
                         <li key={item} className="group cursor-pointer flex items-center justify-between py-2 border-b border-foreground/5 last:border-0 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors">
                            <span>0{i+1}. {item}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                         </li>
                       ))}
                    </ul>
                  </div>

               </div>
            </div>

            {/* RIGHT COLUMN: VISUALS & NARRATIVE */}
            <div className="col-span-1 md:col-span-8 md:col-start-5 space-y-16 md:space-y-32 backdrop-blur-sm mb-32 md:mb-48">
               
               {/* Hero Image */}
               <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
               </div>

               {/* NARRATIVE SECTION - Enhanced Graphic Design Layout */}
               <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12">
                  
                  {/* Divider & Header */}
                  <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4">
                     <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">01 — The Challenge</span>
                  </div>

                  {/* Lead Text (Big, Airy) */}
                  <div className="col-span-1 md:col-span-5">
                     <p className="text-xl md:text-2xl leading-relaxed font-light text-foreground/90 text-pretty">
                       <span className="text-foreground/40 font-serif italic pr-2">"</span>
                       The project began with a fundamental question: how can we reduce visual noise while maximizing information density?
                     </p>
                  </div>

                  {/* Pull Quote / Sidebar Note */}
                  <div className="col-span-1 md:col-span-3 md:pl-6 border-l border-foreground/10 hidden md:block">
                     <p className="text-xs font-mono uppercase leading-relaxed text-foreground/60">
                        DESIGN SYSTEM<br/>
                        GRID: 12 COLUMNS<br/>
                        TYPE: SANS + MONO
                     </p>
                  </div>

                  {/* Body Text (Narrow Measure for Readability) */}
                  <div className="col-span-1 md:col-span-5 md:col-start-1">
                     <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                       The solution lay in the strict application of a 12-column grid and a limited typographic scale. By leveraging negative space as an active design element, we created a system that feels both expansive and precise.
                     </p>
                     <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                       Echoing the vast landscapes of Northern Sweden where the initial concepts were developed, every pixel was placed with intention, removing the superfluous to reveal the essential.
                     </p>
                  </div>

               </div>

               {/* Secondary Images (Asymmetric Grid) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="aspect-[3/4] bg-foreground/5 border border-foreground/10 overflow-hidden">
                      <ImageWithFallback 
                        src={project.image} 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                  </div>
                  <div className="aspect-[3/4] bg-foreground/5 border border-foreground/10 overflow-hidden mt-0 md:mt-24">
                       <ImageWithFallback 
                        src={project.image} 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <div className="mt-4 text-xs font-mono uppercase text-foreground/40 text-right">
                         Figure 02. Interaction Pattern
                      </div>
                  </div>
               </div>
               
               {/* Full Width Image with Caption */}
                <div className="w-full">
                  <div className="aspect-[2.5/1] w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-4">
                    <ImageWithFallback 
                      src={project.image} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
                     <div className="col-span-1 md:col-span-2 text-xs font-mono uppercase text-foreground/40 border-t border-foreground/10 pt-2">
                        Figure 03
                     </div>
                     <div className="col-span-1 md:col-span-6 text-xs font-mono uppercase text-foreground/40 border-t border-foreground/10 pt-2 text-right md:text-left">
                        Final Composition
                     </div>
                  </div>
               </div>

            </div>

        </div>

      </div>

      {/* --- FOOTER: 12-COLUMN NAVIGATOR --- */}
      <div className="border-t border-foreground/10 bg-background/50 backdrop-blur-md py-12 md:py-16">
         <div className="container mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
               
               {/* Projects 1-5 */}
               {mainProjects.map((p) => (
                  <Link 
                     key={p.id}
                     to={`/project/${p.id}`}
                     className={`
                        col-span-1 md:col-span-2 group flex flex-col justify-between h-32 md:h-40 p-5 border border-transparent transition-all duration-300
                        ${p.id === projectId 
                           ? 'opacity-40 cursor-default pointer-events-none grayscale' 
                           : 'hover:bg-foreground hover:text-background'
                        }
                     `}
                  >
                     <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100">
                           0{p.id}
                        </span>
                        {p.id !== projectId && (
                           <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                     </div>
                     
                     <div>
                        <span className="block text-xs font-mono uppercase opacity-50 mb-2 group-hover:opacity-80 tracking-wider">
                           {p.category}
                        </span>
                        <h4 className="text-base font-bold uppercase leading-tight tracking-wide">
                           {p.title}
                        </h4>
                     </div>
                  </Link>
               ))}

               {/* Index Link (fills last 2 columns to complete the 12-grid) */}
               <button 
                  onClick={handleBack}
                  className="col-span-1 md:col-span-2 group flex flex-col justify-between h-32 md:h-40 p-5 border border-foreground/10 hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 w-full text-left"
               >
                  <div className="flex justify-between items-start w-full">
                     <span className="text-xs font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100">
                        Index
                     </span>
                     <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex items-end justify-between">
                     <h4 className="text-base font-bold uppercase leading-tight tracking-wide">
                        View All
                     </h4>
                  </div>
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
            className="fixed bottom-8 right-8 z-50 p-4 bg-background border border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors backdrop-blur-sm"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </motion.section>
  );
}
