import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function Experience() {
  const experiences = [
    {
      year: '2025',
      role: 'Physical UX Design Intern',
      company: 'Volvo Cars',
      location: 'Göteborg, Sweden',
      description: 'At Volvo, I worked in the Physical UX team. I designed and prototyped the physical interactions for the next generation of cars. I mostly worked with haptics, along with been involved with other projects like accessories and steering wheel.',
    },
    {
      year: '2023',
      role: 'UX Designer',
      company: 'OPPO',
      location: 'Shenzhen, China',
      description: 'I was a user experience designer of the multimedia tribe. My work covered photo gallery, audio settings, Omoji, and handwriting toolkit in ColorOS. I\'ve contributed to optimising foundational user experiences and developing creative concepts from versions 13.0 to 14.0.',
    },
  ];

  const education = [
    {
      year: '2023 - Now',
      role: 'MFA in Interaction Design',
      company: 'Umeå Institute of Design',
      location: 'Umeå, Sweden',
      description: 'Student of Ixd2',
    },
    {
      year: '2016 - 2020',
      role: 'BE in Industrial Design',
      company: 'South China University of Technology',
      location: 'Guangzhou, China',
      description: 'Student of Information and Interaction Design',
    },
  ];

  const Item = ({ item, index }: { item: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 last:mb-0"
    >
      <div className="md:col-span-2">
        <span className="text-sm font-mono text-foreground/50 transition-colors">{item.year}</span>
      </div>
      <div className="md:col-span-10">
        <h3 className="text-xl font-bold mb-1 text-foreground transition-colors">{item.role}</h3>
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          <span className="font-semibold text-pink-500">{item.company}</span>
          <span className="text-foreground/30 transition-colors">•</span>
          <span className="text-foreground/60 transition-colors">{item.location}</span>
        </div>
        <p className="text-foreground/70 leading-relaxed max-w-2xl transition-colors">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section id="experience" className="py-24 bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 tracking-tight text-foreground"
        >
          Work Experience
        </motion.h2>

        <div className="mb-24 max-w-5xl">
          {experiences.map((exp, index) => (
            <Item key={index} item={exp} index={index} />
          ))}
        </div>

        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 tracking-tight text-foreground"
        >
          Education
        </motion.h2>

        <div className="max-w-5xl">
          {education.map((edu, index) => (
            <Item key={index} item={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
