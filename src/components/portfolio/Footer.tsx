import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Globe, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <section id="contact" className="py-24 md:py-32 relative border-t border-foreground/10 transition-colors bg-background">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 h-full">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="h-full border-l border-foreground/5 relative first:border-l-0 md:first:border-l"></div>
           ))}
           <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-foreground/5" />
           <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-foreground/5" />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto backdrop-blur-sm p-4 md:p-8 rounded-sm">
            <span className="inline-block text-xs font-mono uppercase text-foreground/40 mb-6 tracking-widest">
              Contact
            </span>
            <h2 className="text-4xl md:text-6xl font-medium uppercase tracking-tighter mb-8">
              Let's Connect
            </h2>
            <p className="text-base md:text-lg text-foreground/80 mb-12 max-w-xl mx-auto leading-relaxed font-light text-pretty">
              I'm currently working on my master thesis project, and looking for jobs as a designer:).
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
              <a 
                href="mailto:hanxiongzhang@hotmail.com"
                className="group flex items-center gap-3 px-6 py-4 border border-foreground/20 bg-background/50 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background transition-colors min-w-[200px] justify-center"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">hanxiongzhang@hotmail.com</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/hanxiongzhang"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-4 border border-foreground/20 bg-background/50 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background transition-colors min-w-[200px] justify-center"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              </a>
              
              <a
                href="/Hanx_CV_2026.pdf"
                download="Hanx_CV_2026.pdf"
                className="group flex items-center gap-3 px-6 py-4 border border-foreground/20 bg-background/50 backdrop-blur-sm text-foreground hover:bg-foreground hover:text-background transition-colors min-w-[200px] justify-center"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">View CV</span>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              </a>
            </div>

            <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase text-foreground/40 tracking-wider">
              <span>© {new Date().getFullYear()} Hanxiong Zhang 张翰雄</span>
              <span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
