import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { ArrowUpRight } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      year: '2025',
      title: 'AGONISTIC DESIGN IN PRACTICE',
      subtitle: 'Introducing Agonism to Interaction Design Pedagogy',
      type: 'Nordes Paper 2025',
      role: 'Co-author',
      image: 'https://images.unsplash.com/photo-1704122545404-56107e7e7adf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      year: '2024',
      title: 'Obfuscation',
      subtitle: 'ThingsCon Exhibition 2024 & Waag Futurelab 2025',
      type: 'Art Installation',
      role: 'Artist',
      image: 'https://images.unsplash.com/photo-1763863044580-ed5e666415c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      year: '2024',
      title: 'Co-Act',
      subtitle: 'UX Design Awards 2024 (Nominated)',
      type: 'UX Design',
      role: 'UX Designer',
      image: 'https://images.unsplash.com/photo-1588084580191-db8604397b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16 tracking-tight text-foreground transition-colors"
        >
          Selected Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-xl mb-6 relative aspect-[4/3] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 transition-colors duration-500">
                 <img 
                   src={project.image} 
                   alt={project.title}
                   className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/60 dark:bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30 dark:border-white/20">
                    <ArrowUpRight className="w-5 h-5 text-black dark:text-white" />
                 </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-pink-500 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm font-mono text-foreground/40">{project.year}</span>
                </div>
                <p className="text-sm text-pink-500/80 uppercase tracking-wider">{project.type}</p>
                <p className="text-base text-foreground/80">{project.subtitle}</p>
                <p className="text-sm text-foreground/50">Role: {project.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
