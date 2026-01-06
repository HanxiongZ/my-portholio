import React, { useEffect } from "react";
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
} from "react-router-dom";
import { allProjects, mainProjects } from "./Projects";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { InteractionSpectrum } from "./InteractionSpectrum"; // 按你的实际路径

export function ProjectDetail() {
  const { id } = useParams();
  const projectId = Number(id);
  const project = allProjects.find((p) => p.id === projectId);

  const navigate = useNavigate();
  const location = useLocation();

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

  const [showScrollTop, setShowScrollTop] =
    React.useState(false);

  const [activeSectionId, setActiveSectionId] =
    React.useState<string>("");

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
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
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
            <div
              key={i}
              className="h-full border-l border-foreground/5 relative first:border-l-0 md:first:border-l"
            ></div>
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
          {/* LEFT COLUMN: META & TOC - DESIGNED */}
          <div className="col-span-1 md:col-span-3 mb-16 md:mb-0 backdrop-blur-sm flex flex-col">
            <div className="flex flex-col gap-10 flex-1 relative">
              {/* Brief */}
              <div className="border-t border-foreground/10 pt-3">
                <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                  Description
                </span>

                <p className="text-sm leading-relaxed text-foreground/80 font-normal text-pretty">
                  {project.content}
                </p>
              </div>

              {/* Scope */}
              <div className="border-t border-foreground/10 pt-3">
                <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-3 tracking-widest">
                  Scope
                </span>
                <ul className="space-y-2">
                  {project.tags.map((tag, i) => (
                    <li
                      key={i}
                      className="text-xs font-bold uppercase tracking-wide text-foreground/70 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-foreground/30 rounded-full"></span>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigator */}
              {project.toc && project.toc.length > 0 && (
                <div className="border-t border-foreground/10 pt-3 sticky top-32">
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
            {/* Hero Image */}
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
              <ImageWithFallback
                src={project.gallery?.[5] || project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* NARRATIVE SECTION - Enhanced Graphic Design Layout */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12 mb-8 md:mb-10">
              {/* 01 Divider & Header */}
              <div
                id={slugify("Background and Focus")}
                className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
              >
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                  01 — Background and Focus
                </span>
              </div>

              {/* Lead Text */}
              <div className="col-span-1 md:col-span-5">
                <p className="text-xl md:text-2xl leading-relaxed font-light text-foreground/90 text-pretty">
                  <span className="text-foreground/40 font-serif italic pr-2">
                    "
                  </span>
                  Haptics is to touch, as optics is to sight.
                  <span className="text-foreground/40 font-serif italic pr-2">
                    "
                  </span>
                </p>
              </div>

              {/* Pull Quote */}
              <div className="col-span-1 md:col-span-3 md:pl-6 border-l border-foreground/10 hidden md:block">
                <p className="text-xs font-mono uppercase leading-relaxed text-foreground/60">
                  Will Provancher
                </p>
              </div>

              {/* Body Text */}
              <div className="col-span-1 md:col-span-5 md:col-start-1">
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                  This project was conducted during my
                  internship at Volvo Cars, where in-car
                  experiences are shaped across multiple
                  modalities parallelly. Within this context,
                  physical controls play a critical role in
                  mediating people's intention and complex
                  system behaviours. Particularly as controls in
                  car rely more on screens and less on physical
                  buttons under the EV era.
                </p>
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                  Within a larger visionary project, my focus
                  was on exploring how tactile layers could be
                  embedded in physical controls. The aim was to
                  design a coherent and intuitive language that
                  communicate with users in a tangible way.
                </p>
              </div>

              {/* 02 Divider & Header (放回 grid 里) */}
              <div
                id={slugify("Frame the Exploration")}
                className="col-span-1 md:col-span-8  pt-6 mb-4 scroll-mt-32"
              >
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                  02 — Frame the Exploration
                </span>
              </div>

              {/* Body Text */}
              <div className="col-span-1 md:col-span-5 md:col-start-1">
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                  At the outset of the project, several
                  hypotheses framed the exploration. It started
                  from the assumption that haptic feedback could
                  carry{" "}
                  <strong className="font-semibold text-foreground">
                    different kinds of information through
                    distinct patterns
                  </strong>
                  , making physical controls more versatile and
                  expressive. If perceived clearly, it was
                  further assumed that haptics could contribute
                  to{" "}
                  <strong className="font-semibold text-foreground">
                    a sense of reassurance
                  </strong>
                  , helping drivers feel confident and safe
                  while interacting with controls. Finally, the
                  exploration asked whether well-designed haptic
                  feedback could also enrich the driving
                  experience, adding{" "}
                  <strong className="font-semibold text-foreground">
                    moments of delight
                  </strong>{" "}
                  without distracting from the task of driving.
                </p>

                <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                  To explore these hypotheses, the work began
                  with the simplest interaction unit: a single
                  button.
                </p>
              </div>
            </div>

            <div className="w-full mb-4">
              <InteractionSpectrum />
            </div>

            {/* NARRATIVE SECTION - Enhanced Graphic Design Layout */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12 mb-8 md:mb-10">
              {/* Body Text */}
              <div className="col-span-1 md:col-span-5 md:col-start-1">
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                  This specturm frames the interaction quality
                  of a button, from digital to physical.(Feel
                  free the click the buttons above)
                </p>
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                  On one end, digital buttons that rely
                  primarily on visual feedback; on the
                  other,analog controls communicate through
                  mechanical form and resistance. Haptic
                  feedback as an intermediate tactile layer
                  within the spectrum seems like a good way of
                  starting the exploration.
                </p>
              </div>
            </div>

            {/* NARRATIVE SECTION - Enhanced Graphic Design Layout */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12 mb-8 md:mb-10">
              {/* 01 Divider & Header */}
              <div
                id={slugify("Learning through prototyping")}
                className="col-span-1 md:col-span-8 pt-6 mb-4 scroll-mt-32"
              >
                <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                  03 — Learning by Prototyping
                </span>
              </div>

              {/* Body Text */}
              <div className="col-span-1 md:col-span-5 md:col-start-1">
                <h3 className="text-xs md:text-sm font-semibold md:uppercase tracking-normal md:tracking-wide text-foreground whitespace-nowrap mt-[0px] mr-[0px] mb-[24px] ml-[0px]">
                  First Prototype – Bring in haptics only
                </h3>

                <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                  The exploration started with a deliberately
                  restrained prototype. Rather than introducing
                  haptics aggressively, a vibration module and a
                  pressure sensor were added to an otherwise
                  simple button setup. This approach treated
                  haptics as an added layer—supporting
                  interaction rather than redefining it—allowing
                  early insights into how haptic button could
                  influence perceived feedback, confidence, and
                  interaction quality.
                </p>
              </div>

              {/* Media group: Expanded to full 8-col width */}
              <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-8 gap-6 mb-8 items-stretch">
                {/* LEFT: big image (Span 5) */}
                <div className="col-span-1 md:col-span-5 flex flex-col h-full">
                  <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden relative w-full flex-1 min-h-[200px] md:min-h-0">
                    <ImageWithFallback
                      src={
                        project.gallery?.[0] || project.image
                      }
                      alt="Prototype 01 main setup"
                      className="absolute inset-0 w-full h-full object-cover block"
                    />
                  </div>
                  <p className="text-xs font-mono text-foreground/60 mt-3 shrink-0">
                    Figure 01 — Mimic the button feeling by
                    putting a pressure sensor underneath an
                    iPhone 14.
                  </p>
                </div>

                {/* RIGHT: two stacked images (Span 3) */}
                {/* 修改 1: gap-8 -> gap-4，减少上下两张图的间距，节省高度 */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-4 h-full">
                  <div>
                    {/* 修改 2: aspect-[3/2] -> aspect-[16/9] 
         (数字越大越扁。如果你觉得还不够矮，可以改成 aspect-[2/1]) 
      */}
                    <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
                      <ImageWithFallback
                        src={
                          project.gallery?.[1] || project.image
                        }
                        alt="Prototype 01 detail view"
                        className="w-full h-full object-cover block"
                      />
                    </div>
                    <p className="text-xs font-mono text-foreground/60 mt-3">
                      Figure 02 — Tactile surface is needed for
                      button feeling.
                    </p>
                  </div>

                  <div>
                    {/* 同样的修改: aspect-[16/9] */}
                    <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
                      <ImageWithFallback
                        src={
                          project.gallery?.[2] || project.image
                        }
                        alt="Prototype 01 interaction test"
                        className="w-full h-full object-cover block"
                      />
                    </div>
                    <p className="text-xs font-mono text-foreground/60 mt-3">
                      Figure 03 — Add damping structure to
                      enhance intensity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-5 md:col-start-1">
                {/* Text stays as-is */}
                <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
                  The first round of prototyping showed that a
                  haptic button could work(barely). While
                  vibration improved confirmation,{" "}
                  <strong className="font-semibold text-foreground">
                    the absence of tactile surface limited
                    reassurance and influence how people
                    interact with the button
                  </strong>
                  . So I printed out button surfaces in
                  different shape and depth, then chose the one
                  that looks the most like a button without any
                  design expression. So that the first
                  experienced prototype that ready for testing
                  was ready, as figure 03.
                </p>
              </div>
            </div>

            {/* Full Width Image with Caption */}
            {/* <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-8 gap-6">
                <div className="col-span-1 md:col-span-2 text-xs font-mono uppercase text-foreground/40 border-t border-foreground/10 pt-2">
                  Figure 03
                </div>
                <div className="col-span-1 md:col-span-6 text-xs font-mono uppercase text-foreground/40 border-t border-foreground/10 pt-2 text-right md:text-left">
                  Final Composition
                </div>
              </div>
            </div> */}
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
                  ${
                    p.id === projectId
                      ? "opacity-40 cursor-default pointer-events-none grayscale"
                      : "hover:bg-foreground hover:text-background"
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
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="fixed bottom-8 right-8 z-50 p-4 bg-background border border-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors backdrop-blur-sm"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}