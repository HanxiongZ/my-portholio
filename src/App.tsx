import React, { useEffect, useState } from 'react';
import { Header } from './components/portfolio/Header';
import { Hero } from './components/portfolio/Hero';
import { Experience } from './components/portfolio/Experience';
import { Projects } from './components/portfolio/Projects';
import { Footer } from './components/portfolio/Footer';
import { StarField } from './components/portfolio/StarField';
import { Constellation } from './components/portfolio/Constellation';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);

  // Initialize theme based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    // Scandinavian Dawn/Daytime: 6 AM to 6 PM
    if (hour >= 6 && hour < 18) {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white transition-colors duration-1000 ${isDark ? 'dark' : ''}`}>
      {/* Main Wrapper */}
      <div 
        className={`min-h-screen text-foreground relative overflow-hidden transition-colors duration-1000 md:cursor-none ${isDark ? 'bg-[#0A0F1C]' : 'bg-[#FAF9F7]'}`}
        style={isDark ? {
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(106, 247, 154, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(218, 76, 166, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(28, 198, 122, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(246, 247, 189, 0.02) 0%, transparent 40%)
          `
        } : {}}
      >
        
        {/* Interactive Star Field (Background) */}
        <StarField isDark={isDark} />
        
        {/* Interactive Constellation (Foreground Highlights) */}
        <Constellation isDark={isDark} />

        {/* Custom Cursor Follower - Simplified */}
        <div 
          className="fixed w-8 h-8 border border-foreground/30 rounded-full pointer-events-none z-50 hidden md:block transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: mousePosition.x, 
            top: mousePosition.y 
          }}
        />
        
        <div className="relative z-10">
          <Header isDark={isDark} setIsDark={setIsDark} />
          <main>
            <Hero />
            <Experience />
            <Projects />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
