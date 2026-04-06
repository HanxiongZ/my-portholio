import React, { useEffect, useState, Suspense } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { StarField } from "./StarField";

export interface OutletContextType {
  isDark: boolean;
}

/** Returns true if the current local time is between sunrise and sunset. */
function isDaytime(lat: number, lng: number): boolean {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.round((now.getTime() - start.getTime()) / 86400000);

  const rad = (d: number) => (d * Math.PI) / 180;

  // Solar declination angle for this day of year
  const declination = -23.45 * Math.cos(rad((360 / 365) * (dayOfYear + 10)));

  // Hour angle at sunrise/sunset (90.833° accounts for atmospheric refraction)
  const cosHA =
    (Math.cos(rad(90.833)) -
      Math.sin(rad(lat)) * Math.sin(rad(declination))) /
    (Math.cos(rad(lat)) * Math.cos(rad(declination)));

  if (cosHA >= 1) return false; // polar night
  if (cosHA <= -1) return true; // midnight sun

  const ha = (Math.acos(cosHA) * 180) / Math.PI; // degrees

  // Solar noon in local hours
  const tzHours = -now.getTimezoneOffset() / 60;
  const solarNoon = 12 + tzHours - lng / 15;

  const sunrise = solarNoon - ha / 15;
  const sunset = solarNoon + ha / 15;

  const currentHour = now.getHours() + now.getMinutes() / 60;
  return currentHour >= sunrise && currentHour < sunset;
}

export function Layout() {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme based on Umeå sunrise/sunset
  useEffect(() => {
    const UMEA_LAT = 63.8258;
    const UMEA_LNG = 20.2630;
    setIsDark(!isDaytime(UMEA_LAT, UMEA_LNG));
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