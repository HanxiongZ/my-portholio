import React from "react";
import { motion } from "motion/react";
import { MousePointer2 } from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { InteractionSpectrum } from "../InteractionSpectrum";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project2_VolvoInternship({ project, slugify }: Props) {
  // ── Typography system (matches Project 3) ─────────────────────
  const T = {
    display: { fontSize: "clamp(22px, 2.5vw, 24px)", fontWeight: 350, lineHeight: 1.35 } as React.CSSProperties,
    body:       { fontSize: "16px", fontWeight: 300, lineHeight: "28px" } as React.CSSProperties,
    subheading: { fontSize: "16px", fontWeight: 500, lineHeight: "28px" } as React.CSSProperties,
    caption:    { fontSize: "14px", fontWeight: 300, lineHeight: "22px" } as React.CSSProperties,
    label:      { fontSize: "11px", fontFamily: "monospace", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" as const } as React.CSSProperties,
  };

  const img = {
    hero:       getContentImage(2, "hero"),
    fig01:      getContentImage(2, "fig01"),
    fig02:      getContentImage(2, "fig02"),
    fig03:      getContentImage(2, "fig03"),
    ground1:    getContentImage(2, "fig_ground_1"),
    ground2:    getContentImage(2, "fig_ground_2"),
    ground3:    getContentImage(2, "fig_ground_3"),
    fidelity1:  getContentImage(2, "fig_fidelity_1"),
    fidelity2:  getContentImage(2, "fig_fidelity_2"),
    fidelity3:  getContentImage(2, "fig_fidelity_3"),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12">

      {/* Hero Image */}
      <div className="col-span-1 md:col-span-12 aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
        <ImageWithFallback
          src={img.hero}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── 01 Background ─────────────────────────────── */}
      <div
        id={slugify("Background")}
        className="col-span-1 md:col-span-12 border-t border-foreground/10 pt-6 scroll-mt-32"
      >
        <span style={T.label} className="text-foreground/40">
          01 — Background
        </span>
      </div>

      {/* Pull quote + attribution */}
      <div className="col-span-1 md:col-span-9">
        <p style={T.display} className="text-foreground/90">
          <span className="text-foreground/40 font-serif italic pr-1">"</span>
          Haptics is to touch, as optics is to sight.
          <span className="text-foreground/40 font-serif italic pl-1">"</span>
        </p>
      </div>
      <div className="col-span-1 md:col-span-3 md:pl-6 border-l border-foreground/10 hidden md:flex md:items-center">
        <p style={T.label} className="text-foreground/60">Will Provancher</p>
      </div>

      {/* Body */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-5 mb-6">
        <p style={T.body} className="text-foreground/80 text-pretty">
          During my internship at Volvo Cars, I had the privilege of
          working within the Physical UX team. Together, we explored
          the role of physical controls in an era dominated by
          screens. My focus was on embedding tactile layers to create
          a coherent, intuitive language that bridges user intention
          with complex system behaviours.
        </p>
        
        <p style={T.body} className="text-foreground/80 text-pretty">
          Great haptic experiences go beyond simple vibrations — they
          tell meaningful stories through touch.
        </p>
      </div>

      {/* ── 02 Frame the Exploration ──────────────────── */}
      <div
        id={slugify("Frame the Exploration")}
        className="col-span-1 md:col-span-12 border-t border-foreground/10 pt-6 scroll-mt-32"
      >
        <span style={T.label} className="text-foreground/40">
          02 — Frame the Exploration
        </span>
      </div>

      {/* Interaction Spectrum — interactive, full width */}
      <div className="col-span-1 md:col-span-12">
        {/* Click hint */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <MousePointer2 className="w-5 h-5 text-foreground/50" />
          </motion.div>
          <span style={T.label} className="text-foreground/40">
            Click the buttons :)
          </span>
        </div>
        <InteractionSpectrum />
      </div>

      {/* Spectrum explanation */}
      <div className="col-span-1 md:col-span-9">
        <p style={T.body} className="text-foreground/80 text-pretty">
          This spectrum frames the interaction quality of a button,
          from digital to physical. Haptic feedback as an
          intermediate tactile layer could offer a ground for the
          hypothesis, of which we believe could bring value to the
          controls.
        </p>
      </div>

      {/* Hypothesis cards */}
      <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Hypothesis 01 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 w-full bg-foreground/[0.02] border border-foreground/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, currentColor 0.25px, transparent 1px)", backgroundSize: "8px 8px" }} />
            <svg viewBox="0 0 80 60" className="h-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <path d="M0 30 H15 V20 H25 V30 H35 V40 H45 V30 H55 V24 H65 V30 H80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span style={T.label} className="text-foreground/40">Hypothesis 01</span>
            <h3 style={T.subheading} className="text-foreground font-medium">Versatile Information</h3>
            <p style={T.caption} className="text-foreground/60 mt-1">
              Haptic feedback carries meaning through distinct patterns,
              making physical controls more expressive and versatile.
            </p>
          </div>
        </div>

        {/* Hypothesis 02 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 w-full bg-foreground/[0.02] border border-foreground/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, currentColor 0.25px, transparent 1px)", backgroundSize: "8px 8px" }} />
            <svg viewBox="0 0 80 60" className="h-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <path d="M10 30 H30 L34 26 L38 34 L42 30 H70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="38" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-50" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span style={T.label} className="text-foreground/40">Hypothesis 02</span>
            <h3 style={T.subheading} className="text-foreground font-medium">Sense of Reassurance</h3>
            <p style={T.caption} className="text-foreground/60 mt-1">
              Clear tactile feedback builds confidence and safety,
              confirming interactions without requiring visual attention.
            </p>
          </div>
        </div>

        {/* Hypothesis 03 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 w-full bg-foreground/[0.02] border border-foreground/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, currentColor 0.25px, transparent 1px)", backgroundSize: "8px 8px" }} />
            <svg viewBox="0 0 40 60" className="w-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <path d="M20 15 L22.5 27.5 L35 30 L22.5 32.5 L20 45 L17.5 32.5 L5 30 L17.5 27.5 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span style={T.label} className="text-foreground/40">Hypothesis 03</span>
            <h3 style={T.subheading} className="text-foreground font-medium">Moments of Delight</h3>
            <p style={T.caption} className="text-foreground/60 mt-1">
              Well-designed haptics enrich the driving experience,
              adding subtle moments of joy to daily interactions.
            </p>
          </div>
        </div>
      </div>

      {/* ── 03 Learning by Prototyping ────────────────── */}
      <div
        id={slugify("Learning through prototyping")}
        className="col-span-1 md:col-span-12 border-t border-foreground/10 pt-6 scroll-mt-32"
      >
        <span style={T.label} className="text-foreground/40">
          03 — Learning by Prototyping
        </span>
      </div>

      {/* Subheading + intro */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-4">
        <h3 style={T.subheading} className="text-foreground text-pretty">
          First Prototype — Quick &amp; Dirty Validation
        </h3>
        <p style={T.body} className="text-foreground/80 text-pretty">
          The exploration started with a deliberately restrained
          prototype: pairing a simple vibration module and a pressure
          sensor. This "quick and dirty" setup treated haptics as an
          added layer, allowing early insights into how a haptic button
          could influence perceived feedback and interaction quality.
        </p>
      </div>

      {/* Image grid: large left + two stacked right */}
      <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-8 gap-6 items-stretch">
        <div className="col-span-1 md:col-span-5 flex flex-col">
          <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden relative w-full flex-1 min-h-[200px] md:min-h-0">
            <ImageWithFallback
              src={img.fig01}
              alt="Prototype 01 main setup"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <p style={T.caption} className="text-foreground/50 mt-3 shrink-0">
            Mimic the button feeling by placing a pressure sensor underneath an iPhone 14.
          </p>
        </div>
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          <div>
            <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
              <ImageWithFallback src={img.fig02} alt="Tactile surface" className="w-full h-full object-cover" />
            </div>
            <p style={T.caption} className="text-foreground/50 mt-3">
              Tactile surface is needed for button feeling.
            </p>
          </div>
          <div>
            <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
              <ImageWithFallback src={img.fig03} alt="Testing with team" className="w-full h-full object-cover" />
            </div>
            <p style={T.caption} className="text-foreground/50 mt-3">
              Testing with people in the team.
            </p>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="col-span-1 md:col-span-9">
        <p style={T.body} className="text-foreground/80 text-pretty">
          The first round of prototyping showed that a haptic button
          could work — but barely. The absence of a tactile surface
          limited reassurance and influenced how people interacted with
          the button. Adding button surfaces revealed two noticeable
          findings:{" "}
          <strong className="font-semibold text-foreground">
            the shape of a button influences the applied force and
            contact duration
          </strong>
          , and short presses are difficult to convey, requiring{" "}
          <strong className="font-semibold text-foreground">
            low latency and high intensity
          </strong>
          .
        </p>
      </div>

      {/* Subheading: Grounding */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-4">
        <h3 style={T.subheading} className="text-foreground text-pretty">
          Grounding Haptics in Physical Feasibility
        </h3>
        <p style={T.body} className="text-foreground/80 text-pretty">
          This combination of hands-on testing and theoretical study
          ensured that our tuning of intensity and frequency was aligned
          precisely with user expectations — so we turned to the next
          iteration of prototyping.
        </p>
      </div>

      {/* Image grid: two stacked left + tall right */}
      <div className="col-span-1 md:col-span-12 flex gap-6 items-start mb-6">
        <div className="flex-1 border border-foreground/10 flex flex-col gap-6">
          <div className="bg-foreground/[0.03] border border-foreground/10 overflow-hidden w-full shrink-0" style={{ height: '300px' }}>
            <ImageWithFallback
              src={img.ground1}
              alt="Grounding prototype 01"
              className="w-full object-cover object-bottom"
              style={{ height: '300px', display: 'block' }}
            />
          </div>
          <div className="bg-foreground/[0.03] border border-foreground/10 overflow-hidden w-full shrink-0" style={{ height: '300px' }}>
            <ImageWithFallback
              src={img.ground2}
              alt="Grounding prototype 02"
              className="w-full object-cover object-bottom"
              style={{ height: '300px', display: 'block' }}
            />
          </div>
        </div>
        <div className="flex-1 self-stretch border border-foreground/10 overflow-hidden p-px flex flex-col">
          <div className="bg-foreground/[0.03] border border-foreground/10 flex-1 min-h-0">
            <ImageWithFallback src={img.ground3} alt="Grounding prototype 03" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── 04 Better Fidelity ────────────────────────── */}
      <div
        id={slugify("Better fidelity")}
        className="col-span-1 md:col-span-12 border-t border-foreground/10 pt-6 scroll-mt-32"
      >
        <span style={T.label} className="text-foreground/40">
          04 — Better Fidelity for Communication
        </span>
      </div>

      {/* Subheading + body */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-4">
        <h3 style={T.subheading} className="text-foreground">
          Solid Ground for Designing Haptic Patterns
        </h3>
        <p style={T.body} className="text-foreground/80 text-pretty">
          Higher-fidelity prototypes using 3D-printed physical buttons
          examined how form, material, and structural constraints ground
          haptic feedback in physically feasible interactions — and made
          us ready to create haptic patterns from this setup.
        </p>
      </div>

      {/* Image grid: large left + smaller right */}
      <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-8 gap-6 items-stretch">
        <div className="col-span-1 md:col-span-5 flex flex-col">
          <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full" style={{ height: '400px' }}>
            <ImageWithFallback
              src={img.fidelity1}
              alt="Selected haptic engines"
              className="w-full object-cover object-bottom"
              style={{ height: '400px', display: 'block' }}
            />
          </div>
          <p style={T.caption} className="text-foreground/50 mt-3 shrink-0">
            Selected two of the best haptic engines.
          </p>
        </div>
        <div className="col-span-1 md:col-span-3 flex flex-col">
          <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full" style={{ height: '400px' }}>
            <ImageWithFallback
              src={img.fidelity2}
              alt="Hapticlabs kit"
              className="w-full object-cover object-bottom"
              style={{ height: '400px', display: 'block' }}
            />
          </div>
          <p style={T.caption} className="text-foreground/50 mt-3 shrink-0">
            Create patterns with the Hapticlabs kit.
          </p>
        </div>
      </div>

      {/* Subheading: Experienced prototype */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-4">
        <h3 style={T.subheading} className="text-foreground">
          Experienced Prototype for Creating Dialogue
        </h3>
        <p style={T.body} className="text-foreground/80 text-pretty">
          Once the prototypes reached a level of fidelity that clearly
          communicated our design intent, they became powerful
          communication tools. We invited the broader team to experience
          the interactions, transforming abstract haptic concepts into a
          shared reality. This hands-on evaluation sparked meaningful
          discussions and provided crucial feedback to further refine
          the nuances of touch.
        </p>
      </div>

      {/* Full-width image */}
      <div className="col-span-1 md:col-span-12 mb-6">
        <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-video">
          <ImageWithFallback src={img.fidelity3} alt="Experienced prototype session" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ── 05 Special Thanks ─────────────────────────── */}
      <div
        id={slugify("special thanks")}
        className="col-span-1 md:col-span-12 border-t border-foreground/10 pt-6 scroll-mt-32"
      >
        <span style={T.label} className="text-foreground/40">
          05 — Special Thanks
        </span>
      </div>

      <div className="col-span-1 md:col-span-9">
        <p style={T.body} className="text-foreground/80 text-pretty">
          Special thanks to Bas Bruining, Niklas Hedlund, Sophie
          Tresler and the whole Car UX Team who supported me throughout
          this project.
        </p>
      </div>

    </div>
  );
}
