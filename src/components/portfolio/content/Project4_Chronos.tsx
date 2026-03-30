import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";
import fkLogo from "../../../assets/fk-logo-primary.svg";
import ethno1 from "../../../assets/fig_ethnography_1.jpg";
import ethno2 from "../../../assets/fig_ethnography_2.jpg";
import ethno3 from "../../../assets/fig_ethnography_3.jpg";
import ecomap from "../../../assets/inside_ecomap.png";
import ecomapOverlap from "../../../assets/inside_ecomap_overlap.png";
import workshopPhoto from "../../../assets/inside_workshop.jpg";
import workshopMockup from "../../../assets/inside_workshop_mockup.png";
import insideConcept from "../../../assets/inside_concept.png";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

const METHODS = [
  {
    title: "Guerrilla Research",
    desc: "We went to PMU (the secondhand shop), aiming to get an overall impression about FK. One of the people expressed distrust and feeling frustrated.",
  },
  {
    title: "Snowball Sampling",
    desc: "This method allowed us to reach many people who are typically difficult to contact, who have quite unique experience interacting with FK.",
  },
  {
    title: "Netnography",
    desc: "We learnt that FK use AI to look at people's health files. Also found there're people having an opinion about FK.",
  },
];

const SLIDES = [ethno1, ethno2, ethno3];

function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const prev = useCallback(() => setI((n) => (n - 1 + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setI((n) => (n + 1) % SLIDES.length), []);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative overflow-hidden border border-foreground/10 bg-foreground/5" style={{ aspectRatio: "3/2" }}>
        <img src={SLIDES[i]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <button onClick={prev} aria-label="prev"
          className="absolute left-0 inset-y-0 w-10 flex items-center justify-center opacity-0 hover:opacity-100 bg-background/60 hover:bg-foreground hover:text-background transition-opacity">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={next} aria-label="next"
          className="absolute right-0 inset-y-0 w-10 flex items-center justify-center opacity-0 hover:opacity-100 bg-background/60 hover:bg-foreground hover:text-background transition-opacity">
          <ArrowRight className="w-4 h-4" />
        </button>
        <span className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground/50 bg-background/70 px-2 py-0.5">
          {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
      {/* Clickable index tabs */}
      <div className="flex mt-3 border border-foreground/10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors border-r border-foreground/10 last:border-r-0"
            style={{
              background: idx === i ? "var(--foreground)" : "transparent",
              color: idx === i ? "var(--background)" : "var(--foreground)",
              opacity: idx === i ? 1 : 0.4,
            }}
          >
            0{idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Frame: 1380 × 582. Video slot: left:63 top:191 w:1254.678 h:273
function BrowserChrome({ mockupSrc, videoSrc }: { mockupSrc: string; videoSrc: string }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1380/582" }}>
      {/* Browser chrome image */}
      <img
        src={mockupSrc}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {/* Video overlay — exact Figma position */}
      <div style={{
        position: "absolute",
        left:   `${(63       / 1380) * 100}%`,
        top:    `${(191      / 582)  * 100}%`,
        width:  `${(1254.678 / 1380) * 100}%`,
        height: `${(273      / 582)  * 100}%`,
        overflow: "hidden",
      }}>
        <video
          src={videoSrc}
          autoPlay loop muted playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </div>
  );
}

function EcomapReveal() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const imgCenter = rect.top + rect.height / 2;
      // Start when image center hits viewport center, finish 200px later
      const start = windowH * 0.5;
      const end = windowH * 0.5 - 200;
      const p = Math.min(1, Math.max(0, (start - imgCenter) / (start - end)));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div ref={imgRef} className="relative w-full overflow-hidden border border-foreground/10 mb-10" style={{ aspectRatio: "16/9" }}>
        <img src={ecomap} alt="Ecosystem map" className="absolute inset-0 w-full h-full object-cover" />
        <img
          src={ecomapOverlap}
          alt="Ecosystem map overlay"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: progress }}
        />
      </div>
      <h3 className="text-base font-bold mb-4" style={{ letterSpacing: "-0.01em" }}>
        A complex ecosystem
      </h3>
      <p className="text-base font-light leading-relaxed text-foreground/70 max-w-2xl">
        There are a lot of stakeholders, touchpoints and relations. In order to tease out, we tried to view the issues from a different angle:{" "}
        <strong className="font-semibold text-foreground/90">Which part of your life connected with the system.</strong>
      </p>
    </div>
  );
}

const INTERFACES = [
  {
    label: "01",
    title: "Onboarding",
    caption: "A desktop interface that outlines the case journey and connects citizens with support.",
    video: "", // add video URL when ready
  },
  {
    label: "02",
    title: "Ongoing Cases",
    caption: "The application process mapped like a metro line — showing where you are and all possible routes ahead.",
    video: "",
  },
  {
    label: "03",
    title: "Consent Center",
    caption: "See exactly what private information you've shared, with whom, and why.",
    video: "",
  },
];

function InterfaceShowcase() {
  return (
    <div className="mb-16 md:mb-24">
      {/* Section label + intro */}
      <div className="border-t border-foreground/10 pt-6 mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">05 — Interface</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-light leading-snug text-foreground/80 max-w-xl mb-24" style={{ letterSpacing: "-0.02em" }}>
        Reframe the citizen-government relationship
      </h2>

      {/* Interface screens */}
      <div className="flex flex-col" style={{ gap: "8rem" }}>
        {INTERFACES.map((item) => (
          <div key={item.label}>
            {/* Header row */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-xs font-mono text-foreground/30">{item.label}</span>
              <h3 className="text-base font-semibold" style={{ letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p className="text-sm font-light text-foreground/50 ml-2">{item.caption}</p>
            </div>
            {/* Video / placeholder */}
            <div
              className="w-full overflow-hidden bg-foreground/5 border border-foreground/10"
              style={{ aspectRatio: "16/10", borderRadius: 12 }}
            >
              {item.video ? (
                <video
                  src={item.video}
                  autoPlay loop muted playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DESIGN_TAGS = ["Process Transparency", "Services", "Interfaces", "Algorithms"];

function DesignConcepts() {
  return (
    <div className="mb-16 md:mb-24">
      {/* Section label */}
      <div className="border-t border-foreground/10 pt-6 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">04 — Design</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {DESIGN_TAGS.map((tag, i) => (
          <span
            key={tag}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid",
              borderColor: i === 0 ? "transparent" : "currentColor",
              background: i === 0 ? "#EF704F" : "transparent",
              color: i === 0 ? "#fff" : "var(--foreground)",
              fontSize: 13,
              opacity: i === 0 ? 1 : 0.45,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content: image left, text right */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "start" }}>
        {/* Concept image */}
        <div className="w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <img src={insideConcept} alt="Next Station concept" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-bold mb-4" style={{ letterSpacing: "-0.01em" }}>
            Next Station
          </h3>
          <p className="text-base font-light leading-relaxed text-foreground/70">
            Like navigating a metro system, the sick leave journey is rarely linear. Currently, the government holds the "map" to the process, while citizens are left <strong className="font-semibold text-foreground/90">walking in the dark</strong>, reacting only to unexpected hurdles. By adopting a <strong className="font-semibold text-foreground/90">metro map metaphor</strong>, we illuminate the entire process—clarifying the actions needed to go from point A to B and revealing all possible routes for every individual.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Project4_Chronos({ project, slugify }: Props) {
  const remainingSections = project.toc?.filter(
    (s) => s !== "Ethnography" && s !== "Collaborator"
  ) ?? [];

  return (
    <>
      {/* Hero */}
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback src={getContentImage(4, "hero")} alt={project.title} className="w-full h-full object-cover" />
      </div>

      {/* 01 — Collaborator */}
      <div id={slugify("Collaborator")} className="mb-12 md:mb-24 scroll-mt-32">
        <div className="border-t border-foreground/10 pt-6 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">01 — Collaborator</span>
        </div>
        <div className="mb-12">
          <img src={fkLogo} alt="Försäkringskassan" className="h-7 w-auto" />
        </div>
        <div className="flex flex-col gap-8">
          <p className="text-2xl md:text-3xl font-light leading-snug text-foreground/80 max-w-xl">
            Sweden has a social insurance system to provide financial security during different stages of life. It includes social insurance benefits for families with children, people with a disability or illness and the elderly.
          </p>
          <p className="text-2xl md:text-3xl font-light leading-snug text-foreground/80 max-w-xl">
            Försäkringskassan is a government agency that administers the social insurance system in Sweden. They determine who is eligible and the amount in order to issue social insurance payments.
          </p>
        </div>
      </div>

      {/* 02 — Reach People */}
      <div className="mb-16 md:mb-24">
        <div id={slugify("Ethnography")} className="border-t border-foreground/10 pt-6 mb-8 scroll-mt-32">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">02 — Reach People</span>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden flex flex-col gap-10">
          {METHODS.map((m) => (
            <div key={m.title}>
              <h3 className="text-base font-bold mb-2" style={{ letterSpacing: "-0.01em" }}>{m.title}</h3>
              <p className="text-base leading-relaxed font-light text-foreground/70">{m.desc}</p>
            </div>
          ))}
          <Carousel />
        </div>

        {/* Desktop: side by side */}
        <div className="hidden md:block">
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "3rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {METHODS.map((m) => (
                <div key={m.title}>
                  <h3 className="text-base font-bold mb-2" style={{ letterSpacing: "-0.01em" }}>{m.title}</h3>
                  <p className="text-base leading-relaxed font-light text-foreground/70">{m.desc}</p>
                </div>
              ))}
            </div>
            <Carousel />
          </div>
        </div>
      </div>

      {/* Three stories */}
      <div className="mb-16 md:mb-24">
        {/* Intro */}
        <div className="mb-8">
          <h3 className="text-base font-bold mb-4" style={{ letterSpacing: "-0.01em" }}>
            Three stories from people's life
          </h3>
          <p className="text-base font-light leading-relaxed text-foreground/70 max-w-2xl">
            Among the 36 people we contacted, we managed{" "}
            <span className="font-semibold text-foreground/90">5 deeper interviews</span>.
            {" "}Three of these individuals had particularly unique experiences, highlighting their situations from each of their perspectives.
          </p>
        </div>

        {/* Quotes */}
        <div className="flex flex-col gap-10 mt-12">
          {[
            {
              name: "Sigge",
              color: "#7A9B7A",
              quote: "I thought, they didn't even want to give me sick leave, how can I apply for sick pension?",
            },
            {
              name: "Ann",
              color: "#C47B65",
              quote: "It is important to be well-educated (...) otherwise, there is no chance of fighting against FK.",
            },
            {
              name: "Phd\nStudent",
              color: "#8B7DAF",
              quote: "It's a lot easier I saw for Swedish people to apply.",
            },
          ].map(({ name, color, quote }) => (
            <div key={name} className="flex items-center gap-8 md:gap-12">
              {/* Avatar */}
              <div
                className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                style={{ background: color }}
              >
                <span className="text-[11px] font-light text-white/90 text-center leading-tight whitespace-pre-line">
                  {name}
                </span>
              </div>
              {/* Quote */}
              <p className="text-lg md:text-xl font-light leading-snug text-foreground/80 text-pretty">
                "{quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis */}
      <div className="mb-16 md:mb-24">
        <h3 className="text-base font-bold mb-4" style={{ letterSpacing: "-0.01em" }}>
          Synthesis
        </h3>
        <p className="text-base font-light leading-relaxed text-foreground/70 max-w-lg mb-12">
          We made the synthesis of what we discovered and what we learnt. From reaching people's life, we think there are four crucial insights when people dealing with this bureaucratic system.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {[
            { title: "Trans-\nparency", color: "#EF704F", items: ["Fingers crossed", "Opaque process", "AI or human?", "What else?"] },
            { title: "Feeling\nHuman",  color: "#B8A8C7", items: ["Stigma", "Dehumanising", "Dismissible", "In dialogue"] },
            { title: "Trust in\nSystem", color: "#A9B6A2", items: ["'Rejection machine'", "Hello?", "It depends", "Legal action"] },
            { title: "Access",          color: "#ECECEC", items: ["Word of mouth", "Care networks", "Barriers to entry", ""] },
          ].map(({ title, color, items }) => (
            <div key={title} style={{
              background: color,
              border: "2.32px solid #08081a",
              aspectRatio: "220 / 313",
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Title — 35% of card height */}
              <div style={{
                flex: "0 0 35%",
                padding: "16px",
                borderBottom: "2.32px solid #08081a",
                display: "flex",
                alignItems: "flex-end",
              }}>
                <span style={{
                  fontSize: "clamp(14px, 1.8vw, 28px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#080c1a",
                  whiteSpace: "pre-line",
                }}>
                  {title}
                </span>
              </div>
              {/* 2×2 sub-grid — 65% of card height */}
              <div style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
              }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{
                    padding: "10px 12px",
                    fontSize: "clamp(9px, 1vw, 14px)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "#080c1a",
                    borderRight:  idx % 2 === 0 ? "2.32px solid #08081a" : "none",
                    borderBottom: idx < 2       ? "2.32px solid #08081a" : "none",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 03 — Involve People */}
      <div className="mb-16 md:mb-24">
        <div className="border-t border-foreground/10 pt-6 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
            03 — Involve People
          </span>
        </div>
        <EcomapReveal />
      </div>

      {/* Workshop */}
      <div className="mb-16 md:mb-24">

        {/* Row 1: workshop title + photo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start", marginBottom: "3rem" }}>
          <div>
            <h3 className="text-base font-bold mb-3" style={{ letterSpacing: "-0.01em" }}>
              A hybrid co-creation workshop
            </h3>
            <p className="text-base font-light leading-relaxed text-foreground/70">
              Limited by time and location, we decided to host a hybrid workshop to ideate.
            </p>
          </div>
          {/* Workshop photo */}
          <div className="w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img src={workshopPhoto} alt="Workshop" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Row 2: browser mockup + caption */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "center" }}>
          <BrowserChrome
            mockupSrc={workshopMockup}
            videoSrc="https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/inside_workshop.mp4"
          />

          <div>
            <h3 className="text-base font-bold mb-3" style={{ letterSpacing: "-0.01em" }}>
              An online tool
            </h3>
            <p className="text-base font-light leading-relaxed text-foreground/70">
              This website we developed allowed participants to envision future interactions with the government, providing us with valuable material for our future concept development.
            </p>
          </div>
        </div>

      </div>

      {/* 04 — Design */}
      <DesignConcepts />

      {/* 05 — Interface */}
      <InterfaceShowcase />

      {/* 06 — Takeaways */}
      <div className="mb-16 md:mb-24">
        <div className="border-t border-foreground/10 pt-6 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">06 — Takeaways</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }}>
          {[
            {
              title: "A different kind of interaction design",
              body: "My first complete project at the strategic design level. I learned to shift perspective — from pixel-perfect details to how people's lives interact with services and systems at scale.",
            },
            {
              title: "The power of team work",
              body: "I am very grateful to my team members for working with me to complete such a complex project within ten weeks. I thoroughly enjoyed the process.",
            },
            {
              title: "Participatory Design Method",
              body: "We used a democratic, participatory design approach to include more people in the design process — building a strong and reliable foundation for our final concept.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-base font-semibold mb-4" style={{ letterSpacing: "-0.01em" }}>{title}</h3>
              <p className="text-sm font-light leading-relaxed text-foreground/60">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
