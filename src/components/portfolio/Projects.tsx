import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { PortfolioArrow } from "./PortfolioArrow";
import { PortfolioTag } from "./PortfolioTag";
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
    title: "From Novelty to Normality",
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
      "Designing haptics to extend the possibilities of physical controls at Volvo Cars",
    content:
      "This project came from my exploration and design work around haptics during my internship at Volvo Cars.Investigated how tactile feedback can extend interaction layers on physical controls.",
    toc: [
      "Background",
      "Frame the Exploration",
      "Learning through prototyping",
      "Better fidelity",
      "special thanks",
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
    title: "Inside the Machine",
    category: "Design for Service",
    year: "2024",
    image: getThumbnail(4),
    description:
      "Reframing the sick leave experience with Försäkringskassan to make government bureaucracy transparent, inclusive, and empathetic.",
    content:
      "Navigating government bureaucracy shouldn't feel like fighting a cold machine. Inside the Machine tackles the systemic distrust and frustration citizens face during sick leave applications in Sweden. Through in-depth user research and co-creation workshops, we designed a solution that demystifies the bureaucracy. By making hidden processes visible and giving citizens clear control over their data and rights, we aim to rebuild trust and reframe the relationship between citizens and the government.\n\n\nTeam up with: Ece Günesen, Xingyu Liu",
    toc: ["Collaborator", "Ethnography", "Involve People", "Design", "Takeaways"],
    tags: ["Strategic Design", "Participatory Design","UX/UI"],
  },
  {
    id: 5,
    title: "ColorOS",
    category: "UX Design · OPPO",
    year: "2023",
    image: getThumbnail(5),
    description:
      "Shaping everyday multimedia experiences for ColorOS",
    content:
      "Originally designed during my time as an UX Designer at OPPO, this feature enables users to adjust the spatial placement of audio. In 2026, I revisited the experience through vibe coding, exploring a more intuitive interaction model—one that feels natural, reduces frustration, and brings a greater sense of clarity and control to the listening experience.",
    toc: ["Prototype", "Spatial Interface", "Redesigned Interaction"],
    tags: ["Spatial Interaction", "UX/UI","vibe coding"],
  },
];

export const sideProjects: Project[] = [
  {
    id: 6,
    title: "Obfuscation",
    category: "Type Design",
    year: "2024",
    image: getThumbnail(6),
    description: "Experimental typography.",
    content:
      "A daily practice of creating new letterforms based on strict geometric constraints.",
    toc: ["Overview", "Details"],
    tags: [],
  },
  // { id: 7, title: "Flora Generative", … hidden },
  // { id: 8, title: "Echo Chamber", … hidden },
  {
    id: 9,
    title: "Shape Perspectives",
    category: "Poster",
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
      className="portfolio-projects-section relative w-full overflow-hidden scroll-mt-12"
    >
      <div
        id="selected works"
        className="container mx-auto px-6 md:px-12 relative z-10"
      >
        {/* --- HEADER --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-16">
          <div className="col-span-2 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
            <span className="type-section-label inline-block font-mono uppercase text-foreground/40 mb-3">
              Selected Works
            </span>
            <div className="h-px bg-foreground/10 w-full mt-2" />
          </div>
        </div>

        {/* --- PROJECT LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 items-start mb-24 min-h-[500px]">
          {/* LEFT: LIST (Interactive - Inverted Hover) */}
          <div className="hidden md:flex col-span-1 md:col-span-4 flex-col pt-2 relative z-20 pl-2 md:pl-3 backdrop-blur-sm">
            {mainProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                onMouseEnter={() => setActiveId(project.id)}
                className={`project-list-button ${activeId === project.id ? "is-active" : ""}`}
              >
                <div className="flex flex-col gap-1.5">
                  <span className="project-list-button__number">0{project.id}</span>
                  <h3 className="project-list-button__title">{project.title}</h3>
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
                        alt="From Novelty to Normality"
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
                        alt="Holo Audio"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    )}
                  </div>

                  {/* Details - Grid Aligned */}
                  <div className="grid grid-cols-[64fr_36fr] gap-x-6 pt-6 border-t border-foreground/10">
                    <div className="col-span-1">
                      <span className="type-eyebrow block font-mono uppercase text-foreground/40 mb-3">
                        Context
                      </span>
                      <p className="type-body-sm text-left hyphens-auto text-foreground/80 mb-6 text-pretty">
                        {activeProject.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tags.map((tag, i) => (
                          <PortfolioTag key={i}>
                            {tag}
                          </PortfolioTag>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-1 flex flex-col items-end justify-between">
                      <div className="text-right mb-8">
                        <span className="type-meta-label block font-mono uppercase text-foreground/40 mb-2">
                          Year
                        </span>
                        <span className="type-meta-value uppercase">
                          {activeProject.year}
                        </span>
                      </div>

                      <Link
                        to={`/project/${activeProject.id}`}
                        className="portfolio-button portfolio-button--up"
                      >
                        View Case{" "}
                        <PortfolioArrow direction="up" />
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
                  <h3 className="text-lg font-bold tracking-wide">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono uppercase text-foreground/40 tracking-widest">
                    {project.year}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-6 leading-relaxed font-light">
                  {project.description}
                </p>
                <span className="portfolio-button portfolio-button--up">
                  View Case <PortfolioArrow direction="up" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* --- SIDE PROJECTS (Shorter) --- */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-12">
            <div className="col-span-2 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
              <span className="type-section-label inline-block font-mono uppercase text-foreground/40 mb-3">
                Playground
              </span>
              <div className="h-px bg-foreground/10 w-full mt-2" />
            </div>
          </div>

          {/* Desktop: Minimal title list with hover image reveal */}
          <div
            className="hidden md:block"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
              <div
                className="relative col-span-1 md:col-span-8 md:col-start-5 pl-2 md:pl-3"
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
                className="group playground-link portfolio-button portfolio-button--up portfolio-button--wide"
                onMouseEnter={() => onRowMouseEnter(project.id)}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <span className="portfolio-button__index type-list-index">
                      0{index + 1}
                    </span>
                    <h4 className="type-list-title">
                      {project.title}
                    </h4>
                  </div>
                  <div className="flex items-center">
                    <span className="portfolio-button__meta type-list-meta hidden sm:inline">
                      {project.category}
                    </span>
                    <PortfolioArrow direction="up" />
                  </div>
                </div>
              </Link>
            ))}
              </div>
            </div>
          </div>

          {/* Mobile Playground */}
          <div className="md:hidden grid grid-cols-2 gap-4 pl-2 bg-transparent">
            {sideProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[3/2] relative overflow-hidden bg-foreground/5 mb-3 border border-foreground/10">
                  <ImageWithFallback
                    src={getThumbnail(project.id)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <h4 className="text-xs font-bold tracking-wider">
                  {project.title}
                </h4>
                <span className="text-[10px] font-mono text-foreground/40 tracking-wide">
                  {project.category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
