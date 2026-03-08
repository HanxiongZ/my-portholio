import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  getThumbnail,
  getPlaygroundPreview,
  getPlaygroundVideo,
} from "./projectImages";

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  content: string;
  toc?: string[];
  tags: string[];
}

export const mainProjects: Project[] = [
  {
    id: 1,
    title: "From Novelity to Normality",
    category: "Master Thesis Project",
    year: "2026",
    image: getThumbnail(1),
    description:
      "Exploring the long term interactions with AI in the rural healthcare system",
    content: "This project is working in progress.",
    toc: [
      "Background and Focus",
      "Research",
      "Prototyping",
      "Outcome",
    ],
    tags: [
      "Physical AI",
      "Rural Healthcare",
      "Long-term Interaction",
    ],
  },
  {
    id: 2,
    title: "Beyond the Clicks",
    category: "Physical UX Internship",
    year: "2025",
    image: getThumbnail(2),
    description:
      "Designing haptics to extend the possiblities of physical controls at Volvo Cars",
    content:
      "This project came from my exploration and design work around haptics during my internship at Volvo Cars.Investigated how tactile feedback can extend interaction layers on physical controls.",
    toc: [
      "Background and Focus",
      "Research",
      "Prototyping",
      "Outcome",
    ],
    tags: [
      "HAPTICS",
      "PHYSICAL UX",
      "AUTOMOTIVE",
      "PROTOTYPING",
    ],
  },
  {
    id: 3,
    title: "Co-Act",
    category: "GUI Design",
    year: "2023",
    image: getThumbnail(3),
    description:
      "A collaborative GUI that empowers service mechanics to navigate machine complexity in forestry.",
    content:
      "Envisioning the forestry service in 5 years, CO-ACT is a collaborative GUI that facilitates the exchange of tacit knowledge in a shared digital space. The system uses AI to augment human judgement rather than replace it, supporting safe, precise and efficient operations.\n\n\nTeam up with: Anjuli Acharya, Dide Sevinçok, Lin Wang",

    toc: ["Background", "Ethnography", "Design Strategy", "Collaborative Actions", "Concept Video"],
    tags: ["GUI", "Tacit knowledge"],
  },
  {
    id: 4,
    title: "Chronos",
    category: "Interface",
    year: "2022",
    image: getThumbnail(4),
    description:
      "A time-management system designed for deep work.A time-management system designed for deep",
    content:
      "Chronos challenges the conventional calendar interface. Instead of viewing time as a series of rigid blocks, Chronos visualizes it as a fluid resource. The interface is designed to support 'deep work' states, minimizing notifications and highlighting contiguous blocks of focus time. The dark-mode-first aesthetic reduces eye strain during late-night sessions, while the typography emphasizes clarity and hierarchy.",
    toc: ["Problem", "Design System", "Interface"],
    tags: ["UI/UX", "Mobile"],
  },
  {
    id: 5,
    title: "Silent Form",
    category: "Editorial",
    year: "2022",
    image: getThumbnail(5),
    description:
      "A printed publication celebrating silence in a noisy world.",
    content:
      "Silent Form is a limited-edition art book that explores the concept of silence through photography and typography. The layout utilizes aggressive negative space, forcing the reader to slow down and appreciate the void between elements. The paper selection—a heavy, uncoated stock—adds a tactile dimension to the reading experience, grounding the abstract concepts in physical reality.",
    toc: ["Editorial", "Typography", "Photography"],
    tags: ["Print", "Art Direction"],
  },
];

export const sideProjects: Project[] = [
  {
    id: 6,
    title: "Glyph Studies",
    category: "Type Design",
    year: "2024",
    image: getThumbnail(6),
    description: "Experimental typography.",
    content:
      "A daily practice of creating new letterforms based on strict geometric constraints.",
    toc: ["Overview", "Details"],
    tags: [],
  },
  {
    id: 7,
    title: "Flora Generative",
    category: "Creative Coding",
    year: "2023",
    image: getThumbnail(7),
    description: "Procedural plant growth.",
    content:
      "Simulating organic growth patterns using recursive functions and L-systems.",
    toc: ["Overview", "Details"],
    tags: [],
  },
  {
    id: 8,
    title: "Echo Chamber",
    category: "Sound Design",
    year: "2023",
    image: getThumbnail(8),
    description: "Audio-reactive visuals.",
    content:
      "Real-time visualization of sound frequencies using Web Audio API and Canvas.",
    toc: ["Overview", "Details"],
    tags: [],
  },
  {
    id: 9,
    title: "Raw Material",
    category: "Photography",
    year: "2022",
    image: getThumbnail(9),
    description: "Texture studies.",
    content:
      "A photographic series documenting the decay of industrial materials in urban environments.",
    toc: ["Overview", "Details"],
    tags: [],
  },
];

export const allProjects = [...mainProjects, ...sideProjects];

export function Projects() {
  const [activeId, setActiveId] = useState<number>(1);
  const activeProject =
    mainProjects.find((p) => p.id === activeId) ||
    mainProjects[0];

  // ── Playground hover — zero React state, pure DOM ──────────────
  // Using refs means mouse-move and row-enter never trigger a
  // re-render, eliminating the flicker completely.
  const previewRef = useRef<HTMLDivElement>(null);
  const activeImgId = useRef<number | null>(null);
  const imgEls = useRef(new Map<number, HTMLElement>());
  const videoEls = useRef(new Map<number, HTMLVideoElement>());
  const isVisible = useRef(false);

  const onContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!previewRef.current) return;
      previewRef.current.style.transform = `translate(${
        e.clientX -
        e.currentTarget.getBoundingClientRect().left +
        24
      }px, ${e.clientY - e.currentTarget.getBoundingClientRect().top - 90}px)`;
    },
    [],
  );

  const onContainerMouseLeave = useCallback(() => {
    if (!previewRef.current) return;
    previewRef.current.style.opacity = "0";
    isVisible.current = false;
    // Hide active layer instantly & pause any playing video
    if (activeImgId.current !== null) {
      const el = imgEls.current.get(activeImgId.current);
      if (el) el.style.visibility = "hidden";
      const vid = videoEls.current.get(activeImgId.current);
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
      activeImgId.current = null;
    }
  }, []);

  const onRowMouseEnter = useCallback((id: number) => {
    if (!previewRef.current) return;
    // Same project re-entry → do nothing (prevents flicker)
    if (activeImgId.current === id) {
      if (!isVisible.current) {
        previewRef.current.style.opacity = "1";
        isVisible.current = true;
      }
      return;
    }
    // Reveal preview container
    if (!isVisible.current) {
      previewRef.current.style.opacity = "1";
      isVisible.current = true;
    }
    // Instant swap: hide previous, show next — no transition
    if (activeImgId.current !== null) {
      const prev = imgEls.current.get(activeImgId.current);
      if (prev) prev.style.visibility = "hidden";
      // Pause previous video
      const prevVid = videoEls.current.get(activeImgId.current);
      if (prevVid) {
        prevVid.pause();
        prevVid.currentTime = 0;
      }
    }
    const next = imgEls.current.get(id);
    if (next) next.style.visibility = "visible";
    // Play next video if exists
    const nextVid = videoEls.current.get(id);
    if (nextVid) nextVid.play().catch(() => {});
    activeImgId.current = id;
  }, []);

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
                  {/* ────────────────────────────────────────────
                       DESKTOP PREVIEW THUMBNAILS
                       Each project has its own <ImageWithFallback>.
                       Click any image → point-and-edit → upload.
                       Only THAT project's image will change.
                     ──────────────────────────────────────────── */}
                  <div className="aspect-[3/2] w-full overflow-hidden bg-foreground/5 mb-8 relative border border-foreground/10">
                    {activeId === 1 && (
                      <ImageWithFallback
                        src={getThumbnail(1)}
                        alt="From Novelity to Normality"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                    {activeId === 2 && (
                      <ImageWithFallback
                        src={getThumbnail(2)}
                        alt="Beyond the Clicks"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                    {activeId === 3 && (
                      <ImageWithFallback
                        src={getThumbnail(3)}
                        alt="Co-Act"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                    {activeId === 4 && (
                      <ImageWithFallback
                        src={getThumbnail(4)}
                        alt="Chronos"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                    {activeId === 5 && (
                      <ImageWithFallback
                        src={getThumbnail(5)}
                        alt="Silent Form"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                  </div>

                  {/* Details - Grid Aligned */}
                  <div className="grid grid-cols-[64fr_36fr] gap-x-6 pt-6 border-t border-foreground/10">
                    <div className="col-span-1">
                      <span className="block font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none text-[10px]">
                        Context
                      </span>
                      <p className="text-[12px] md:text-[14px] font-normal leading-relaxed text-left hyphens-auto text-foreground/80 mb-6 text-pretty">
                        {activeProject.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block text-[8px] font-mono text-foreground/60 uppercase border border-foreground/15 px-2 py-1 rounded bg-background/50"
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
            {mainProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className={`group block pb-12 backdrop-blur-sm cursor-pointer ${
                  index < mainProjects.length - 1 ? "border-b border-foreground/10" : ""
                }`}
              >
                <div className="aspect-[3/2] bg-foreground/5 mb-6 overflow-hidden border border-foreground/10">
                  <ImageWithFallback
                    src={getThumbnail(project.id)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono uppercase text-foreground/40 tracking-widest">
                    {project.year}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-6 leading-relaxed font-light">
                  {project.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background px-3 py-1.5 border border-foreground/20">
                  View Case
                </span>
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

          {/* Desktop: Minimal title list with hover image reveal */}
          <div
            className="hidden md:block relative pl-2 md:pl-3"
            onMouseMove={onContainerMouseMove}
            onMouseLeave={onContainerMouseLeave}
          >
            {/*
              Floating preview — always in the DOM, never unmounts.
              Position:  driven by transform via direct DOM ref.
              Visibility: driven by opacity via direct DOM ref.
              Image swap: driven by per-image opacity via imgEls Map.
              Zero React state → zero re-renders on hover.
            */}
            <div
              ref={previewRef}
              className="pointer-events-none absolute top-0 left-0 z-50 w-[260px] aspect-[4/3] overflow-hidden border border-foreground/10 shadow-xl"
              style={{
                opacity: 0,
                transform: "translate(0px, 0px)",
                transition: "opacity 0.15s ease",
                willChange: "transform, opacity",
              }}
            >
              {sideProjects.map((project) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    if (el) imgEls.current.set(project.id, el);
                    else imgEls.current.delete(project.id);
                  }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    visibility: "hidden",
                  }}
                >
                  {getPlaygroundVideo(project.id) ? (
                    <video
                      ref={(el) => {
                        if (el)
                          videoEls.current.set(project.id, el);
                        else
                          videoEls.current.delete(project.id);
                      }}
                      src={getPlaygroundVideo(project.id)}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageWithFallback
                      src={getPlaygroundPreview(project.id)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  )}
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {sideProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group cursor-pointer block border-b border-foreground/10 first:border-t first:border-foreground/10"
                onMouseEnter={() => onRowMouseEnter(project.id)}
              >
                <div className="flex items-center justify-between py-5 px-3 transition-colors duration-300 bg-transparent hover:bg-foreground hover:text-background backdrop-blur-sm">
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 group-hover:text-background/50 transition-colors w-6">
                      0{index + 1}
                    </span>
                    <h4 className="text-sm md:text-base font-bold uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                      {project.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40 group-hover:text-background/60 transition-colors hidden sm:inline">
                      {project.category}
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Playground — each card written separately */}
          <div className="md:hidden grid grid-cols-2 gap-4 pl-2 bg-transparent">
            {/* Mobile Playground — Project 6 */}
            <Link
              to="/project/6"
              className="group cursor-pointer block"
            >
              <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-3 border border-foreground/10">
                <ImageWithFallback
                  src={getThumbnail(6)}
                  alt="Glyph Studies"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {sideProjects[0].title}
              </h4>
              <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                {sideProjects[0].category}
              </span>
            </Link>

            {/* Mobile Playground — Project 7 */}
            <Link
              to="/project/7"
              className="group cursor-pointer block"
            >
              <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-3 border border-foreground/10">
                <ImageWithFallback
                  src={getThumbnail(7)}
                  alt="Flora Generative"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {sideProjects[1].title}
              </h4>
              <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                {sideProjects[1].category}
              </span>
            </Link>

            {/* Mobile Playground — Project 8 */}
            <Link
              to="/project/8"
              className="group cursor-pointer block"
            >
              <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-3 border border-foreground/10">
                <ImageWithFallback
                  src={getThumbnail(8)}
                  alt="Echo Chamber"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {sideProjects[2].title}
              </h4>
              <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                {sideProjects[2].category}
              </span>
            </Link>

            {/* Mobile Playground — Project 9 */}
            <Link
              to="/project/9"
              className="group cursor-pointer block"
            >
              <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-3 border border-foreground/10">
                <ImageWithFallback
                  src={getThumbnail(9)}
                  alt="Raw Material"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {sideProjects[3].title}
              </h4>
              <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                {sideProjects[3].category}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}