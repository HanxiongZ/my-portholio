import React from "react";
import { Project } from "../Projects";
import { AudioDome } from "./AudioDome";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

// ── Asset slots ───────────────────────────────────────────────────────────────
const VIDEO_OLD_INTERFACE = "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/holoaudio_interface_old.mp4";
const VIDEO_NEW_INTERFACE = "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/holoaudio_interfacevideo.mp4";
import imgConcept1 from "../../../assets/holoaudio_concept1.jpg";
import imgConcept2 from "../../../assets/holoaudio_concept2.jpg";
import imgConcept3 from "../../../assets/holoaudio_concept3.jpg";
// ─────────────────────────────────────────────────────────────────────────────

export function Project5_SilentForm({ project: _project, slugify }: Props) {
  const scrollToPrototype = () => {
    const el = document.getElementById(slugify("Prototype"));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const body: React.CSSProperties = { fontSize: "16px", fontWeight: 300, lineHeight: "28px" };
  const medium: React.CSSProperties = { fontSize: "16px", fontWeight: 500, lineHeight: "28px", letterSpacing: "-0.16px" };

  return (
    <>
      {/* ── PROTOTYPE ────────────────────────────────────────────────────── */}
      <div id={slugify("Prototype")} style={{ marginBottom: "64px" }}>
        <AudioDome />
      </div>

      {/* ── 01 SPATIAL INTERACTIVE INTERFACE ─────────────────────────────── */}
      <div id={slugify("Spatial Interface")} className="border-t border-foreground/10 pt-8 mb-6 scroll-mt-32">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          01 — Spatial Interface
        </span>
      </div>

      {/* Two-column content — exact Figma layout, h=619px — DESKTOP ONLY */}
      <div className="relative mb-16 hidden md:block" style={{ height: "619px" }}>

        {/* Right column — old interface video: left=678, top=1, w=281 */}
        <div className="absolute overflow-hidden" style={{ left: "678px", top: "1px", width: "281px", borderRadius: "12px" }}>
          <video src={VIDEO_OLD_INTERFACE} autoPlay loop muted playsInline className="w-full block" />
        </div>

        {/* Intro text: top=0, w=650 */}
        <div className="absolute opacity-80" style={{ left: 0, top: 0 }}>
          <p className="text-foreground" style={{ ...body, width: "650px" }}>
            While working on ColorOS, Audio settings UX was part of my job. One
            of a new features 'Holo-Audio'(空间音频) needs to have a interface
            to control the spatial positions of the audio sources.
          </p>
        </div>

        {/* "Expression for the audio space": top=191.59 */}
        <div className="absolute opacity-80" style={{ left: 0, top: "191.59px" }}>
          <p className="text-foreground" style={medium}>Expression for the audio space</p>
        </div>
        {/* Expression accent bar: left=242, top=195.59, 4×20 */}
        <div className="absolute bg-foreground rounded-sm" style={{ left: "242px", top: "195.59px", width: "4px", height: "20px" }} />

        {/* Right accent bar 1: left=646, top=104.59, 4×247 */}
        <div className="absolute bg-foreground/40 rounded-sm" style={{ left: "646px", top: "104.59px", width: "4px", height: "247px" }} />

        {/* Connector line 1: left=270, top=206.59, w=356 */}
        <div className="absolute border-t border-foreground/20" style={{ left: "270px", top: "206.59px", width: "356px" }} />

        {/* Image pair: left=0 and left=165, top=237.59, 152×120 */}
        <div className="absolute overflow-hidden" style={{ left: 0, top: "237.59px", width: "152px", height: "120px" }}>
          <img src={imgConcept2} alt="Audio space concept" className="w-full h-full object-cover" />
        </div>
        <div className="absolute overflow-hidden" style={{ left: "165px", top: "237.59px", width: "152px", height: "120px" }}>
          <img src={imgConcept1} alt="Holo Audio concept" className="w-full h-full object-cover" />
        </div>

        {/* Caption 1: top=363.59, w=315 */}
        <div className="absolute opacity-80" style={{ left: "1px", top: "363.59px" }}>
          <p className="text-foreground" style={{ ...body, width: "315px" }}>
            Perspective and subtle guide lines provide a sense of spatial placement
          </p>
        </div>

        {/* "Control interface": top=468.59 */}
        <div className="absolute opacity-80" style={{ left: 0, top: "468.59px" }}>
          <p className="text-foreground" style={medium}>Control interface</p>
        </div>
        {/* Control accent bar: left=141, top=472.59, 4×20 */}
        <div className="absolute bg-foreground rounded-sm" style={{ left: "141px", top: "472.59px", width: "4px", height: "20px" }} />

        {/* Right accent bar 2: left=646, top=375.59, 4×147 */}
        <div className="absolute bg-foreground/40 rounded-sm" style={{ left: "646px", top: "375.59px", width: "4px", height: "147px" }} />

        {/* Connector line 2: left=159, top=482.59, w=467 */}
        <div className="absolute border-t border-foreground/20" style={{ left: "159px", top: "482.59px", width: "467px" }} />

        {/* Caption 2: top=514.59, w=315 */}
        <div className="absolute opacity-80" style={{ left: "1px", top: "514.59px" }}>
          <p className="text-foreground" style={{ ...body, width: "315px" }}>
            Three sliders felt rigid and disconnected. That's the reason drives
            me for a more intuitive ways of controlling.
          </p>
        </div>

      </div>

      {/* Section 01 — MOBILE ONLY */}
      <div className="md:hidden mb-16 flex flex-col gap-6">
        {/* Intro text */}
        <p className="text-foreground opacity-80" style={body}>
          While working on ColorOS, Audio settings UX was part of my job. One
          of a new features 'Holo-Audio'(空间音频) needs to have a interface
          to control the spatial positions of the audio sources.
        </p>

        {/* Old interface video — constrained width */}
        <div className="flex justify-center">
          <div className="overflow-hidden" style={{ width: "60%", borderRadius: "12px" }}>
            <video src={VIDEO_OLD_INTERFACE} autoPlay loop muted playsInline className="w-full block" />
          </div>
        </div>

        {/* Expression heading + bar */}
        <div className="flex items-center gap-3 opacity-80">
          <p className="text-foreground" style={medium}>Expression for the audio space</p>
          <div className="bg-foreground rounded-sm flex-shrink-0" style={{ width: "4px", height: "20px" }} />
        </div>

        {/* Image pair — side by side */}
        <div className="flex gap-3">
          <div className="overflow-hidden flex-1" style={{ borderRadius: "8px", height: "120px" }}>
            <img src={imgConcept2} alt="Audio space concept" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden flex-1" style={{ borderRadius: "8px", height: "120px" }}>
            <img src={imgConcept1} alt="Holo Audio concept" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Caption 1 */}
        <p className="text-foreground opacity-80" style={body}>
          Perspective and subtle guide lines provide a sense of spatial placement
        </p>

        {/* Divider */}
        <div className="border-t border-foreground/10" />

        {/* Control interface heading + bar */}
        <div className="flex items-center gap-3 opacity-80">
          <p className="text-foreground" style={medium}>Control interface</p>
          <div className="bg-foreground rounded-sm flex-shrink-0" style={{ width: "4px", height: "20px" }} />
        </div>

        {/* Caption 2 */}
        <p className="text-foreground opacity-80" style={body}>
          Three sliders felt rigid and disconnected. That's the reason drives
          me for a more intuitive ways of controlling.
        </p>
      </div>

      {/* ── 02 REDESIGNED INTERACTION ─────────────────────────────────────── */}
      <div id={slugify("Redesigned Interaction")} className="border-t border-foreground/10 pt-8 mb-6 scroll-mt-32">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
          02 — Redesigned Interaction
        </span>
      </div>

      <p className="text-foreground/80 mb-16 w-full md:w-[650px]" style={body}>
        I rethought the interaction model by reducing the dimensional choices
        users have to make. By guiding users along spatial trajectories, the
        experience becomes more intuitive and less complex.
      </p>

      {/* Phone mockup + annotations + screenshot — DESKTOP ONLY */}
      <div className="relative mb-16 hidden md:block" style={{ minHeight: "560px" }}>
        {/* Phone video mockup */}
        <div
          className="overflow-hidden bg-foreground/5 border border-foreground/10"
          style={{ width: "332px", height: "522px", borderRadius: "14.7px", padding: "0.935px" }}
        >
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: "14.7px" }}>
            <video src={VIDEO_NEW_INTERFACE} autoPlay loop muted playsInline className="w-full block" />
          </div>
        </div>

        {/* Balance label */}
        <div
          className="absolute border border-foreground/10 opacity-80"
          style={{ left: "660px", top: "1px", padding: "12px 24px", borderRadius: "4px" }}
        >
          <span className="text-foreground whitespace-nowrap" style={body}>
            Balance the explicit and user need
          </span>
        </div>

        {/* Slicing the space */}
        <div
          className="absolute border border-foreground/10 opacity-80"
          style={{ right: "346px", top: "71px", padding: "12px 24px", borderRadius: "4px" }}
        >
          <span className="text-foreground whitespace-nowrap" style={body}>Slicing the space</span>
        </div>

        {/* Drag the audio source */}
        <div
          className="absolute border border-foreground/10 opacity-80"
          style={{ right: "310px", top: "148px", padding: "12px 24px", borderRadius: "4px" }}
        >
          <span className="text-foreground whitespace-nowrap" style={body}>Drag the audio source</span>
        </div>

        {/* Prototype screenshot */}
        <div
          className="absolute overflow-hidden"
          style={{ width: "297px", height: "297px", right: 0, top: "225px", borderRadius: "12px" }}
        >
          <img src={imgConcept3} alt="Holo Audio prototype" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Section 02 — MOBILE ONLY */}
      <div className="md:hidden mb-16 flex flex-col gap-6">
        {/* Phone mockup centered */}
        <div className="flex justify-center">
          <div
            className="overflow-hidden bg-foreground/5 border border-foreground/10"
            style={{ width: "min(332px, 100%)", borderRadius: "14.7px", padding: "0.935px" }}
          >
            <div className="w-full overflow-hidden" style={{ borderRadius: "14.7px" }}>
              <video src={VIDEO_NEW_INTERFACE} autoPlay loop muted playsInline className="w-full block" />
            </div>
          </div>
        </div>

        {/* Annotation chips stacked */}
        <div className="flex flex-col gap-2">
          {["Balance the explicit and user need", "Slicing the space", "Drag the audio source"].map((label) => (
            <div
              key={label}
              className="border border-foreground/10 opacity-80 self-start"
              style={{ padding: "10px 20px", borderRadius: "4px" }}
            >
              <span className="text-foreground" style={body}>{label}</span>
            </div>
          ))}
        </div>

        {/* Screenshot full width */}
        <div className="overflow-hidden w-full" style={{ borderRadius: "12px", aspectRatio: "1/1" }}>
          <img src={imgConcept3} alt="Holo Audio prototype" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Second description */}
      <p className="text-foreground/80 mb-16 w-full md:w-[650px]" style={body}>
        The interaction felt intuitive, but sensitive to mismatch. Even small
        gaps between user intent and feedback could create huge frustration. So
        I spent time on playing around how to better anticipating spatial
        intent, exploring this through vibe coding.
      </p>

      {/* ── Vibe coding process log ───────────────────────────────────────── */}
      <div
        style={{
          marginBottom: "64px",
          fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
          fontSize: "13px",
          lineHeight: "22px",
          background: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          <span style={{ marginLeft: "8px", color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "0.05em" }}>
            design process · spatial interaction
          </span>
        </div>

        {/* User prompt */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", marginRight: "10px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>
            Near the vertex, movement increasingly aligns with the circle's tangent — essentially horizontal. So maybe
            loosen the horizontal threshold near the top: when tangent angle is large, vertical gesture follows;
            when small, horizontal gesture helps predict whether the user wants the dot to go forward or backward.
          </span>
        </div>

        {/* Response */}
        <div style={{ padding: "20px 20px 24px", color: "rgba(255,255,255,0.65)" }}>
          <p style={{ marginBottom: "16px" }}>
            Your analysis is accurate. From the camera angle, the arc's tangent at the vertex approaches
            horizontal — so pure vertical gesture can't smoothly navigate near the vertex. This is geometrically inevitable.
          </p>

          <p style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "10px" }}>Tangent Following</p>
          <p style={{ marginBottom: "8px" }}>Arc tangent direction at angle θ (screen space):</p>
          <p style={{ marginBottom: "4px" }}>
            {'— Vertical   ∝ '}<span style={{ color: "#60a5fa" }}>cos(θ)</span>{'  — front/back axis (max at θ=0 or π)'}
          </p>
          <p style={{ marginBottom: "16px" }}>
            {'— Horizontal ∝ '}<span style={{ color: "#60a5fa" }}>sin(θ)</span>{'  — max near the vertex'}
          </p>

          <p style={{ marginBottom: "10px" }}>Unified gesture-to-angle formula:</p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "rgba(255,255,255,0.85)" }}>
            dAngle = (−deltaY × <span style={{ color: "#60a5fa" }}>cos(θ)</span> + deltaX × C × <span style={{ color: "#60a5fa" }}>sin(θ)</span>) / sensitivity
          </div>

          <p style={{ marginBottom: "4px" }}>— θ ≈ 0 or π{'  '}→{'  '}only deltaY active, horizontal inert{'  '}→{'  '}no accidental track switch</p>
          <p style={{ marginBottom: "4px" }}>— θ ≈ π/2{'    '}→{'  '}only deltaX active, vertical inert{'   '}→{'  '}natural horizontal pass at vertex</p>
          <p style={{ marginBottom: "20px" }}>— middle region{'  '}→{'  '}both blend smoothly</p>

          <p style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "10px" }}>
            Vertex Direction Judgment{'  '}
            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(resolves "which way to slide")</span>
          </p>
          <p style={{ marginBottom: "20px" }}>
            Horizontal direction encodes passing the vertex from the front vs. the back.
            Combine with{' '}<span style={{ color: "#34d399" }}>onBackSide</span>{' '}to flip the horizontal
            component's sign — so "slide right" always maps to the same screen direction from the camera's view.
          </p>

          <p style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "10px" }}>With snap-through</p>
          <p style={{ marginBottom: "20px" }}>
            When θ enters ±0.2 rad of the vertex with sufficient velocity
            {'  ('}<span style={{ color: "#fbbf24" }}>velocity {'>'} threshold</span>{')  '}
            — auto-snap to the other side, preventing dead-zone stalls at the top.
          </p>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px", color: "rgba(255,255,255,0.4)" }}>
            This approach is more principled than all prior versions because it derives from physical geometry, not hardcoded rules.
          </div>
        </div>
      </div>

      {/* Explore Prototype CTA */}
      <div className="flex justify-center" style={{ marginBottom: "80px" }}>
        <button
          onClick={scrollToPrototype}
          className="bg-foreground text-background"
          style={{ padding: "12px 24px", fontSize: "16px", fontWeight: 500, lineHeight: "28px", cursor: "pointer", border: "none" }}
        >
          Explore Prototype ✨
        </button>
      </div>
    </>
  );
}
