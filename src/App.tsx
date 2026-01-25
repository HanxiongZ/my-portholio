import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/portfolio/Header";
// Lazy load route components
const Home = React.lazy(() => import("./components/portfolio/Home").then(module => ({ default: module.Home })));
const ProjectDetail = React.lazy(() => import("./components/portfolio/ProjectDetail").then(module => ({ default: module.ProjectDetail })));

import { StarField } from "./components/portfolio/StarField";
import { AnimatePresence } from "motion/react";

function AppContent() {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isDark, setIsDark] = useState(true);

  // Google Analytics (GA4)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("ga-script-tag")) return;

    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src =
      "https://www.googletagmanager.com/gtag/js?id=G-ZDYLBLE4LF";
    gaScript.id = "ga-script-tag";
    document.head.appendChild(gaScript);

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZDYLBLE4LF');
    `;
    document.head.appendChild(inlineScript);
  }, []);

  // Initialize theme based on local time
  useEffect(() => {
    const hour = new Date().getHours();
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

    window.addEventListener("mousemove", handleMouseMove);
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white transition-colors duration-1000 ${isDark ? "dark" : ""}`}
    >
      {/* Main Wrapper */}
      <div
        className={`min-h-screen text-foreground relative transition-colors duration-1000 md:cursor-none ${isDark ? "bg-[#0A0F1C]" : "bg-[#FAF9F7]"}`}
        style={
          isDark
            ? {
                backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(106, 247, 154, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(218, 76, 166, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(28, 198, 122, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(246, 247, 189, 0.02) 0%, transparent 40%)
          `,
              }
            : {}
        }
      >
        {/* Interactive Star Field (Background) */}
        <StarField isDark={isDark} />

        {/* Custom Cursor Follower - Simplified */}
        <div
          className="fixed w-8 h-8 border border-foreground/30 rounded-full pointer-events-none z-50 hidden md:block transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />

        <div className="relative z-10">
          <Header isDark={isDark} setIsDark={setIsDark} />
          <main>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center text-foreground/40 font-mono text-sm tracking-widest uppercase">
                Loading...
              </div>
            }>
              <AnimatePresence mode="wait">
                <Routes
                  location={location}
                  key={location.pathname}
                >
                  <Route
                    path="/"
                    element={<Home isDark={isDark} />}
                  />
                  <Route
                    path="/project/:id"
                    element={<ProjectDetail />}
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;