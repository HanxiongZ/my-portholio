import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Globe } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
// We will import the asset from figma if possible, but since I cannot easily access the raw asset url without it being in the figma_imported_code (which I don't have yet as I am creating from scratch),
// I will just use a placeholder text or the text from the image. 
// Actually, the user GAVE me the import syntax for the attached image: 
// import exampleImage from 'figma:asset/149fafe8475e730ee9ea4e600054b26cbf00bbb3.png'
// I will use that for the "CV" download/view part if they want to see the original.
import cvImage from 'figma:asset/149fafe8475e730ee9ea4e600054b26cbf00bbb3.png';

export function Footer() {
  return (
    <section id="contact" className="py-24 relative border-t border-foreground/10 transition-colors">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter">Let's Connect</h2>
            <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto font-light transition-colors">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            <a 
              href="mailto:echo1lin03@gmail.com"
              className="flex items-center space-x-3 px-8 py-4 bg-foreground text-background rounded-full hover:bg-pink-200 hover:text-black transition-all font-medium shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(255,192,203,0.4)]"
            >
              <Mail className="w-5 h-5" />
              <span>echo1lin03@gmail.com</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/hanxiongzhang"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-8 py-4 border border-foreground/20 bg-foreground/5 backdrop-blur-sm hover:bg-foreground/10 rounded-full transition-colors font-medium text-foreground"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a 
              href={cvImage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-8 py-4 border border-foreground/20 bg-foreground/5 backdrop-blur-sm hover:bg-foreground/10 rounded-full transition-colors font-medium text-foreground"
            >
              <Globe className="w-5 h-5" />
              <span>View Original CV</span>
            </a>
          </div>

          <div className="pt-12 border-t border-foreground/10 text-sm text-foreground/40 transition-colors">
            © {new Date().getFullYear()} Hanxiong Zhang. All Rights Reserved.
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
