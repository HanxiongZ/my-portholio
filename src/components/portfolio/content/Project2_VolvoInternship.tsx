import React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { InteractionSpectrum } from "../InteractionSpectrum";
import { PressAnimation } from "../PressAnimation";
import { Project } from "../Projects";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project2_VolvoInternship({
  project,
  slugify,
}: Props) {
  // This content mirrors Project 1 for now but is a separate component for independent editing
  return (
    <>
      {/* Hero Image */}
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden">
        <ImageWithFallback
          src={project.gallery?.[5] || project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12 mb-8 md:mb-10">
        {/* 01 Divider & Header */}
        <div
          id={slugify("Background and Focus")}
          className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            01 — Background
          </span>
        </div>

        {/* Lead Text */}
        <div className="col-span-1 md:col-span-9">
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

        {/* Pull Quote - Sidebar */}
        <div className="col-span-1 md:col-span-3 md:pl-6 border-l border-foreground/10 hidden md:block">
          <p className="text-xs font-mono uppercase leading-relaxed text-foreground/60">
            Will Provancher
          </p>
        </div>

        {/* Body Text (保持 9 列，为了阅读体验) */}
        <div className="col-span-1 md:col-span-9 md:col-start-1 mb-8">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            During my internship at Volvo Cars, I explored the
            role of physical controls in an era dominated by
            screens. My focus was on embedding tactile layers to
            create a coherent, intuitive language that bridges
            user intention with complex system behaviors.
          </p>
        </div>
        {/* 注意：这里先把上面的 div 闭合了 */}

        {/* Image (独立出来，占满 12 列) */}
        <div className="col-span-1 md:col-span-12 w-full">
          <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full">
            <ImageWithFallback
              src={project.gallery?.[7] || project.image}
              alt="Prototype 01 main setup"
              className="w-full h-auto block"
            />
          </div>
          {/* 可选：加个图片注脚 */}
          <span className="block text-xs text-foreground/40 mt-2 font-mono">
            Figure 01: Setup overview
          </span>
        </div>

        {/* 02 Divider & Header */}
        <div
          id={slugify("Frame the Exploration")}
          className="col-span-1 md:col-span-8  pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            02 — Frame the Exploration
          </span>
        </div>

        {/* Body Text */}
        <div className="col-span-1 md:col-span-8 md:col-start-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Hypothesis 01: Versatile Information */}
            <div className="flex flex-col gap-3 group">
              <div className="h-32 w-full bg-foreground/1 border border-foreground/10 rounded-xs flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 0.25px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                ></div>
                <svg
                  viewBox="0 0 80 40"
                  className="w-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                >
                  <path
                    d="M0 20 H15 V10 H25 V20 H35 V30 H45 V20 H55 V14 H65 V20 H80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-1">
                  Hypothesis 01
                </h4>
                <h3 className="text-sm font-medium text-foreground">
                  Versatile Information
                </h3>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed text-pretty">
                  Haptic feedback carries meaning through
                  distinct patterns, making physical controls
                  more expressive and versatile.
                </p>
              </div>
            </div>

            {/* Hypothesis 02: Sense of Reassurance */}
            <div className="flex flex-col gap-3 group">
              <div className="h-32 w-full bg-foreground/1 border border-foreground/10 rounded-xs flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 0.25px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                ></div>
                <svg
                  viewBox="0 0 80 40"
                  className="w-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                >
                  <path
                    d="M10 20 H30 L34 16 L38 24 L42 20 H70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="38"
                    cy="20"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="opacity-50"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-1">
                  Hypothesis 02
                </h4>
                <h3 className="text-sm font-medium text-foreground">
                  Sense of Reassurance
                </h3>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed text-pretty">
                  Clear tactile feedback builds confidence and
                  safety, confirming interactions without
                  requiring visual attention.
                </p>
              </div>
            </div>

            {/* Hypothesis 03: Moments of Delight */}
            <div className="flex flex-col gap-3 group">
              <div className="h-32 w-full bg-foreground/1 border border-foreground/10 rounded-xs flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 0.25px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                ></div>
                <svg
                  viewBox="0 0 40 40"
                  className="h-1/2 text-foreground opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                >
                  <path
                    d="M20 5 L22.5 17.5 L35 20 L22.5 22.5 L20 35 L17.5 22.5 L5 20 L17.5 17.5 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-1">
                  Hypothesis 03
                </h4>
                <h3 className="text-sm font-medium text-foreground">
                  Moments of Delight
                </h3>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed text-pretty">
                  Well-designed haptics enrich the driving
                  experience, adding subtle moments of joy to
                  daily interactions.
                </p>
              </div>
            </div>
          </div>
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            The exploration was framed by three intial
            hypotheses.
          </p>
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            To explore these hypotheses, the work began with the
            simplest interaction unit: a single button.
          </p>

          <div className="w-full mb-4">
            <InteractionSpectrum />
          </div>
        </div>
      </div>

      {/* NARRATIVE SECTION - Enhanced Graphic Design Layout */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12 mb-8 md:mb-10">
        {/* Body Text */}
        <div className="col-span-1 md:col-span-5 md:col-start-1">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
            This specturm frames the interaction quality of a
            button, from digital to physical.(Feel free the
            click the buttons above)
          </p>
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            On one end, digital buttons that rely primarily on
            visual feedback; on the other,analog controls
            communicate through mechanical form and resistance.
            Haptic feedback as an intermediate tactile layer
            within the spectrum seems like a good way of
            starting the exploration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-12 mb-8 md:mb-10">
        <div
          id={slugify("Learning through prototyping")}
          className="col-span-1 md:col-span-8 pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            03 — Learning by Prototyping
          </span>
        </div>

        <div className="col-span-1 md:col-span-5 md:col-start-1">
          <h3 className="text-xs md:text-sm font-semibold md:uppercase tracking-normal md:tracking-wide text-foreground whitespace-nowrap mt-[0px] mr-[0px] mb-[24px] ml-[0px]">
            First Prototype – Bring in haptics only
          </h3>

          <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
            The exploration started with a deliberately
            restrained prototype. Rather than introducing
            haptics aggressively, a vibration module and a
            pressure sensor were added to an otherwise simple
            button setup. This approach treated haptics as an
            added layer—supporting interaction rather than
            redefining it—allowing early insights into how
            haptic button could influence perceived feedback,
            confidence, and interaction quality.
          </p>
        </div>

        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-8 gap-6 mb-8 items-stretch">
          <div className="col-span-1 md:col-span-5 flex flex-col h-full">
            <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden relative w-full flex-1 min-h-[200px] md:min-h-0">
              <ImageWithFallback
                src={project.gallery?.[0] || project.image}
                alt="Prototype 01 main setup"
                className="absolute inset-0 w-full h-full object-cover block"
              />
            </div>
            <p className="text-xs font-mono text-foreground/60 mt-3 shrink-0">
              Figure 01 — Mimic the button feeling by putting a
              pressure sensor underneath an iPhone 14.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col gap-4 h-full">
            <div>
              <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
                <ImageWithFallback
                  src={project.gallery?.[1] || project.image}
                  alt="Prototype 01 detail view"
                  className="w-full h-full object-cover block"
                />
              </div>
              <p className="text-xs font-mono text-foreground/60 mt-3">
                Figure 02 — Tactile surface is needed for button
                feeling.
              </p>
            </div>

            <div>
              <div className="border border-foreground/10 bg-foreground/[0.03] overflow-hidden w-full aspect-[2/1]">
                <ImageWithFallback
                  src={project.gallery?.[2] || project.image}
                  alt="Prototype 01 interaction test"
                  className="w-full h-full object-cover block"
                />
              </div>
              <p className="text-xs font-mono text-foreground/60 mt-3">
                Figure 03 — Testing with people in the team
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-5 md:col-start-1">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-8">
            The first round of prototyping showed that a haptic
            button could work(barely). But the absence of
            tactile surface limited reassurance and influence
            how people interact with the button. So button
            surfaces were added as well. While testing, two of
            the findings are noticeable, that{" "}
            <strong className="font-semibold text-foreground">
              the shape of a button will influnce the force and
              touching time
            </strong>{" "}
            on the button. Short pressing is tricky to precive
            haptics for requiring{" "}
            <strong className="font-semibold text-foreground">
              low latency and large intensity
            </strong>
            .
          </p>

          <h3 className="text-xs md:text-sm font-semibold md:uppercase tracking-normal md:tracking-wide text-foreground whitespace-nowrap mt-[0px] mr-[0px] mb-[24px] ml-[0px]">
            Grounding Haptics in Physical Feasibility
          </h3>

          <p className="text-base leading-7 font-light text-foreground/80 text-pretty mb-6">
            These findings informed the next iteration, shifting
            the focus from adding haptics to shaping how haptics
            are physically mediated. Instead of treating
            vibration as an isolated effect, the work began to
            examine how form, material, and structural
            constraints ground haptic feedback in physically
            feasible interaction.
          </p>

          <div className="aspect-video w-full  overflow-hidden">
            <PressAnimation />
          </div>
        </div>

        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-8 mb-4">
          <div className="aspect-video w-full  overflow-hidden">
            <PressAnimation />
          </div>

          <div className="aspect-video w-full relative border border-foreground/10 overflow-hidden bg-background/50">
            <ImageWithFallback
              src={project.gallery?.[1] || project.image}
              alt="Real Prototype"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase bg-background/80 backdrop-blur px-2 py-1 text-foreground/60 border border-foreground/5">
              Physical Prototype
            </div>
          </div>
        </div>
      </div>
    </>
  );
}