import React from 'react';
import { motion } from 'motion/react';
import { PortfolioArrow } from './PortfolioArrow';

interface ResumeItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  location?: string;
  description?: string;
  link?: string;
  type?: string;
}

const experiences: ResumeItem[] = [
  {
    id: 'exp-1',
    year: '2025',
    title: 'Physical UX Design Intern',
    subtitle: 'Volvo Cars',
    location: 'Göteborg',
    description: 'Haptics & Physical Interaction',
  },
  {
    id: 'exp-2',
    year: '2023',
    title: 'UX Designer',
    subtitle: 'OPPO',
    location: 'Shenzhen',
    description: 'ColorOS Multimedia & Productivity',
  },
];

const education: ResumeItem[] = [
  {
    id: 'edu-1',
    year: '2023 - Now',
    title: 'MFA Interaction Design',
    subtitle: 'Umeå Institute of Design',
    location: 'Umeå',
  },
  {
    id: 'edu-2',
    year: '2016 - 2020',
    title: 'BE Industrial Design',
    subtitle: 'South China Univ. of Tech',
    location: 'Guangzhou',
  },
];

const awards: ResumeItem[] = [
    {
    id: 'exh-1',
    year: '2025',
    title: 'Waag Futurelab 2025',
    subtitle: 'Exhibition',
    link: 'https://waag.org/en/event/hyperlink/',
  },
  {
    id: 'awd-2',
    year: '2024',
    title: 'UX Design Awards (Nominated)',
    subtitle: 'New Talent',
    link: 'https://ux-design-awards.com/winners/2024-2-co-act',
  },
];

const publications: ResumeItem[] = [
  {
    id: 'pub-1',
    year: '2025',
    title: 'Agonistic Design In Practice',
    subtitle: 'Co-author',
    link: 'https://www.researchgate.net/publication/394095129_Agonistic_Design_In_Practice_Introducing_Agonism_to_Interaction_Design_Pedagogy',
  },
];

const exhibitions: ResumeItem[] = [
  {
    id: 'exh-2',
    year: '2024',
    title: 'ThingsCon Exhibition',
    subtitle: 'Exhibition',
    location: 'Amsterdam',
    link: 'https://thingscon.org/media/',
  },
];

// Flattened Recognition List
const recognition = [
  { type: 'Exh', ...awards[0] },
  { type: 'Award', ...awards[1] },
  { type: 'Pub', ...publications[0] },
  { type: 'Exh', ...exhibitions[0] },
];

const ExperienceItem = ({ item }: { item: ResumeItem }) => {
  const isLink = !!item.link;

  if (isLink) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group recognition-link portfolio-arrow-context block py-3 px-0 hover:bg-foreground hover:text-background hover:px-3 hover:-mx-3 transition-all duration-300 cursor-pointer backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-baseline">
          {/* Year */}
          <div className="col-span-1 md:col-span-1">
            <span className="type-resume-meta font-mono text-foreground/40 group-hover:text-background/60 transition-colors uppercase">
              {item.year}
            </span>
          </div>
          
          {/* Title */}
          <div className="col-span-1 md:col-span-3">
             <h3 className="type-resume-title group-hover:text-background transition-colors">
               {item.title}
             </h3>
          </div>

          {/* Details */}
          <div className="col-span-1 md:col-span-4 flex justify-between items-baseline">
             <div className="flex items-center gap-2">
               <span className="type-resume-detail text-foreground/70 group-hover:text-background/80 transition-colors">
                 {item.subtitle}
               </span>
               {item.type && (
                 <span className="type-resume-secondary hidden sm:inline-block font-mono text-foreground/30 group-hover:text-background/40 transition-colors uppercase border border-foreground/10 group-hover:border-background/20 px-1 rounded">
                   {item.type}
                 </span>
               )}
             </div>
             <PortfolioArrow direction="up" />
           </div>
        </div>
      </a>
    );
  }

  // Static Item (Work / Education)
  return (
    <div className="block border-t border-foreground/10 py-3 px-0 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-baseline">
        {/* Year */}
        <div className="col-span-1 md:col-span-1">
          <span className="type-resume-meta font-mono text-foreground/40 uppercase">
            {item.year}
          </span>
        </div>
        
        {/* Title */}
        <div className="col-span-1 md:col-span-3">
           <h3 className="type-resume-title uppercase text-foreground">
             {item.title}
           </h3>
        </div>

        {/* Details */}
        <div className="col-span-1 md:col-span-4">
           <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
             <span className="type-resume-detail text-foreground/70">
               {item.subtitle}
             </span>
             {item.location && (
               <span className="type-resume-secondary font-mono text-foreground/40 uppercase">
                 {item.location}
               </span>
             )}
           </div>
           {item.description && (
             <p className="type-resume-description text-foreground/50 mt-1 max-w-md">
               {item.description}
             </p>
           )}
         </div>
      </div>
    </div>
  );
};

export function Experience() {
  return (
    <section id="experience" className="portfolio-experience-section relative w-full overflow-hidden">
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* --- HEADER (TOP) --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 mb-16">
           <div className="col-span-2 md:col-span-4 pl-2 md:pl-3 backdrop-blur-sm">
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="type-section-label inline-block font-mono uppercase text-foreground/40 mb-2">
                  Experience
                </span>
                <div className="h-px bg-foreground/10 w-full mt-2" />
              </motion.div>
           </div>
        </div>

        {/* --- CONTENT (RIGHT OFFSET) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6">
           {/* Offset by 4 columns to align with the 'Right Side' logic */}
           <div className="col-span-1 md:col-span-8 md:col-start-5 pl-2 md:pl-3">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-16"
              >
                
                {/* Work Experience */}
                <div>
                  <h4 className="type-subsection-label font-mono uppercase text-foreground/40 mb-4 pl-0">Work Experience</h4>
                  <div>
                    {experiences.map((item) => (
                      <ExperienceItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 className="type-subsection-label font-mono uppercase text-foreground/40 mb-4 pl-0">Education</h4>
                  <div>
                    {education.map((item) => (
                      <ExperienceItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                {/* Recognition */}
                <div>
                  <h4 className="type-subsection-label font-mono uppercase text-foreground/40 mb-4 pl-0">Recognition</h4>
                  <div>
                    {recognition.map((item) => (
                      <ExperienceItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>

              </motion.div>
           </div>
        </div>

      </div>
    </section>
  );
}
