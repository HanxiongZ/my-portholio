import image_8d6ff16d295012b90ba5e0a703ab3fe87e5a8ae5 from "figma:asset/8d6ff16d295012b90ba5e0a703ab3fe87e5a8ae5.png";
import image_de931ac5e43ce9de9725a2a9c3f54de0f489bc02 from "figma:asset/de931ac5e43ce9de9725a2a9c3f54de0f489bc02.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  tags: string[];
}

export const mainProjects: Project[] = [
  {
    id: 1,
    title: "Crafting Haptic Expression",
    category: "Physical UX",
    year: "2025",
    image: image_8d6ff16d295012b90ba5e0a703ab3fe87e5a8ae5,
    description:
      "A prototype-driven exploration into how haptic communication can enhance physical controls in next-generation Volvo cars.",
    tags: ["HAPTICS", "PHYSICAL UX", "AUTOMOTIVE"],
  },
  {
    id: 2,
    title: "Essence Object",
    category: "Product Design",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1761830476467-0ff86dbcc75d?q=80&w=1200&auto=format&fit=crop",
    description:
      "A study in reduction. Stripping away the non-essential.",
    tags: ["Industrial", "Prototyping"],
  },
  {
    id: 3,
    title: "Digital Entropy",
    category: "Interaction",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1605453169876-482f55dc24e5?q=80&w=1200&auto=format&fit=crop",
    description:
      "Visualizing data chaos through algorithmic design patterns.",
    tags: ["Web", "Data Viz"],
  },
  {
    id: 4,
    title: "Chronos",
    category: "Interface",
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    description:
      "A time-management system designed for deep work.",
    tags: ["UI/UX", "Mobile"],
  },
  {
    id: 5,
    title: "Silent Form",
    category: "Editorial",
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop",
    description:
      "A printed publication celebrating silence in a noisy world.",
    tags: ["Print", "Art Direction"],
  },
];

export const sideProjects: Project[] = [
  {
    id: 6,
    title: "Glyph Studies",
    category: "Type Design",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    description: "Experimental typography.",
    tags: [],
  },
  {
    id: 7,
    title: "Flora Generative",
    category: "Creative Coding",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1763931768155-ffefc3099cb1?q=80&w=600&auto=format&fit=crop",
    description: "Procedural plant growth.",
    tags: [],
  },
  {
    id: 8,
    title: "Echo Chamber",
    category: "Sound Design",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
    description: "Audio-reactive visuals.",
    tags: [],
  },
  {
    id: 9,
    title: "Raw Material",
    category: "Photography",
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=600&auto=format&fit=crop",
    description: "Texture studies.",
    tags: [],
  },
];

export const allProjects = [...mainProjects, ...sideProjects];

export function Projects() {
  const [activeId, setActiveId] = useState<number>(1);
  const activeProject =
    mainProjects.find((p) => p.id === activeId) ||
    mainProjects[0];

  return (
    <section
      id="projects"
      className="relative w-full py-24 md:py-32 overflow-hidden scroll-mt-24"
    >
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-full border-l border-foreground/5 relative first:border-l-0 md:first:border-l"
            ></div>
          ))}
          <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-foreground/5" />
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-foreground/5" />
        </div>
      </div>

      <div
        id="selected works"
        className="container mx-auto px-6 md:px-12 relative z-10"
      >
        {/* --- HEADER --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-16">
          <div className="col-span-2 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
            <span className="inline-block text-xs font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none">
              Selected Works
            </span>
            <div className="h-px bg-foreground/10 w-full mt-2" />
          </div>
        </div>

        {/* --- SPLIT LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 items-start mb-32 min-h-[500px]">
          {/* LEFT: LIST (Interactive - Inverted Hover) */}
          <div className="hidden md:flex col-span-1 md:col-span-4 flex-col pt-2 relative z-20 pl-2 md:pl-3 backdrop-blur-sm">
            {mainProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                onMouseEnter={() => setActiveId(project.id)}
                className={`
                     group relative cursor-pointer block py-4 px-3 border-b border-foreground/10 last:border-0 transition-colors duration-300
                     ${
                       activeId === project.id
                         ? "bg-foreground text-background border-transparent"
                         : "hover:bg-foreground hover:text-background hover:border-transparent text-foreground"
                     }
                   `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${activeId === project.id ? "text-background/60" : "text-foreground/40 group-hover:text-background/60"}`}
                    >
                      0{project.id}
                    </span>
                    <h3
                      className={`text-base font-bold uppercase tracking-wide transition-all duration-300 ${activeId === project.id ? "text-background translate-x-2" : "group-hover:text-background group-hover:translate-x-2"}`}
                    >
                      {project.title}
                    </h3>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-all duration-300 ${activeId === project.id ? "opacity-100 translate-x-0 text-background" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-background"}`}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* RIGHT: PREVIEW (Tight & Aligned) */}
          <div className="hidden md:block col-span-1 md:col-span-6 md:col-start-7 h-full pl-2 md:pl-3 backdrop-blur-sm">
            <div className="sticky top-24">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeProject.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                    filter: "blur(4px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    filter: "blur(4px)",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full relative"
                >
                  {/* Image - Standard Ratio (3:2) */}
                  <div className="aspect-[3/2] w-full overflow-hidden bg-foreground/5 mb-8 relative border border-foreground/10">
                    <ImageWithFallback
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details - Grid Aligned */}
                  <div className="grid grid-cols-[64fr_36fr] gap-x-6 pt-6 border-t border-foreground/10">
                    <div className="col-span-1">
                      <span className="block text-xs font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none">
                        Context
                      </span>
                      <p className="text-sm md:text-base font-light leading-relaxed text-left hyphens-auto text-foreground/80 mb-6 text-pretty">
                        {activeProject.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] font-mono text-foreground/60 uppercase border border-foreground/15 px-2 py-1 rounded bg-background/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-1 flex flex-col items-end">
                      <div className="text-right mb-8">
                        <span className="block text-xs font-mono uppercase text-foreground/40 mb-2 tracking-widest leading-none">
                          Year
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wider leading-none">
                          {activeProject.year}
                        </span>
                      </div>

                      <Link 
                        to={`/project/${activeProject.id}`}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/70 hover:text-background hover:bg-foreground transition-colors px-3 py-1.5 border border-transparent hover:border-foreground"
                      >
                        View Case{" "}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden col-span-1 mt-8 space-y-16">
            {mainProjects.map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="group block border-b border-foreground/10 pb-12 last:border-0 backdrop-blur-sm cursor-pointer"
              >
                <div className="aspect-[3/2] bg-foreground/5 mb-6 overflow-hidden border border-foreground/10">
                  <ImageWithFallback
                    src={p.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold uppercase tracking-wide">
                    {p.title}
                  </h3>
                  <span className="text-xs font-mono uppercase text-foreground/40 tracking-widest">
                    {p.year}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-6 leading-relaxed font-light">
                  {p.description}
                </p>
                <button className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background px-3 py-1.5 border border-foreground/20">
                  View Case
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* --- SIDE PROJECTS (Shorter) --- */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-12">
            <div className="col-span-2 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
              <span className="inline-block text-xs font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none">
                Playground
              </span>
              <div className="h-px bg-foreground/10 w-full mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pl-2 md:pl-3">
            {sideProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group cursor-pointer backdrop-blur-sm block"
              >
                <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-4 border border-foreground/10">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>
                <div className="flex flex-col gap-1.5 pr-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider group-hover:text-foreground/60 transition-colors">
                    {project.title}
                  </h4>
                  <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                    {project.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
