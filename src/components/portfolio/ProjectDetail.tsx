import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import {
  useParams,
  Link,
  useNavigate,
  useLocation,
} from "react-router";
import { allProjects, mainProjects } from "./Projects";
import { sideProjects } from "./Projects";

// Lazy load project content components to reduce initial bundle size
const Project1_VolvoThesis = React.lazy(() =>
  import("./content/Project1_VolvoThesis").then((module) => ({
    default: module.Project1_VolvoThesis,
  })),
);
const Project2_VolvoInternship = React.lazy(() =>
  import("./content/Project2_VolvoInternship").then(
    (module) => ({
      default: module.Project2_VolvoInternship,
    }),
  ),
);
const Project3_DigitalEntropy = React.lazy(() =>
  import("./content/Project3_DigitalEntropy").then(
    (module) => ({
      default: module.Project3_DigitalEntropy,
    }),
  ),
);
const Project4_Chronos = React.lazy(() =>
  import("./content/Project4_Chronos").then((module) => ({
    default: module.Project4_Chronos,
  })),
);
const Project5_SilentForm = React.lazy(() =>
  import("./content/Project5_SilentForm").then((module) => ({
    default: module.Project5_SilentForm,
  })),
);
const Project6_GlyphStudies = React.lazy(() =>
  import("./content/Project6_GlyphStudies").then((module) => ({
    default: module.Project6_GlyphStudies,
  })),
);
const Project7_FloraGenerative = React.lazy(() =>
  import("./content/Project7_FloraGenerative").then(
    (module) => ({
      default: module.Project7_FloraGenerative,
    }),
  ),
);
const Project8_EchoChamber = React.lazy(() =>
  import("./content/Project8_EchoChamber").then((module) => ({
    default: module.Project8_EchoChamber,
  })),
);
const Project9_RawMaterial = React.lazy(() =>
  import("./content/Project9_RawMaterial").then((module) => ({
    default: module.Project9_RawMaterial,
  })),
);

const ProjectComponents: Record<
  number,
  React.LazyExoticComponent<any>
> = {
  1: Project1_VolvoThesis,
  2: Project2_VolvoInternship,
  3: Project3_DigitalEntropy,
  4: Project4_Chronos,
  5: Project5_SilentForm,
  6: Project6_GlyphStudies,
  7: Project7_FloraGenerative,
  8: Project8_EchoChamber,
  9: Project9_RawMaterial,
};

export function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Extract project ID from params or from the URL path directly (for explicit routes)
  const projectId = id
    ? Number(id)
    : Number(location.pathname.split("/").pop());
  const project = allProjects.find((p) => p.id === projectId);

  const navigate = useNavigate();

  // --- helpers: TOC slug + scroll ---
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll to top on mount or project change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const btnSize = 40;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { state: { scrollToProjects: true } });
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Project not found
      </div>
    );
  }

  // Projects marked as Work In Progress — remove ID when ready to publish
  const WIP_PROJECT_IDS = [1];
  const isWIP = WIP_PROJECT_IDS.includes(project.id);


  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen pt-32 pb-12 md:pt-40 md:pb-0"
    >
      {/* BACKGROUND GRID — full-height lines: 1, 3, 4 */}
      <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none z-0">
        <div className="container mx-auto px-6 md:px-12 h-full">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-full ${[0, 2, 3].includes(i) ? "border-l border-foreground/5" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BACKGROUND GRID — viewport-height lines: all others */}
      <div className="absolute left-0 right-0 top-0 h-screen pointer-events-none z-0">
        <div className="container mx-auto px-6 md:px-12 h-full">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-full ${![0, 2, 3].includes(i) ? "border-l border-foreground/5" : ""}`}
              />
            ))}
            <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-foreground/5" />
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-foreground/5" />
          </div>
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
              Back to Home
            </button>
          </div>
        </div>

        {/* --- HERO HEADER --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-12 md:mb-24 items-end">
          <div className="col-span-1 md:col-span-10 md:col-start-1 backdrop-blur-sm">
            <span className="inline-block text-xs font-mono uppercase text-foreground/50 mb-4 md:mb-6 tracking-widest">
              {project.category} — {project.year}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium uppercase tracking-tighter leading-[0.85] mb-6">
              {project.title}
            </h1>
            <p className="text-lg md:text-2xl font-light text-foreground/70 mb-8 max-w-3xl leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block text-[10px] md:text-xs font-mono text-foreground/60 uppercase border border-foreground/20 px-2 py-1 rounded-sm bg-background/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-0">
          {/* LEFT COLUMN: META & TOC - STICKY */}
          <div className="col-span-1 md:col-span-2 mb-16 md:mb-0 md:sticky md:top-32 md:self-start h-fit">
            <div className="backdrop-blur-sm flex flex-col gap-10 p-[0px] m-[0px]">
              {/* Brief */}
              <div className="border-t border-foreground/10 pt-3">
                <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                  Description
                </span>
                <p className="leading-relaxed text-foreground/80 font-normal text-pretty text-[12px] text-left whitespace-pre-line">
                  {project.content}
                </p>
              </div>

              {/* Status badge — only when WIP */}
              {isWIP && (
                <div className="border-t border-foreground/10 pt-3">
                  <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                    Status
                  </span>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/50">
                      In Progress
                    </span>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/25 pl-3.5">
                    Spring 2026
                  </p>
                </div>
              )}

              {/* Navigator — only when NOT WIP */}
              {!isWIP &&
                project.toc &&
                project.toc.length > 0 && (
                  <div className="border-t border-foreground/10 pt-3 sticky top-32 max-h-[80vh] overflow-y-auto">
                    <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                      Jump To
                    </span>

                    <ul className="space-y-0">
                      {project.toc.map((item) => {
                        const targetId = slugify(item);

                        return (
                          <li
                            key={targetId}
                            className="border-b border-foreground/5 last:border-0"
                          >
                            <motion.button
                              type="button"
                              onClick={() =>
                                scrollToSection(targetId)
                              }
                              whileTap={{ scale: 0.98 }}
                              className="w-full group cursor-pointer flex items-center justify-between py-2 px-2 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:bg-foreground hover:text-background hover:border-transparent transition-colors text-left"
                            >
                              <span>{item}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all group-hover:text-background" />
                            </motion.button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: VISUALS & NARRATIVE */}
          <div className="col-span-1 md:col-span-8 md:col-start-5 space-y-16 md:space-y-32 backdrop-blur-sm mb-32 md:mb-48">
            <Suspense
              fallback={
                <div className="w-full h-96 flex items-center justify-center text-foreground/40 text-sm font-mono uppercase tracking-widest">
                  Loading content...
                </div>
              }
            >
              {ProjectComponents[project.id] ? (
                React.createElement(
                  ProjectComponents[project.id],
                  {
                    project,
                    slugify,
                  },
                )
              ) : (
                <div className="text-foreground/50">
                  Content coming soon.
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* --- FOOTER: HORIZONTAL SCROLL NAVIGATOR --- */}
      <div className="border-t border-foreground/10 bg-background/50 backdrop-blur-md py-12 md:py-16 overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-12">
          {/* Section labels */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
              All Projects
            </span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          {/* Scrollable strip */}
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-4 min-w-max pb-2">
              {/* Main Projects */}
              {mainProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className={`
                    group flex flex-col justify-between w-48 md:w-56 h-32 md:h-40 p-5 shrink-0 transition-all duration-300 border
                    ${
                      p.id === projectId
                        ? "border-foreground bg-foreground text-background cursor-default"
                        : "border-foreground/10 hover:bg-foreground hover:text-background hover:border-transparent"
                    }
                  `}
                  onClick={
                    p.id === projectId
                      ? (e) => e.preventDefault()
                      : undefined
                  }
                >
                  <div className="flex justify-between items-start w-full">
                    <span
                      className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                        p.id === projectId
                          ? "text-background/60"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    >
                      0{p.id}
                    </span>
                    {p.id === projectId ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-background/50">
                        Current
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  <div>
                    <span
                      className={`block text-xs font-mono uppercase mb-2 tracking-wider transition-colors ${
                        p.id === projectId
                          ? "text-background/50"
                          : "opacity-50 group-hover:opacity-80"
                      }`}
                    >
                      {p.category}
                    </span>
                    <h4 className="text-base font-bold uppercase leading-tight tracking-wide">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}

              {/* Divider */}
              <div className="shrink-0 flex flex-col items-center justify-center px-2">
                <div className="w-px h-full bg-foreground/10" />
              </div>

              {/* Playground Projects */}
              {sideProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className={`
                    group flex flex-col justify-between w-48 md:w-56 h-32 md:h-40 p-5 shrink-0 transition-all duration-300 border
                    ${
                      p.id === projectId
                        ? "border-foreground bg-foreground text-background cursor-default"
                        : "border-foreground/10 hover:bg-foreground hover:text-background hover:border-transparent"
                    }
                  `}
                  onClick={
                    p.id === projectId
                      ? (e) => e.preventDefault()
                      : undefined
                  }
                >
                  <div className="flex justify-between items-start w-full">
                    <span
                      className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                        p.id === projectId
                          ? "text-background/60"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    >
                      0{p.id}
                    </span>
                    {p.id === projectId ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-background/50">
                        Current
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  <div>
                    <span
                      className={`block text-xs font-mono uppercase mb-2 tracking-wider transition-colors ${
                        p.id === projectId
                          ? "text-background/50"
                          : "opacity-50 group-hover:opacity-80"
                      }`}
                    >
                      {p.category}
                    </span>
                    <h4 className="text-base font-bold uppercase leading-tight tracking-wide">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}

              {/* Divider */}
              <div className="shrink-0 flex flex-col items-center justify-center px-2">
                <div className="w-px h-full bg-foreground/10" />
              </div>

              {/* Index Link */}
              <button
                onClick={handleBack}
                className="shrink-0 group flex flex-col justify-between w-48 md:w-56 h-32 md:h-40 p-5 border border-foreground/10 hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 text-left"
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
      </div>

      {/* --- BACK TO TOP --- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 flex items-center justify-center bg-background border border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors backdrop-blur-sm"
            style={{ width: btnSize, height: btnSize }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}