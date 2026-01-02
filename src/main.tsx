import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ Lightweight perf monitor — PROD only
if (import.meta.env.PROD) {
  // 1) 基础加载指标（load 后统计更完整）
  window.addEventListener("load", () => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (nav) {
      console.table({
        "TTFB (ms)": Math.round(nav.responseStart),
        "DOM Ready (ms)": Math.round(nav.domContentLoadedEventEnd),
        "Load (ms)": Math.round(nav.loadEventEnd),
        "Transfer (KB)": Math.round((nav.transferSize || 0) / 1024),
        "Resources": performance.getEntriesByType("resource").length,
      });
    } else {
      // fallback
      console.table({
        "Resources": performance.getEntriesByType("resource").length,
      });
    }

    // Chrome only: JS heap memory
    const mem = (performance as any).memory;
    if (mem) {
      console.table({
        "JS Heap Used (MB)": Math.round(mem.usedJSHeapSize / 1024 / 1024),
        "JS Heap Total (MB)": Math.round(mem.totalJSHeapSize / 1024 / 1024),
        "JS Heap Limit (MB)": Math.round(mem.jsHeapSizeLimit / 1024 / 1024),
      });
    }
  });

  // 2) 卡顿监控：Long Task（主线程阻塞）
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // duration 通常 > 50ms 才算明显卡顿
          if (entry.duration >= 50) {
            console.warn("⚠️ Long Task:", {
              durationMs: Math.round(entry.duration),
              startMs: Math.round(entry.startTime),
            });
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] as any });
    } catch {
      // ignore
    }
  }
}

createRoot(document.getElementById("root")!).render(<App />);

  