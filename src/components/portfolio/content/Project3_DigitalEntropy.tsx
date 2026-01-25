import React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project3_DigitalEntropy({ project, slugify }: Props) {
  return (
    <>
      {/* Hero Image */}
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12 mb-8 md:mb-10">
        {/* Section 1: Overview */}
        <div
          id={slugify("Overview")}
          className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            01 — Overview
          </span>
        </div>
        <div className="col-span-1 md:col-span-8 md:col-start-1 mb-16">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            {project.content}
          </p>
          {project.gallery && project.gallery[0] && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={project.gallery[0]}
                alt="Overview"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Section 2: Algorithm */}
        <div
          id={slugify("Algorithm")}
          className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            02 — Algorithm
          </span>
        </div>
        <div className="col-span-1 md:col-span-8 md:col-start-1 mb-16">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            {project.description}
          </p>
          {project.gallery && project.gallery[1] && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={project.gallery[1]}
                alt="Algorithm"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Section 3: Gallery */}
        <div
          id={slugify("Gallery")}
          className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
            03 — Gallery
          </span>
        </div>
        <div className="col-span-1 md:col-span-8 md:col-start-1 mb-16">
          <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
            Additional visual explorations.
          </p>
          {project.gallery && project.gallery[2] && (
            <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mt-8">
              <ImageWithFallback
                src={project.gallery[2]}
                alt="Gallery"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
