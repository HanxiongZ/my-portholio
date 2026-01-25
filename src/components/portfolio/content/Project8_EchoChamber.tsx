import React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project8_EchoChamber({ project, slugify }: Props) {
  return (
    <>
      <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-12 mb-8 md:mb-10">
        {project.toc?.map((section, index) => (
          <React.Fragment key={index}>
            <div
              id={slugify(section)}
              className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 mb-4 scroll-mt-32"
            >
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                0{index + 1} — {section}
              </span>
            </div>

            <div className="col-span-1 md:col-span-8 md:col-start-1 mb-16">
              <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                {index === 0 ? project.content : project.description}
              </p>
            </div>
          </React.Fragment>
        ))}
         {(!project.toc || project.toc.length === 0) && (
            <div className="col-span-1 md:col-span-8 md:col-start-1">
                 <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                  {project.content}
                 </p>
            </div>
        )}
      </div>
    </>
  );
}
