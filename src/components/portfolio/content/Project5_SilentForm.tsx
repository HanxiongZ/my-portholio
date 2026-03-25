import React from "react";
import { Project } from "../Projects";
import { AudioDome } from "./AudioDome";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project5_SilentForm({ project, slugify }: Props) {
  const T = {
    body:    { fontSize: "16px", fontWeight: 300, lineHeight: "28px" } as React.CSSProperties,
    caption: { fontSize: "14px", fontWeight: 300, lineHeight: "22px" } as React.CSSProperties,
    label:   { fontSize: "11px", fontFamily: "monospace", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" as const } as React.CSSProperties,
  };

  // Fill in once uploaded:
  // const demoVideoSrc = "https://your-cdn.com/holo-audio-demo.mp4";
  const demoVideoSrc: string | undefined = undefined;

  const Placeholder = ({ ratio = "16/9", label = "Image — Coming Soon" }: { ratio?: string; label?: string }) => (
    <div
      className="w-full bg-foreground/5 border border-foreground/10 flex items-center justify-center"
      style={{ aspectRatio: ratio }}
    >
      <span style={{ ...T.label, opacity: 0.3 }}>{label}</span>
    </div>
  );

  return (
    <>
      {/* ── PROTOTYPE ────────────────────────────────────────────── */}
      <div style={{ marginBottom: "64px" }}>
        <AudioDome />
      </div>

      {/* ── 01 BACKGROUND ────────────────────────────────────────── */}
      <div
        id={slugify("Background")}
        className="border-t border-foreground/10 pt-6 mb-6 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          01 — Background
        </span>
      </div>

      <p style={{ ...T.body, opacity: 0.8, marginBottom: "24px" }}>
        Originally designed at OPPO, this feature lets users place audio sources
        spatially — making sound feel like something you can reach out and move.
      </p>

      <div style={{ marginBottom: "64px" }}>
        <Placeholder ratio="3/2" />
      </div>

      {/* ── 02 DESIGN ────────────────────────────────────────────── */}
      <div
        id={slugify("Design")}
        className="border-t border-foreground/10 pt-6 mb-6 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          02 — Design
        </span>
      </div>

      <p style={{ ...T.body, opacity: 0.8, marginBottom: "24px" }}>
        Each source maps to a point on a 3D dome. HRTF spatialization renders
        the position in real time through headphones.
      </p>

      {/* Full-width design shot */}
      <div style={{ marginBottom: "16px" }}>
        <Placeholder ratio="3/2" />
      </div>

      {/* 2-col detail shots */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "64px" }}>
        <Placeholder ratio="4/3" />
        <Placeholder ratio="4/3" />
      </div>

      {/* ── 03 DEMO ──────────────────────────────────────────────── */}
      <div
        id={slugify("Demo")}
        className="border-t border-foreground/10 pt-6 mb-6 scroll-mt-32"
      >
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          03 — Demo
        </span>
      </div>

      <p style={{ ...T.body, opacity: 0.8, marginBottom: "24px" }}>
        Best experienced with headphones.
      </p>

      <div style={{ marginBottom: "64px" }}>
        {demoVideoSrc ? (
          <div className="w-full bg-black border border-foreground/10 overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <video src={demoVideoSrc} controls playsInline className="w-full h-full object-cover" />
          </div>
        ) : (
          <Placeholder ratio="16/9" label="Demo Video — Coming Soon" />
        )}
      </div>
    </>
  );
}
