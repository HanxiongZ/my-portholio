import React from "react";
import { Project } from "../Projects";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

const CHAPTERS = [
  {
    num: "01",
    title: "Background & Focus",
    note: "Rural healthcare context, AI adoption patterns, long-term use",
  },
  {
    num: "02",
    title: "Research",
    note: "Field studies, interviews, observation sessions",
  },
  {
    num: "03",
    title: "Prototyping",
    note: "Iterative design, concept development, co-design",
  },
  {
    num: "04",
    title: "Outcome",
    note: "Design implications, reflections, thesis contribution",
  },
];

export function Project1_VolvoThesis({ project }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-24 md:mb-32">
        <div className="col-span-1 md:col-span-9">
          <p className="text-xl md:text-2xl font-light text-foreground/80 leading-relaxed text-pretty mb-10">
            I'm currently working on this project, more details
            will come soon.
          </p>
        </div>
      </div>
    </>
  );
}