import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";
import imgForestryMachine from "figma:asset/imgForestryMachine.jpg";
import imgDriver1 from "figma:asset/Driver1.png";
import imgMechanic1 from "figma:asset/Mechanic1.png";
import imgMechanic2 from "figma:asset/Mechanic2.png";
import imgResearchBoard from "figma:asset/coact_researchboard.jpeg";
import coActLogo from "figma:asset/co_actlogo.svg";
import imgIPhone15Pro from "figma:asset/iPhone15pro.png";
import imgIPadPro11 from "figma:asset/iPadpro11.png";
import imgCoactOfficeView from "figma:asset/coact_officeview.jpg";
import imgCoactCollabView from "figma:asset/coact_collabview.jpg";
import imgCoactMockup from "figma:asset/coact_mockup.png";
import imgCoactOperatorHome from "figma:asset/coact_operatorhome.png";
import imgCoactHome from "figma:asset/coact_home.png";
import imgCoactDashboard from "figma:asset/coact_dashboard.png";
import imgCoactSmartAI from "figma:asset/coact_smartai.png";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project3_DigitalEntropy({
  project,
  slugify,
}: Props) {
  // ── Spacing system ─────────────────────────────────────────────
  const S = {
    section:   "64px",   // between major sections
    block:     "40px",   // between feature blocks
    lead:      "40px",   // below lead paragraphs
    component: "40px",   // between sub-components within a block
    gap:       "24px",   // standard flex/grid gap
    inner:     "16px",   // gap within a component (card → caption)
    tight:     "12px",   // gap within text groups
  };

  // ── Typography system ──────────────────────────────────────────
  const T = {
    display: { fontSize: "clamp(22px, 2.5vw, 24px)", fontWeight: 350, lineHeight: 1.35 } as React.CSSProperties,
    body:    { fontSize: "16px", fontWeight: 300, lineHeight: "28px" } as React.CSSProperties,
    caption: { fontSize: "14px", fontWeight: 300, lineHeight: "22px" } as React.CSSProperties,
    label:   { fontSize: "11px", fontFamily: "monospace", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" as const } as React.CSSProperties,
  };

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
  const [quotesScale, setQuotesScale] = useState(1);

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

  useEffect(() => {
    const update = () => {
      if (quotesContainerRef.current) {
        setQuotesScale(Math.min(1, quotesContainerRef.current.offsetWidth / 960));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);


  // HMW diagram scroll draw + scale

  // Concept video — YouTube IFrame API
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayer = useRef<any>(null);
  const [cvPlaying, setCvPlaying] = useState(false);
  const [cvMuted, setCvMuted] = useState(true);
  const [cvProgress, setCvProgress] = useState(0);
  const [cvShowControls, setCvShowControls] = useState(true);
  const cvHideTimer = useRef<ReturnType<typeof setTimeout>>();
  const cvProgressTimer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const initPlayer = () => {
      if (!ytContainerRef.current) return;
      ytPlayer.current = new (window as any).YT.Player(ytContainerRef.current, {
        videoId: "KNZilN_i7OM",
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onStateChange: (e: any) => {
            const playing = e.data === (window as any).YT.PlayerState.PLAYING;
            setCvPlaying(playing);
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => { ytPlayer.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (cvProgressTimer.current) clearInterval(cvProgressTimer.current);
    if (cvPlaying) {
      cvProgressTimer.current = setInterval(() => {
        const p = ytPlayer.current;
        if (p?.getCurrentTime && p?.getDuration) {
          const dur = p.getDuration();
          if (dur > 0) setCvProgress((p.getCurrentTime() / dur) * 100);
        }
      }, 250);
    }
    return () => { if (cvProgressTimer.current) clearInterval(cvProgressTimer.current); };
  }, [cvPlaying]);

  const cvTogglePlay = () => {
    if (!ytPlayer.current) return;
    cvPlaying ? ytPlayer.current.pauseVideo() : ytPlayer.current.playVideo();
  };
  const cvToggleMute = () => {
    if (!ytPlayer.current) return;
    if (cvMuted) { ytPlayer.current.unMute(); setCvMuted(false); }
    else { ytPlayer.current.mute(); setCvMuted(true); }
  };
  const cvHandleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ytPlayer.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ytPlayer.current.seekTo(((e.clientX - rect.left) / rect.width) * ytPlayer.current.getDuration(), true);
  };
  const cvHandleFullscreen = () => {
    const iframe = ytContainerRef.current?.querySelector("iframe");
    iframe?.requestFullscreen?.();
  };
  const cvHandleMouseMove = () => {
    setCvShowControls(true);
    if (cvHideTimer.current) clearTimeout(cvHideTimer.current);
    cvHideTimer.current = setTimeout(() => { if (cvPlaying) setCvShowControls(false); }, 2500);
  };

  // Feature cards — scroll-driven horizontal slide
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardsStripRef = useRef<HTMLDivElement>(null);
  const [cardsTranslateX, setCardsTranslateX] = useState(0);
  const [cardsScrollDist, setCardsScrollDist] = useState(1800);

  useEffect(() => {
    const measure = () => {
      if (cardsStripRef.current && cardsWrapperRef.current) {
        setCardsScrollDist(Math.max(0, cardsStripRef.current.scrollWidth - cardsWrapperRef.current.offsetWidth));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!cardsWrapperRef.current || !cardsStripRef.current) return;
      const rect = cardsWrapperRef.current.getBoundingClientRect();
      const dist = cardsStripRef.current.scrollWidth - cardsWrapperRef.current.offsetWidth;
      setCardsTranslateX(Math.max(-dist, Math.min(0, rect.top)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
      {/* <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback
          src={img.hero}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div> */}

      {/* Co-Act intro — logo, mockup, tagline */}
      <div className="flex flex-col items-center" style={{ gap: S.inner, marginBottom: S.lead }}>
        <div style={{
          width: "64px", height: "64px",
          background: "#3559C7",
          borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <motion.img
            src={coActLogo}
            alt="Co-Act gear"
            style={{ width: "37px", height: "38px", display: "block", transformOrigin: "50% 45%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span style={{ ...T.display, lineHeight: "1.2", color: "var(--foreground)" }}>
          Co-Act
        </span>
      </div>

      <div style={{ width: "75%", margin: "0 auto 40px auto" }}>
        <img
          src={imgCoactMockup}
          alt="Co-Act — device mockup"
          style={{ width: "100%", display: "block", objectFit: "contain", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.4))" }}
        />
      </div>

      <p style={{
        ...T.display,
        lineHeight: "1.4",
        opacity: 0.8,
        textAlign: "center",
        maxWidth: "640px",
        margin: "0 auto 80px auto",
      }}>
        Bringing machine data, diagnostics, and collaboration into one workspace.
      </p>

      {/* ── 01 BACKGROUND ── */}
      <div
        id={slugify("Background")}
        className="border-t border-foreground/10 pt-6 mb-8 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          01 — Background
        </span>
      </div>

      {/* Lead sentence */}
      <p className="text-base font-light text-foreground/80 mb-10">
        This is a story about human, machines, and knowledge...
      </p>

      {/* Staggered layout: image bottom-left, poem top-right */}
      <div
        className="bg-staggered-container"
        style={{ position: "relative", width: "100%", height: "570px", marginBottom: S.section }}
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
      <p style={{ ...T.body, opacity: 0.8, marginBottom: S.lead }}>
        We spent time with the mechanics to understand how the actual work unfolds in the field.
      </p>

      {/* Field observations — 3-column editorial grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 mb-24 md:mb-24">

        {/* Observation 01 — Context */}
        <div
          onMouseEnter={() => handleRowEnter(videoRef1)}
          onMouseLeave={() => handleRowLeave(videoRef1)}
        >
          <div style={{ height: "240px", overflow: "hidden", background: "rgba(128,128,128,0.08)", marginBottom: S.inner }}>
            {img.fig_navigate && img.fig_navigate !== "REPLACE_P3_FIG_NAVIGATE" ? (
              <video ref={videoRef1} src={img.fig_navigate} muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, ...T.label }}>Video</div>
            )}
          </div>
          <div className="border-t border-foreground/10" style={{ paddingTop: "14px" }}>
            
            <p style={{ ...T.display, margin: "0 0 10px 0" }}>
              Mechanics work across locations
            </p>
            <p style={{ ...T.caption, opacity: 0.6, margin: "0 0 14px 0" }}>
              Jobs take them from home to workshop to deep forest. Tools and information rarely follow.
            </p>
            
          </div>
        </div>

        {/* Observation 02 — Environment */}
        <div
          onMouseEnter={() => handleRowEnter(videoRef2)}
          onMouseLeave={() => handleRowLeave(videoRef2)}
        >
          <div style={{ height: "240px", overflow: "hidden", background: "rgba(128,128,128,0.08)", marginBottom: S.inner }}>
            {img.fig_inspection && img.fig_inspection !== "REPLACE_P3_FIG_INSPECTION" ? (
              <video ref={videoRef2} src={img.fig_inspection} muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, ...T.label }}>Video</div>
            )}
          </div>
          <div className="border-t border-foreground/10" style={{ paddingTop: "14px" }}>
           
            <p style={{ ...T.display, margin: "0 0 10px 0" }}>
              Work happens in demanding conditions
            </p>
            <p style={{ ...T.caption, opacity: 0.6, margin: 0 }}>
              Digital tools must compete with gloves, grease, snow, and unstable surfaces — far from any desk or controlled environment.
            </p>
          </div>
        </div>

        {/* Observation 03 — Expertise */}
        <div
          onMouseEnter={() => handleRowEnter(videoRef3)}
          onMouseLeave={() => handleRowLeave(videoRef3)}
        >
          <div style={{ height: "240px", overflow: "hidden", background: "rgba(128,128,128,0.08)", marginBottom: S.inner }}>
            {img.video_ethnography && img.video_ethnography !== "REPLACE_P3_VIDEO_ETHNOGRAPHY" ? (
              <video ref={videoRef3} src={img.video_ethnography} muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, ...T.label }}>Video</div>
            )}
          </div>
          <div className="border-t border-foreground/10" style={{ paddingTop: "14px" }}>
         
            <p style={{ ...T.display, margin: "0 0 10px 0" }}>
              Machine has a "body"
            </p>
            <p style={{ ...T.caption, opacity: 0.6, margin: 0 }}>
              Past failures, temporary fixes, and environment all shape each machine — yet this knowledge is rarely captured or shared.
            </p>
          </div>
        </div>

      </div>

      {/* ── Verbal conversations ── */}
      <p style={{ ...T.body, opacity: 0.8, marginBottom: S.lead }}>
        More value insights from the verbal conversations
      </p>

      {/* Staggered quotes + illustrations */}
      {isMobile ? (
        <div className="mb-24 flex flex-col gap-10">
          {[
            { img: imgMechanic1, quote: '"I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth."' },
            { img: imgMechanic2, quote: '"When I was new to here, I didn\'t experience the hard time. The customers here, they know that it takes time to learn cause they\'ve seen new mechanics learn before so..."' },
            { img: imgDriver1, quote: '"This driver who helped alongside, he knows a lot about his machine, while the younger generations are often less involved in the mechanical aspects of machines."' },
          ].map(({ img, quote }, i) => (
            <div key={i} style={{ display: "flex", gap: S.inner, alignItems: "flex-start" }}>
              <img src={img} alt="" style={{ width: "72px", height: "88px", objectFit: "cover", flexShrink: 0 }} />
              <p style={{ ...T.body, opacity: 0.8, margin: 0 }}>{quote}</p>
            </div>
          ))}
        </div>
      ) : (
        <div ref={quotesContainerRef} style={{ position: "relative", width: "100%", overflow: "hidden", height: `${512 * quotesScale}px`, marginBottom: S.section }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "960px", height: "512px", transform: `scale(${quotesScale})`, transformOrigin: "top left" }}>

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
          <p style={{ position: "absolute", left: "109px", top: 0, width: "401px", ...T.body, opacity: 0.8, margin: 0 }}>
            "I need to order another spare part for the oil leak, we tried to have more parts with us before we came. But there are always back and forth."
          </p>
          <img
            className="img-adaptive"
            src={imgMechanic1}
            alt=""
            style={{ position: "absolute", left: 0, top: "58px", width: "133px", height: "157px", objectFit: "cover", display: "block" }}
          />

          {/* Quote 2 — middle right */}
          <p style={{ position: "absolute", left: "464px", top: "136px", width: "401px", ...T.body, opacity: 0.8, margin: 0 }}>
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
          <p style={{ position: "absolute", left: "271px", top: "334px", width: "401px", ...T.body, opacity: 0.8, margin: 0 }}>
            This driver who helped alongside, he knows a lot about his machine, while the younger generations are often less involved in the mechanical aspects of machines"
          </p>

        </div>
        </div>
      )}

      {/* ── Research insights ── */}
      <p style={{ ...T.body, opacity: 0.8, marginBottom: S.lead }}>
        From where we got a clear overview of the challenges and opportunities
      </p>

      <div className="mb-24 md:mb-24">
        {/* Research board image */}
        <div style={{ width: "100%", height: "50vh", overflow: "hidden", marginBottom: "0" }}>
          <img
            src={imgResearchBoard}
            alt="Research board"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Key findings */}
        {([
          { title: "Mobile Ways of Working", body: "Maintenance happens across locations, but tools and information do not." },
          { title: "Harsh Conditions for Field Work", body: "Field conditions demand tools that work beyond desks and controlled environments." },
          { title: "Knowledge is Tacit and Distributed", body: "Machine knowledge is scattered across systems, documents, and human experience." },
        ] as const).map((insight, i) => (
          <div
            key={insight.title}
            className="border-t border-foreground/10"
            style={{
              paddingTop: "32px",
              paddingBottom: "32px",
              display: isMobile ? "flex" : "grid",
              flexDirection: isMobile ? "column" as const : undefined,
              gridTemplateColumns: isMobile ? undefined : "56px 1fr 1fr",
              gap: isMobile ? "8px" : "40px",
              alignItems: "start",
            }}
          >
            <span style={{ ...T.label, color: "var(--brand-blue)", paddingTop: isMobile ? 0 : "4px" }}>
              0{i + 1}
            </span>
            <p style={{ ...T.display, margin: 0 }}>
              {insight.title}
            </p>
            <p style={{ ...T.body, opacity: 0.6, margin: 0 }}>
              {insight.body}
            </p>
          </div>
        ))}
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

      <p style={{ ...T.body, opacity: 0.8, marginBottom: S.lead }}>
        These insights raised new questions about how could we frame a new landscape for the maintenance work.
      </p>

      {/* HMW diagram */}
      <div style={{ marginBottom: S.section }}>
        {[
          {
            question: "support maintenance work that happens across locations?",
            pills: ["Strengthen communication", "Mobility friendly"],
            icon: (
              <svg width="32" height="32" viewBox="0 0 49 48" fill="none">
                <circle cx="17" cy="28" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                <circle cx="32" cy="28" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                <circle cx="24.5" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
              </svg>
            ),
          },
          {
            question: "improve for more accurate troubleshooting?",
            pills: ["Diagnose proactively", "Support troubleshooting with AI"],
            icon: (
              <svg width="32" height="32" viewBox="0 0 49 49" fill="none">
                <path d="M6 24.5L24.5 15L43 24.5L24.5 34L6 24.5Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                <path d="M6 31L24.5 40.5L43 31" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                <path d="M6 18L24.5 8.5L43 18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
              </svg>
            ),
          },
          {
            question: "facilitate the exchanging the tacit knowledge?",
            pills: ["Design for collaboration", "Respect human expertise"],
            icon: (
              <svg width="32" height="32" viewBox="0 0 48 49" fill="none">
                <path d="M24 4L26 20L40 24L26 28L24 44L22 28L8 24L22 20L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                <path d="M24 14L25.5 22L33 24L25.5 26L24 34L22.5 26L15 24L22.5 22L24 14Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" fill="none" />
              </svg>
            ),
          },
        ].map(({ question, pills, icon }, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? S.tight : "48px",
            alignItems: "center",
            borderTop: "1px solid rgba(128,128,128,0.15)",
            paddingTop: "28px",
            paddingBottom: "28px",
          }}>
            {/* Left: HMW question */}
            <div style={{
              border: "1px solid var(--brand-blue)",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              justifyContent: "space-between",
              alignItems: isMobile ? "center" : "flex-start",
              gap: "16px",
              minHeight: isMobile ? undefined : "140px",
            }}>
              <p style={{ ...T.body, margin: 0, color: "var(--foreground)" }}>
                <span style={{ opacity: 0.35 }}>How might we </span>{question}
              </p>
              {icon}
            </div>
            {/* Right: pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pills.map((pill) => (
                <div key={pill} style={{
                  display: "inline-flex", gap: "10px", alignItems: "center",
                  background: "var(--brand-blue)", borderRadius: "40px",
                  padding: "8px 20px 8px 8px", alignSelf: "flex-start",
                }}>
                  <div style={{ width: "20px", height: "20px", background: "var(--background)", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ ...T.body, color: "var(--foreground)", opacity: 0.9 }}>{pill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── 04 COLLABORATIVE ACTIONS ── */}
      <div
        id={slugify("Collaborative Actions")}
        className="border-t border-foreground/10 pt-6 mb-8 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          04 — Collaborative Actions
        </span>
      </div>

      {/* ── Feature cards — scroll-driven horizontal ── */}
      <div
        ref={cardsWrapperRef}
        style={{ height: isMobile ? "auto" : `calc(100vh + ${cardsScrollDist}px)`, marginBottom: S.block }}
      >
        <div style={{
          position: isMobile ? "relative" as const : "sticky" as const,
          top: 0,
          height: isMobile ? "auto" : "70vh",
          overflow: isMobile ? "visible" : "hidden",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: isMobile ? "flex-start" : "center",
          gap: S.gap,
        }}>
          <p style={{ ...T.body, opacity: 0.8 }}>
            Take care of the machines together
          </p>
          <div
            ref={cardsStripRef}
            className={isMobile ? "no-scrollbar" : undefined}
            style={{
              display: "flex",
              gap: S.gap,
              overflowX: isMobile ? "auto" : "visible",
              scrollbarWidth: isMobile ? "none" as const : undefined,
              height: "526px",
              transform: isMobile ? undefined : `translateX(${cardsTranslateX}px)`,
              willChange: isMobile ? undefined : "transform",
              transition: isMobile ? undefined : "transform 0.08s linear",
            }}
          >


          {/* Card 1 — Operator's view */}
          <div style={{
            flexShrink: 0,
            height: "526px",
            background: "var(--coact-card-bg)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "30px",
            padding: "0 32px",
            overflow: "hidden",
          }}>
            {/* Text */}
            <div style={{ flexShrink: 0, width: "212px", display: "flex", flexDirection: "column", gap: S.tight }}>
              <p style={{ ...T.display, color: "var(--foreground)", margin: 0 }}>
                Stay connected with your machine
              </p>
              <p style={{ ...T.body, color: "var(--foreground)", margin: 0 }}>
                Operator's view
              </p>
            </div>
            {/* Phone image */}
            <div style={{ flexShrink: 0, width: "240px", height: "526px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: "8.82px", top: "33.84px", width: "222px", height: "458px" }}>
                <img
                  src={imgCoactOperatorHome}
                  alt="Operator home"
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "223px", height: "459px", objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Card 2 — Mechanic's view */}
          <div style={{
            flexShrink: 0,
            width: "724px",
            height: "526px",
            background: "var(--coact-card-bg)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "30px",
            paddingLeft: "32px",
            overflow: "hidden",
          }}>
            {/* Text */}
            <div style={{ flexShrink: 0, width: "212px", display: "flex", flexDirection: "column", gap: S.tight }}>
              <p style={{ ...T.display, color: "var(--foreground)", margin: 0 }}>
                Synced information for the jobs
              </p>
              <p style={{ ...T.body, color: "var(--foreground)", margin: 0 }}>
                Mechanic's view
              </p>
            </div>
            {/* Image wrapper — fills remaining width, vertically centers 627×450 image */}
            <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: "627px", height: "450px", position: "relative" }}>
                <img
                  src={imgCoactHome}
                  alt="Mechanic home"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Card 3 — Proactive diagnosis */}
          <div style={{
            flexShrink: 0,
            width: "580px",
            height: "526px",
            background: "var(--coact-card-bg)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            paddingLeft: "48px",
            paddingTop: "32px",
            paddingBottom: "0",
            overflow: "hidden",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.tight }}>
              <p style={{ ...T.display, color: "var(--foreground)", margin: 0, width: "212px" }}>
                Support a more proactive diagnosis
              </p>
              <p style={{ ...T.body, color: "var(--foreground)", margin: 0 }}>
                Gather more information
              </p>
            </div>
            {/* Dashboard image — 586×421 */}
            <div style={{ flexShrink: 0, width: "586px", height: "421px", overflow: "hidden", position: "relative" }}>
              <img
                src={imgCoactDashboard}
                alt="Dashboard"
                style={{ position: "absolute", inset: 0, width: "586px", height: "421px", objectFit: "cover", pointerEvents: "none" }}
              />
            </div>
          </div>

          {/* Card 4 — Explainable AI */}
          <div style={{
            flexShrink: 0,
            width: "682px",
            height: "526px",
            background: "var(--coact-card-bg)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            padding: "32px 48px 0 48px",
            overflow: "hidden",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: S.tight, alignItems: "center", width: "212px" }}>
              <p style={{ ...T.display, color: "var(--foreground)", margin: 0, textAlign: "center" }}>
                Explainable AI for troubleshooting
              </p>
              <p style={{ ...T.body, color: "var(--foreground)", margin: 0, textAlign: "center", whiteSpace: "nowrap" }}>
                Trust human experience
              </p>
            </div>
            {/* SmartAI image — 586×421 */}
            <div style={{ flexShrink: 0, width: "586px", height: "421px", overflow: "hidden", position: "relative" }}>
              <img
                src={imgCoactSmartAI}
                alt="Smart AI"
                style={{ position: "absolute", inset: 0, width: "586px", height: "421px", objectFit: "cover", pointerEvents: "none" }}
              />
            </div>
          </div>

          </div>{/* end strip */}
        </div>{/* end sticky inner */}
      </div>{/* end wrapper */}

      {/* ── Phone feature block ── */}
      <div style={{ marginBottom: S.block, paddingTop: "48px" }}>
        <p style={{ ...T.body, opacity: 0.8, marginBottom: "0px", maxWidth: "640px" }}>
          Stay communicating with each other about the machine issues
        </p>
      

        {/* Two-col: left card + right text */}
        <div className="phone-feature-row" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: S.gap }}>

          {/* Left: phone mockup card */}
          <div
            className="phone-feature-card"
            style={{
              flexShrink: 0,
              width: "526px",
              height: "526px",
              //background: "var(--coact-card-bg)",
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              contain: "paint",
              marginBottom:"40px",
            }}
          >
            {/* Scene container — scales with card height, phone overflows bottom (clipped by overflow:hidden) */}
            <div style={{ position: "relative", width: "368.315px", height: "807.224px", flexShrink: 0 }}>

              {/* iPhone frame — behind the video */}
              <img
                src={imgIPhone15Pro}
                alt="iPhone 15 Pro frame"
                style={{
                  position: "absolute",
                  left: "13.53px",
                  top: "51.53px",
                  width: "340.736px",
                  height: "702.133px",
                  pointerEvents: "none",
                }}
              />

              {/* Video — on top, fills screen with matching border-radius */}
              <video
                src="https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/coact_operatereport.mp4"
                muted
                loop
                playsInline
                autoPlay
                style={{
                  position: "absolute",
                  left: "27.62px",
                  top: "64.05px",
                  width: "311.777px",
                  height: "674.717px",
                  objectFit: "cover",
                  borderRadius: "26.089px",
                  pointerEvents: "none",
                }}
              />

            </div>
          </div>

          {/* Right: description text */}
          <div className="phone-feature-text" style={{ flex: 1 }}>
            <p style={{ ...T.body, margin: 0, maxWidth: "480px", color: "var(--foreground)" }}>
              <span style={{ fontWeight: 500 }}>Report issues in seconds. </span>
              <span style={{ fontWeight: 300, opacity: 0.8 }}>Operators can create a service ticket by simple clicks, share machine data and recent activity with the mechanics.</span>
            </p>
          </div>

        </div>
      </div>

{/* ── Collaborative interface feature blocks ── */}
      <div style={{ marginBottom: S.block, display: "flex", flexDirection: "column", gap: S.component }}>

        {/* Sub-header */}
        <p style={{ ...T.body, opacity: 0.8, margin: 0, maxWidth: "640px" }}>
          Optimise mechanics' workflow with a collaborative interface
        </p>

        {/* Block 1: iPad + prognosis video */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: isMobile ? 0 : "0 32px" }}>
          <div style={{ width: "100%", maxWidth: isMobile ? undefined : "683px", display: "flex", flexDirection: "column", gap: S.inner }}>
            <div style={{ borderRadius: "24px", overflow: "hidden", contain: "paint", aspectRatio: "683 / 490", position: "relative" }}>
              {/* Clip container — matches iPad screen area */}
              <div style={{ position: "absolute", left: "3.59%", top: "5.02%", width: "92.83%", height: "90.20%", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "-7.10%", top: "-6.47%", width: "113.72%", height: "113.57%", borderRadius: "11px", overflow: "hidden" }}>
                  <video
                    src="https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/coact_prognosis.mp4"
                    muted loop playsInline autoPlay
                    style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                  />
                </div>
              </div>
              <img src={imgIPadPro11} alt="iPad Pro 11" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
            </div>
            <p style={{ ...T.body, margin: 0, color: "var(--foreground)" }}>
              <span style={{ fontWeight: 500 }}>Run a proactive diagnosis. </span>
              <span style={{ fontWeight: 300, opacity: 0.8 }}>Component-level visualisation helps mechanics quickly identify where issues might occur. The goal is to get more accurate troubleshooting before go into the field.</span>
            </p>
          </div>
        </div>

        {/* Block 2: iPad + smartai video */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: isMobile ? 0 : "0 32px" }}>
          <div style={{ width: "100%", maxWidth: isMobile ? undefined : "683px", display: "flex", flexDirection: "column", gap: S.inner }}>
            <div style={{ borderRadius: "24px", overflow: "hidden", contain: "paint", aspectRatio: "683 / 490", position: "relative" }}>
              <div style={{ position: "absolute", left: "3.59%", top: "5.02%", width: "92.83%", height: "90.20%", borderRadius: "11px", overflow: "hidden" }}>
                <video
                  src="https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/coact_smartai.mp4"
                  muted loop playsInline autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                />
              </div>
              <img src={imgIPadPro11} alt="iPad Pro 11" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
            </div>
            <p style={{ ...T.body, margin: 0, color: "var(--foreground)" }}>
              <span style={{ fontWeight: 500 }}>AI-assisted troubleshooting. </span>
              <span style={{ fontWeight: 300, opacity: 0.8 }}>Instead of presenting a single AI-generated answer, Co-Act reveals the reasoning process behind potential causes. Signals, inspection records, and historical faults are connected through a visual network that helps mechanics understand how different factors relate to each other.</span>
            </p>
          </div>
        </div>

        {/* Block 3: two photo cards side by side */}
        <div style={{ display: "flex", flexDirection: "column", gap: S.inner }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: S.gap }}>
            {/* Left: office view */}
            <div style={{ flex: 1,  borderRadius: "24px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 0 : "0 32px", minHeight: isMobile ? "220px" : undefined }}>
              <div style={{ position: "relative", width: isMobile ? "100%" : "729px", height: isMobile ? "100%" : "400px", flexShrink: 0, minHeight: isMobile ? "220px" : undefined }}>
                <img src={imgCoactOfficeView} alt="Co-Act office view" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
              </div>
            </div>
            {/* Right: collab view */}
            <div style={{ flex: 1, background: "var(--coact-card-bg)", borderRadius: "24px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 0 : "0 32px", minHeight: isMobile ? "220px" : undefined }}>
              <div style={{ position: "relative", width: isMobile ? "100%" : "669px", height: isMobile ? "100%" : "400px", flexShrink: 0, overflow: "hidden", minHeight: isMobile ? "220px" : undefined }}>
                <img src={imgCoactCollabView} alt="Co-Act collab view" style={{ position: "absolute", height: "100%", left: isMobile ? 0 : "-2.18%", top: "1%", width: isMobile ? "100%" : "111.05%", objectFit: "cover", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
          <p style={{ ...T.body, margin: 0, maxWidth: "600px", color: "var(--foreground)" }}>
            <span style={{ fontWeight: 500 }}>Supporting expert judgement. </span>
            <span style={{ fontWeight: 300, opacity: 0.8 }}>Co-Act facilitates scenarios for mobile work locations and open discussions. Technology assists the process — it does not replace experience.</span>
          </p>
        </div>

      </div>

      {/* Section 5: Concept Video */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
        {/* Left 4 cols: Section title */}
        <div
          id={slugify("Concept Video")}
          className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            05 — Concept Video
          </span>
        </div>

        {/* Right 8 cols: Video player */}
        <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
          <div
              className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden relative group cursor-pointer"
              onMouseMove={cvHandleMouseMove}
              onMouseLeave={() => { if (cvPlaying) setCvShowControls(false); }}
              onClick={cvTogglePlay}
            >
              {/* YouTube IFrame API mounts here */}
              <div ref={ytContainerRef} className="w-full h-full pointer-events-none" />

              {/* Centre play button — only when paused */}
              {!cvPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/15">
                  <div className="w-16 h-16 rounded-full border border-foreground/30 flex items-center justify-center bg-background/70">
                    <Play className="w-6 h-6 text-foreground ml-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom control bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-background/80 via-background/30 to-transparent transition-opacity duration-300 ${cvShowControls || !cvPlaying ? "opacity-100" : "opacity-0"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full h-1 bg-foreground/20 mb-3 cursor-pointer group/progress" onClick={cvHandleSeek}>
                  <div className="h-full bg-foreground/70 transition-[width] duration-100 relative" style={{ width: `${cvProgress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={cvTogglePlay} className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer">
                      {cvPlaying ? <Pause className="w-3.5 h-3.5 text-foreground/80" /> : <Play className="w-3.5 h-3.5 text-foreground/80 ml-0.5" />}
                    </button>
                    <button onClick={cvToggleMute} className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer">
                      {cvMuted ? <VolumeX className="w-3.5 h-3.5 text-foreground/80" /> : <Volume2 className="w-3.5 h-3.5 text-foreground/80" />}
                    </button>
                    <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                      Co-Act — Concept Video
                    </span>
                  </div>
                  <button onClick={cvHandleFullscreen} className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer">
                    <Maximize className="w-3.5 h-3.5 text-foreground/80" />
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
