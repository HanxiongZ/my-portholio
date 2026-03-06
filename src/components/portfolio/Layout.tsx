import React, { useEffect, useState, Suspense } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { StarField } from "./StarField";

export interface OutletContextType {
  isDark: boolean;
}

export function Layout() {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  return (
    <div
      className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white transition-colors duration-1000 ${isDark ? "dark" : ""}`}
    >
      <div
        className={`min-h-screen text-foreground relative transition-colors duration-1000 ${isDark ? "bg-[#0A0F1C]" : "bg-[#FAF9F7]"}`}
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
        <StarField isDark={isDark} />

        <div className="relative z-10">
          <Header isDark={isDark} setIsDark={setIsDark} />
          <main>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center text-foreground/40 font-mono text-sm tracking-widest uppercase">
                  Loading...
                </div>
              }
            >
              <Outlet context={{ isDark } satisfies OutletContextType} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}