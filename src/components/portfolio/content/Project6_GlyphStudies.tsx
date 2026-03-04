import React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage } from "../projectImages";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project6_GlyphStudies({ project, slugify }: Props) {
  const img = {
    hero:  getContentImage(6, "hero"),
    fig01: getContentImage(6, "fig01"),
  };

  return (
    <>
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback
          src={img.hero}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {project.toc && project.toc.length > 0 ? (
        project.toc.map((section, index) => (
          <div
            key={section}
            className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24"
          >
            {/* Left 4 cols: Section title */}
            <div
              id={slugify(section)}
              className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
            >
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                0{index + 1} — {section}
              </span>
            </div>

            {/* Right 8 cols: Content */}
            <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
              <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                {index === 0 ? project.content : project.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
          <div className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
              01 — Overview
            </span>
          </div>
          <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
            <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
              {project.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}