import React, { useRef } from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";
import imgForestryMachine from "figma:asset/imgForestryMachine.jpg";

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
        className="mb-24 md:mb-32"
        style={{ position: "relative", width: "100%", height: "570px" }}
      >
        {/* Image — bottom left */}
        <div
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
      </div>

      {/* Lead */}
      <p style={{ fontWeight: 300, fontSize: "16px", lineHeight: "28px", opacity: 0.8, marginBottom: "64px" }}>
        We spent time with the mechanics to understand how the actual work<br/>
        unfolds in the field.
      </p>

      {/* Three rows of ethnography content */}
      <div className="mb-24 md:mb-32" style={{ display: "flex", flexDirection: "column", gap: "80px" }}>

        {/* Row 1: Time + phone image + location grid */}
        <div
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef1)}
          onMouseLeave={() => handleRowLeave(videoRef1)}
        >
          {/* Left: time + caption (right-aligned) */}
          <div style={{ width: "250px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
            <p style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}></p>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0, textAlign: "right" }}>
              
            </p>
          </div>
          {/* Middle: phone video */}
          <div style={{ width: "250px", height: "250px", flexShrink: 0, overflow: "hidden", background: "rgba(250,250,250,0.05)", position: "relative" }}>
            {img.fig_navigate && img.fig_navigate !== "REPLACE_P3_FIG_NAVIGATE" ? (
              <video ref={videoRef1} src={img.fig_navigate} muted loop playsInline style={{ position: "absolute", top: "-48px", left: 0, width: "100%", height: "auto", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>
          {/* Right: blue card with location context */}
          <div style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Mechanics (Service engineer) rarely work in a single location.
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

        {/* Row 2: Blue card + description text + inspection image */}
        <div
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef2)}
          onMouseLeave={() => handleRowLeave(videoRef2)}
        >
          {/* Left: blue card */}
          <div style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", alignItems: "flex-start" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Work Happens in Harsh Conditions
            </p>
          </div>
          {/* Middle: description text */}
                   <div style={{ width: "400px", flexShrink: 0, height: "250px", overflow: "hidden", background: "rgba(250,250,250,0.05)" }}>
            {img.fig_inspection && img.fig_inspection !== "REPLACE_P3_FIG_INSPECTION" ? (
              <video ref={videoRef2} src={img.fig_inspection} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>
       
          {/* Right: inspection video */}
    <div style={{ width: "250px", flexShrink: 0, height: "250px", overflow: "hidden" }}>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              Mechanics operate outdoors, often surrounded by heavy equipment and limited infrastructure. Digital tools must compete with gloves, grease, snow, and unstable surfaces.
            </p>
          </div>
        </div>

        {/* Row 3: Quote + oil leak video + Machine Has Body */}
        <div
          style={{ display: "flex", gap: "30px", height: "250px", alignItems: "center" }}
          onMouseEnter={() => handleRowEnter(videoRef3)}
          onMouseLeave={() => handleRowLeave(videoRef3)}
        >
          {/* Left: quote */}
          <div style={{ width: "250px", flexShrink: 0, padding: "12px 16px", overflow: "hidden" }}>
            <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              "Oil Leak again, I need a new spare part."
            </p>
          </div>
          {/* Middle: oil leak video */}
          <div style={{ width: "250px", height: "250px", flexShrink: 0, overflow: "hidden", background: "rgba(250,250,250,0.05)" }}>
            {img.video_ethnography && img.video_ethnography !== "REPLACE_P3_VIDEO_ETHNOGRAPHY" ? (
              <video ref={videoRef3} src={img.video_ethnography} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Video</div>
            )}
          </div>
          {/* Right: blue card — Machine Has a "Body" */}
          <div style={{ flex: 1, height: "250px", background: "var(--brand-blue)", padding: "8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="text-foreground" style={{ fontSize: "24px", fontWeight: 300, lineHeight: "28px", margin: 0 }}>
              Machine Has a "Body"
            </p>
            <p className="text-foreground" style={{ fontSize: "16px", fontWeight: 300, lineHeight: "28px", opacity: 0.8, margin: 0 }}>
              Machines accumulate stories, previous failures, temporary fixes, and working environment all influence the next error. Yet this story is rarely captured in a single place.
            </p>
          </div>
        </div>

      </div>

      {/* Section 3: Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
        {/* Left 4 cols: Section title */}
        <div
          id={slugify("Gallery")}
          className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            03 — Gallery
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