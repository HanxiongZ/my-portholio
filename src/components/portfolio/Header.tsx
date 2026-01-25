import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header({ isDark, setIsDark }: { isDark: boolean; setIsDark: (v: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Stockholm'
      });
      setTime(timeString);
    };

    updateTime();
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;
    const timeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }, msToNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  const navItems = [
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
          ? 'bg-background/80 backdrop-blur-xl border-foreground/5 py-4'
          : 'bg-transparent border-transparent py-8'
        }`}
    >
      <div className="relative z-50 container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-12 gap-6 items-center">

        {/* Logo - Aligns with Col 1 */}
        <div className="col-span-1 md:col-span-2 pl-2 md:pl-3">
          <Link to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}>
            <span className="text-xl tracking-[0.1em] font-light text-foreground uppercase">
              Hanx
            </span>
            <span className="text-pink-500 font-bold ml-0.5">.</span>
          </Link>
        </div>

        {/* Spacer - Spans Col 3-? depending on content width */}
        <div className="hidden md:block md:col-span-4 lg:col-span-5" />

        {/* Desktop Nav & Tools - Aligns to Right */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 pl-2 md:pl-3 flex items-center justify-end">
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-[12px] font-mono uppercase tracking-widest text-foreground/70 hover:text-background hover:bg-foreground transition-colors px-2 py-1 whitespace-nowrap cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="w-px h-4 bg-foreground/20" />

            <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

            <div className="w-px h-4 bg-foreground/20" />

            {/* Location & Time - Stacked */}
            <div className="flex flex-col items-start justify-center h-full gap-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 leading-none">
                Umeå
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 leading-none">
                {time}
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
            <button
              className="p-1 text-foreground hover:bg-foreground/5 rounded-full transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 left-0 bg-background/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.1 }}
                className="text-3xl font-bold tracking-[0.2em] uppercase text-foreground hover:text-pink-500 transition-colors cursor-pointer"
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
