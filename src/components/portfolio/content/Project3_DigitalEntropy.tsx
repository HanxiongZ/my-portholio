import React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project3_DigitalEntropy({ project, slugify }: Props) {
  const img = {
    hero:  getContentImage(3, "hero"),
    fig01: getContentImage(3, "fig01"),
    fig02: getContentImage(3, "fig02"),
    fig03: getContentImage(3, "fig03"),
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

      {/* Section 1: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
        {/* Left 4 cols: Section title */}
        <div
          id={slugify("Overview")}
          className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            01 — Overview
          </span>
        </div>

        {/* Right 8 cols: Content */}
        <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            {project.content}
          </p>
          {img.fig01 && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={img.fig01}
                alt="Overview"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Algorithm */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
        {/* Left 4 cols: Section title */}
        <div
          id={slugify("Algorithm")}
          className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            02 — Algorithm
          </span>
        </div>

        {/* Right 8 cols: Content */}
        <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            {project.description}
          </p>
          {img.fig02 && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={img.fig02}
                alt="Algorithm"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}
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