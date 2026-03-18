import React from "react";
import { Project } from "../Projects";
import { PaperScanPrototype } from "./PaperScanPrototype";
import { PaperWritebackPrototype } from "./PaperWritebackPrototype";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

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

      <div className="mb-24">
        <PaperScanPrototype />
      </div>

      <div className="mb-24">
        <PaperWritebackPrototype />
      </div>
    </>
  );
}