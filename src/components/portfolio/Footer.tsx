import React from 'react';
import { motion } from 'motion/react';
import { PortfolioArrow } from './PortfolioArrow';

export function Footer() {
  return (
    <section id="contact" className="py-24 md:py-32 relative border-t border-foreground/10 transition-colors bg-background">
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto backdrop-blur-sm p-4 md:p-8 rounded-sm">
            <span className="type-footer-label inline-block font-mono uppercase text-foreground/40 mb-6">
              Contact
            </span>
            <h2 className="type-footer-heading uppercase mb-8">
              Let's Connect
            </h2>
            <p className="type-footer-body text-foreground/80 mb-12 max-w-xl mx-auto text-pretty">
              I'm currently working on my master thesis project, and looking for jobs as a designer:).
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
              <a 
                href="mailto:hanxiongzhang@hotmail.com"
                className="portfolio-button min-w-[200px]"
              >
                <span className="type-footer-action normal-case">hanxiongzhang@hotmail.com</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/hanxiongzhang"
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-button portfolio-button--up min-w-[200px]"
              >
                <span className="type-footer-action">LinkedIn</span>
                <PortfolioArrow direction="up" />
              </a>
              
              <a
                href="/Hanx_CV_2026.pdf"
                download="Hanx_CV_2026.pdf"
                className="portfolio-button portfolio-button--up min-w-[200px]"
              >
                <span className="type-footer-action">View CV</span>
                <PortfolioArrow direction="up" />
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
