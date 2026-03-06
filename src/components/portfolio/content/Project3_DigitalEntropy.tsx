import React, { useRef, useState, useEffect } from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";
import imgForestryMachine from "figma:asset/imgForestryMachine.jpg";
import imgDriver1 from "figma:asset/Driver1.png";
import imgMechanic1 from "figma:asset/Mechanic1.png";
import imgMechanic2 from "figma:asset/Mechanic2.png";
import imgResearchBoard from "figma:asset/coact_researchboard.jpeg";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project3_DigitalEntropy({
  project,
  slugify,
}: Props) {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  // Tacit knowledge curves
  const quotesContainerRef = useRef<HTMLDivElement>(null);
  const curveRef1 = useRef<SVGPathElement>(null);
  const curveRef2 = useRef<SVGPathElement>(null);
  const curveRef3 = useRef<SVGPathElement>(null);
  const [curvesDrawn, setCurvesDrawn] = useState(false);
  const [curveLengths, setCurveLengths] = useState([1100, 520, 1200]);

  useEffect(() => {
    const l1 = curveRef1.current?.getTotalLength();
    const l2 = curveRef2.current?.getTotalLength();
    const l3 = curveRef3.current?.getTotalLength();
    if (l1 && l2 && l3) setCurveLengths([l1, l2, l3]);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurvesDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (quotesContainerRef.current) observer.observe(quotesContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Insights scroll reveal
  const insightRef1 = useRef<HTMLDivElement>(null);
  const insightRef2 = useRef<HTMLDivElement>(null);
  const insightRef3 = useRef<HTMLDivElement>(null);
  const [insightsRevealed, setInsightsRevealed] = useState([false, false, false]);

  useEffect(() => {
    const insightRefs = [insightRef1, insightRef2, insightRef3];
    const observers = insightRefs.map((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInsightsRevealed(prev => prev.map((v, j) => j === i ? true : v));
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // HMW diagram scroll draw
  const hmwContainerRef = useRef<HTMLDivElement>(null);
  const [hmwDrawn, setHmwDrawn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHmwDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (hmwContainerRef.current) observer.observe(hmwContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Image blur on scroll
  const insightsWrapperRef = useRef<HTMLDivElement>(null);
  const [imageBlur, setImageBlur] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!insightsWrapperRef.current) return;
      const rect = insightsWrapperRef.current.getBoundingClientRect();
      // Start when insights top enters viewport at 60%, full effect at -30vh
      const start = window.innerHeight * 0.6;
      const end = -window.innerHeight * 0.3;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setImageBlur(progress * 8);
      setOverlayOpacity(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleRowEnter = (ref: React.RefObject<HTMLVideoElement | null>) => {
    ref.current?.play();
  };
  const handleRowLeave = (ref: React.RefObject<HTMLVideoElement | null>) => {
    ref.current?.pause();
  };

  const img = {
    hero: getContentImage(3, "hero"),
    fig01: getContentImage(3, "fig01"),
    fig02: getContentImage(3, "fig02"),
    fig03: getContentImage(3, "fig03"),
    fig_navigate: getContentImage(3, "fig_navigate"),
    fig_inspection: getContentImage(3, "fig_inspection"),
    video_ethnography: getContentImage(3, "video_ethnography"),
  };

  return (
    <>
      {/* Hero Image */}
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback
          src={img.hero}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── 01 BACKGROUND ── */}
      <div
        id={slugify("Background")}
        className="border-t border-foreground/10 pt-6 mb-10 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          01 — Background
        </span>
      </div>

      {/* Lead sentence */}
      <p className="text-base font-light text-foreground/80 mb-8">
        This is a story about human, machines, and knowledge...
      </p>

      {/* Staggered layout: image bottom-left, poem top-right */}
      <div
        className="bg-staggered-container mb-24 md:mb-32"
        style={{ position: "relative", width: "100%", height: "570px" }}
      >
        {/* Image — bottom left */}
        <div
          className="bg-staggered-image"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "52%",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <img
            src={imgForestryMachine}
            alt="Forestry machine in snow"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Poem — top right */}
        <div
          className="bg-staggered-poem"
          style={{
            position: "absolute",
            left: "62%",
            top: "28px",
            width: "38%",
          }}
        >
          <p style={{ lineHeight: "27px", fontWeight: 300, opacity: 0.8, margin: 0 }}>
            It's -20°C in the forest.<br />
            {" "}A forestry machine has stopped working.
          </p>
          <p style={{ lineHeight: "27px", fontWeight: 300, opacity: 0.8, margin: "27px 0 0 0" }}>
            Calls are made.<br />
            People arrive on-site.<br />
            Diagnostics are pulled.<br />
            Parts are checked.<br />
          </p>
          <p style={{ lineHeight: "27px", fontWeight: 300, opacity: 0.8, margin: "27px 0 0 0" }}>
            The work cannot wait.<br />
          </p>
          <p style={{ lineHeight: "27px", fontWeight: 300, opacity: 0.8, margin: "27px 0 0 0" }}>
            Co-Act envisions a near future how people, machines, and AI can reason together in moments like this.
          </p>
        </div>
      </div>

      {/* ── 02 ETHNOGRAPHY ── */}
      <div
        id={slugify("Ethnography")}
        className="border-t border-foreground/10 pt-6 mb-8 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          02 — Ethnography
        </span>
        <p className="text-xs font-mono text-foreground/30 mt-1">
          <span className="tracking-widest" style={{ visibility: "hidden" }}>02 — </span>Understanding Work in Context
        </p>
      </div>

      {/* Lead */}
      <p style={{ fontWeight: 300, fontSize: "16px", lineHeight: "28px", opacity: 0.8, marginBottom: "64px" }}>
        We spent time with the mechanics to understand how the actual work<br/>
        unfolds in the field.
      </p>

      {/* Three rows of ethnography content */}
      <div className="mb-24 md:mb-24" style={{ display: "flex", flexDirection: "column", gap: "80px" }}>

        {/* Row 1: Time + phone image + location grid */}
        <div
          className="ethnography-row"
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef1)}
          onMouseLeave={() => handleRowLeave(videoRef1)}
        >
          <div className="hidden md:flex" style={{ width: "250px", flexShrink: 0, flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
            <p style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}></p>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0, textAlign: "right" }}></p>
          </div>
          <div className="ethnography-col ethnography-video-box" style={{ width: "250px", height: "250px", flexShrink: 0, overflow: "hidden", background: "rgba(250,250,250,0.05)", position: "relative" }}>
            {img.fig_navigate && img.fig_navigate !== "REPLACE_P3_FIG_NAVIGATE" ? (
              <video ref={videoRef1} src={img.fig_navigate} muted loop playsInline style={{ position: "absolute", top: "-48px", left: 0, width: "100%", height: "auto", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>
          <div className="ethnography-col ethnography-blue-card" style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Mechanics (Service engineer) work across locations.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>HOME</p>
              <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>WORKSHOP</p>
              <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>FOREST</p>
              <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>CAR</p>
              <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>...</p>
            </div>
          </div>
        </div>

        {/* Row 2: Blue card + inspection video + description text */}
        <div
          className="ethnography-row"
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef2)}
          onMouseLeave={() => handleRowLeave(videoRef2)}
        >
          <div className="ethnography-col ethnography-blue-card" style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", alignItems: "flex-start" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Work Happens in Harsh Conditions
            </p>
          </div>
          <div className="ethnography-col ethnography-video-box" style={{ width: "400px", flexShrink: 0, height: "250px", overflow: "hidden", background: "rgba(250,250,250,0.05)" }}>
            {img.fig_inspection && img.fig_inspection !== "REPLACE_P3_FIG_INSPECTION" ? (
              <video ref={videoRef2} src={img.fig_inspection} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>
          <div className="ethnography-col" style={{ width: "250px", flexShrink: 0, height: "250px", overflow: "hidden", display: "flex", alignItems: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              Mechanics operate outdoors, often surrounded by heavy equipment and limited infrastructure. Digital tools must compete with gloves, grease, snow, and unstable surfaces.
            </p>
          </div>
        </div>

        {/* Row 3: Quote + oil leak video + Machine Has Body */}
        <div
          className="ethnography-row"
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef3)}
          onMouseLeave={() => handleRowLeave(videoRef3)}
        >
          <div className="ethnography-col" style={{ width: "250px", flexShrink: 0, padding: "0 0 4px 0", overflow: "hidden", display: "flex", alignItems: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              {/* "Oil Leak again, I need a new spare part." */}
            </p>
          </div>
                    <div className="ethnography-col ethnography-blue-card" style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Machine Has a "Body"
            </p>
            <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              Previous failures, temporary fixes, and working environment all influence the machines. Yet this information is not always visible.
            </p>
          </div>
          <div className="ethnography-col ethnography-video-box" style={{ width: "400px", height: "250px", flexShrink: 0, overflow: "hidden", background: "rgba(250,250,250,0.05)" }}>
            {img.video_ethnography && img.video_ethnography !== "REPLACE_P3_VIDEO_ETHNOGRAPHY" ? (
              <video ref={videoRef3} src={img.video_ethnography} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>

        </div>

      </div>

      {/* ── Verbal conversations ── */}
      <p style={{ fontWeight: 300, fontSize: "16px", lineHeight: "28px", opacity: 0.8, marginBottom: "50px" }}>
        More value insights from the verbal conversations
      </p>

      {/* Staggered quotes + illustrations */}
      <div ref={quotesContainerRef} className="mb-24 md:mb-32" style={{ position: "relative", width: "100%", height: "512px", overflow: "visible" }}>

        {/* SVG curves — tacit knowledge connections */}
        <svg
          viewBox="0 0 960 512"
          preserveAspectRatio="xMinYMin meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "512px", overflow: "visible", pointerEvents: "none" }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            </marker>
          </defs>

          {/* Mechanic1 → Mechanic2: arch over the top */}
          <path
            ref={curveRef1}
            d="M 100 58 C 100 -90 900 -90 900 108"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.25"
            markerEnd="url(#arrow)"
            strokeDasharray={curveLengths[0]}
            strokeDashoffset={curvesDrawn ? 0 : curveLengths[0]}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0s" }}
          />
          {/* Mechanic1 → Driver: arc down the left side */}
          <path
            ref={curveRef2}
            d="M 66 215 C -90 295 -90 400 214 370"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.25"
            markerEnd="url(#arrow)"
            strokeDasharray={curveLengths[1]}
            strokeDashoffset={curvesDrawn ? 0 : curveLengths[1]}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.4s" }}
          />
          {/* Mechanic2 → Driver: arc down the right side */}
          <path
            ref={curveRef3}
            d="M 902 186 C 1080 320 1080 500 296 441"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.25"
            markerEnd="url(#arrow)"
            strokeDasharray={curveLengths[2]}
            strokeDashoffset={curvesDrawn ? 0 : curveLengths[2]}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.7s" }}
          />
        </svg>

        {/* Quote 1 — top left */}
        <p style={{ position: "absolute", left: "109px", top: 0, width: "401px", fontSize: "16px", fontWeight: 300, lineHeight: "24px", opacity: 0.8, margin: 0 }}>
          "I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth."
        </p>
        <img
          className="img-adaptive"
          src={imgMechanic1}
          alt=""
          style={{ position: "absolute", left: 0, top: "58px", width: "133px", height: "157px", objectFit: "cover", display: "block" }}
        />

        {/* Quote 2 — middle right */}
        <p style={{ position: "absolute", left: "464px", top: "136px", width: "401px", fontSize: "16px", fontWeight: 300, lineHeight: "24px", opacity: 0.8, margin: 0 }}>
          "When I was new to here, I didn't experience the hard time. The customers here, they know that it takes time to learn cause they've seen new mechanics learn before so..."
        </p>
        <img
          className="img-adaptive"
          src={imgMechanic2}
          alt=""
          style={{ position: "absolute", left: "845px", top: "108px", width: "115px", height: "157px", objectFit: "cover", display: "block" }}
        />

        {/* Quote 3 — bottom center */}
        <img
          className="img-adaptive"
          src={imgDriver1}
          alt=""
          style={{ position: "absolute", left: "133px", top: "370px", width: "163px", height: "142px", objectFit: "cover", display: "block" }}
        />
        <p style={{ position: "absolute", left: "271px", top: "334px", width: "401px", fontSize: "16px", fontWeight: 300, lineHeight: "24px", opacity: 0.8, margin: 0 }}>
          This driver who helped alongside, he knows a lot about his machine, while the younger generations are often less involved in the mechanical aspects of machines"
        </p>

      </div>

      {/* ── Research insights ── */}
      <p style={{ fontWeight: 300, fontSize: "16px", lineHeight: "28px", opacity: 0.8, marginBottom: "32px" }}>
        From where we got a clear overview of the challenges and opportunities
      </p>

      <div className="mb-24 md:mb-32" style={{ position: "relative" }}>

        {/* Sticky blurring image */}
        <div style={{ position: "sticky", top: "15vh", height: "70vh", overflow: "hidden", zIndex: 0 }}>
          <img
            src={imgResearchBoard}
            alt="Research board"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: `blur(${imageBlur}px)`,
              transform: "scale(1.06)",
              transition: "filter 0.1s linear",
            }}
          />
          {/* Gradient: background color pushes up as insights scroll over */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, var(--page-bg) ${Math.max(20, 88 - overlayOpacity * 68)}%)`,
          }} />
        </div>

        {/* Insights — pulled up to overlap the faded image */}
        <div ref={insightsWrapperRef} style={{ position: "relative", zIndex: 1, marginTop: "-20vh" }}>
          {([
            { title: "Mobile Ways of Working", body: "Maintenance happens across locations, but tools and information do not." },
            { title: "Harsh Conditions for Field Work", body: "Field conditions demand tools that work beyond desks and controlled environments." },
            { title: "Knowledge is Tacit and Distributed", body: "Machine knowledge is scattered across systems, documents, and human experience." },
          ] as const).map((insight, i) => {
            const ref = [insightRef1, insightRef2, insightRef3][i];
            const revealed = insightsRevealed[i];
            return (
              <div
                key={insight.title}
                ref={ref}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: "40px",
                  paddingBottom: "40px",
                  display: "grid",
                  gridTemplateColumns: "56px 1fr 1fr",
                  gap: "40px",
                  alignItems: "start",
                  transform: revealed ? "translateY(0px)" : "translateY(24px)",
                  opacity: revealed ? 1 : 0,
                  transition: "all 600ms ease",
                }}
              >
                <span style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--brand-blue)", paddingTop: "6px" }}>
                  0{i + 1}
                </span>
                <p style={{ fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 300, lineHeight: 1.25, margin: 0, textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
                  {insight.title}
                </p>
                <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.75, margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  {insight.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 03 DESIGN STRATEGY ── */}
      <div
        id={slugify("Design Strategy")}
        className="border-t border-foreground/10 pt-6 mb-8 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          03 — Design Strategy
        </span>
      </div>

      <p style={{ fontWeight: 300, fontSize: "16px", lineHeight: "28px", opacity: 0.8, marginBottom: "50px" }}>
        These insights raised new questions about how could we frame a new landscape for the maintenance work.
      </p>

      {/* HMW diagram */}
      <div ref={hmwContainerRef} className="mb-24 md:mb-32" style={{ position: "relative", width: "100%", overflowX: "hidden" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "960px", height: "843px" }}>

          {/* HMW Box 1 */}
          <div style={{
            position: "absolute", left: 0, top: "29px",
            width: "250px", height: "250px",
            border: "1px solid var(--brand-blue)", borderRadius: "8px",
            padding: "16px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            overflow: "hidden",
          }}>
            <p style={{ fontSize: "24px", fontWeight: 300, lineHeight: "26px", margin: 0, color: "var(--foreground)" }}>
              <span style={{ opacity: 0.33 }}>How might we</span>
              {` support maintenance work that happens across locations?`}
            </p>
            <svg width="49" height="48" viewBox="0 0 49 48" fill="none">
              <circle cx="17" cy="28" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
              <circle cx="32" cy="28" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
              <circle cx="24.5" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
            </svg>
          </div>

          {/* HMW Box 2 */}
          <div style={{
            position: "absolute", left: 0, top: "307px",
            width: "250px", height: "250px",
            border: "1px solid var(--brand-blue)", borderRadius: "8px",
            padding: "16px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            overflow: "hidden",
          }}>
            <p style={{ fontSize: "24px", fontWeight: 300, lineHeight: "26px", margin: 0, color: "var(--foreground)" }}>
              <span style={{ opacity: 0.33 }}>How might we</span>
              {` improve for more accurate troubleshooting?`}
            </p>
            <svg width="49" height="49" viewBox="0 0 49 49" fill="none">
              <path d="M6 24.5L24.5 15L43 24.5L24.5 34L6 24.5Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
              <path d="M6 31L24.5 40.5L43 31" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
              <path d="M6 18L24.5 8.5L43 18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
            </svg>
          </div>

          {/* HMW Box 3 */}
          <div style={{
            position: "absolute", left: 0, top: "585px",
            width: "250px", height: "250px",
            border: "1px solid var(--brand-blue)", borderRadius: "8px",
            padding: "16px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            overflow: "hidden",
          }}>
            <p style={{ fontSize: "24px", fontWeight: 300, lineHeight: "26px", margin: 0, color: "var(--foreground)" }}>
              <span style={{ opacity: 0.33 }}>How might we</span>
              {` facilitate the exchanging the tacit knowledge?`}
            </p>
            <svg width="48" height="49" viewBox="0 0 48 49" fill="none">
              <path d="M24 4L26 20L40 24L26 28L24 44L22 28L8 24L22 20L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
              <path d="M24 14L25.5 22L33 24L25.5 26L24 34L22.5 26L15 24L22.5 22L24 14Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            </svg>
          </div>

          {/* SVG connecting lines — two-layer scroll reveal:
               bottom = final dashed line (static),
               top = solid page-bg cover that retreats left/downward to expose the dashes */}
          <svg
            viewBox="0 0 960 843"
            preserveAspectRatio="xMinYMin meet"
            style={{ position: "absolute", inset: 0, width: "100%", height: "843px", pointerEvents: "none", overflow: "visible" }}
          >
            {/* ── Left vertical upper: y 86→258, length=172 ── */}
            <line x1="318" y1="86" x2="318" y2="258"
              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"
              strokeLinecap="round" strokeDasharray="12 12" />
            <line x1="318" y1="86" x2="318" y2="258"
              stroke="var(--page-bg)" strokeWidth="3" strokeLinecap="square"
              strokeDasharray="172"
              strokeDashoffset={hmwDrawn ? 172 : 0}
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1) 0s" }} />

            {/* ── Left vertical lower: y 287→758, length=471 ── */}
            <line x1="318" y1="287" x2="318" y2="758"
              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"
              strokeLinecap="round" strokeDasharray="12 12" />
            <line x1="318" y1="287" x2="318" y2="758"
              stroke="var(--page-bg)" strokeWidth="3" strokeLinecap="square"
              strokeDasharray="471"
              strokeDashoffset={hmwDrawn ? 471 : 0}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />

            {/* ── Branch with 12px rounded corners, length≈444 ── */}
            <path d="M 318 154 L 530 154 Q 542 154 542 166 L 542 260 Q 542 272 554 272 L 655 272"
              fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"
              strokeLinecap="round" strokeDasharray="12 12" />
            <path d="M 318 154 L 530 154 Q 542 154 542 166 L 542 260 Q 542 272 554 272 L 655 272"
              fill="none"
              stroke="var(--page-bg)" strokeWidth="3" strokeLinecap="square"
              strokeDasharray="444"
              strokeDashoffset={hmwDrawn ? 444 : 0}
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) 0.15s" }} />

            {/* ── Right vertical 1: y 302→444, length=142 ── */}
            <line x1="678" y1="302" x2="678" y2="444"
              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"
              strokeLinecap="round" strokeDasharray="12 12" />
            <line x1="678" y1="302" x2="678" y2="444"
              stroke="var(--page-bg)" strokeWidth="3" strokeLinecap="square"
              strokeDasharray="142"
              strokeDashoffset={hmwDrawn ? 142 : 0}
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1) 0.5s" }} />

            {/* ── Right vertical 2: y 464→616, length=152 ── */}
            <line x1="678" y1="464" x2="678" y2="616"
              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"
              strokeLinecap="round" strokeDasharray="12 12" />
            <line x1="678" y1="464" x2="678" y2="616"
              stroke="var(--page-bg)" strokeWidth="3" strokeLinecap="square"
              strokeDasharray="152"
              strokeDashoffset={hmwDrawn ? 152 : 0}
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1) 0.7s" }} />
          </svg>

          {/* Pill: Strengthen communication */}
          <div style={{
            position: "absolute", left: "296px", top: "56px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Strengthen communication
            </span>
          </div>

          {/* Pill: Mobility friendly */}
          <div style={{
            position: "absolute", left: "296px", top: "258px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Mobility friendly
            </span>
          </div>

          {/* Pill: Design for collaboration */}
          <div style={{
            position: "absolute", left: "296px", top: "758px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Design for collaboration
            </span>
          </div>

          {/* Pill: Diagnose proactively */}
          <div style={{
            position: "absolute", left: "655px", top: "272px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Diagnose proactively
            </span>
          </div>

          {/* Pill: Support troubleshooting with AI */}
          <div style={{
            position: "absolute", left: "655px", top: "444px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Support troubleshooting with AI
            </span>
          </div>

          {/* Pill: Respect human expertise */}
          <div style={{
            position: "absolute", left: "655px", top: "616px",
            display: "flex", gap: "10px", alignItems: "center",
            background: "var(--brand-blue)", borderRadius: "40px",
            padding: "12px 24px 12px 12px",
          }}>
            <div style={{ width: "24px", height: "30px", background: "var(--background)", borderRadius: "29px", flexShrink: 0 }} />
            <span style={{ fontSize: "16px", fontWeight: 400, lineHeight: "28px", color: "var(--foreground)", opacity: 0.8, whiteSpace: "nowrap" }}>
              Respect human expertise
            </span>
          </div>

        </div>
      </div>

      {/* Section 4: Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
        {/* Left 4 cols: Section title */}
        <div
          id={slugify("Gallery")}
          className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            04 — Gallery
          </span>
        </div>

        {/* Right 8 cols: Content */}
        <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            Additional visual explorations.
          </p>
          {img.fig03 && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={img.fig03}
                alt="Gallery"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
