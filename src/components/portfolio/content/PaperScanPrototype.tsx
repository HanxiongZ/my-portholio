import React, { useRef, useEffect, useState, useCallback } from "react";
import OpenAI from "openai";

// Requests go through Vite's local proxy → api.openai.com (avoids browser CORS)
const openai = new OpenAI({
  apiKey: "proxy", // actual key is injected server-side by the Vite proxy
  baseURL: `${window.location.origin}/api/openai`,
  dangerouslyAllowBrowser: true,
});

// ── Types ──
type Priority = "urgent" | "high" | "medium" | "low";

interface DetectedPaper {
  id: string;
  type: string;        // e.g. "Prescription", "Lab Result", "Admin Form"
  priority: Priority;
  reason: string;
  // Normalized center position (0–1), from AI estimation
  cx: number;
  cy: number;
}

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; label: string }> = {
  urgent: { color: "#fff",     bg: "#c0392b", label: "Urgent"  },
  high:   { color: "#fff",     bg: "#d35400", label: "High"    },
  medium: { color: "#fff",     bg: "#2980b9", label: "Medium"  },
  low:    { color: "#1a1a1a",  bg: "#27ae60", label: "Low"     },
};

// ── Capture frame ──
function captureFrame(video: HTMLVideoElement, quality = 0.88): string | null {
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  return c.toDataURL("image/jpeg", quality).split(",")[1];
}

// ── AI classification ──
async function classifyPapers(base64: string): Promise<DetectedPaper[]> {
  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64}`, detail: "high" },
          },
          {
            type: "text",
            text: `You are looking at a photo of a desk or surface with paper documents.

Identify every visible paper document. For each paper:
1. Estimate its CENTER position as fractions of the total image size — cx (0=left, 1=right), cy (0=top, 1=bottom)
2. Classify the document type (e.g. "Prescription", "Lab Result", "Patient Form", "Invoice", "Clinical Note", "Administrative", "Report", "Unknown")
3. Assign a priority level: "urgent", "high", "medium", or "low" — based on visual cues (handwriting urgency, medical keywords, form type, how much is filled in, etc.)
4. Give a one-sentence reason for the priority

Return ONLY a JSON array with this shape (no markdown, no explanation):
[
  {
    "id": "p1",
    "type": "string",
    "priority": "urgent|high|medium|low",
    "reason": "string",
    "cx": 0.0,
    "cy": 0.0
  }
]

If no papers are visible, return an empty array [].`,
          },
        ],
      },
    ],
  });

  const text = resp.choices[0]?.message?.content ?? "[]";
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed as DetectedPaper[] : [];
  } catch {
    return [];
  }
}

// ── Component ──
export function PaperScanPrototype() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  // Freeze frame for overlay (shown after analysis)
  const frozenRef = useRef<string | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "requesting" | "active" | "denied" | "unsupported">("idle");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [papers, setPapers] = useState<DetectedPaper[]>([]);
  const [aiError, setAiError] = useState("");
  // Whether we're showing the frozen analysed frame or live video
  const [frozen, setFrozen] = useState(false);
  const [frozenDataUrl, setFrozenDataUrl] = useState<string | null>(null);

  // ── Camera control ──
  const startCamera = useCallback(async (mode: "environment" | "user" = "environment") => {
    setCameraState("requesting");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setFrozen(false); setFrozenDataUrl(null); setPapers([]); setAiState("idle");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraState("active");
    } catch (err: unknown) {
      const e = err as Error;
      setCameraState(e.name === "NotFoundError" ? "unsupported" : "denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle"); setPapers([]); setAiState("idle");
    setFrozen(false); setFrozenDataUrl(null);
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next); startCamera(next);
  }, [facingMode, startCamera]);

  // ── Analyse ──
  const handleAnalyse = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // Freeze the current frame
    const c = document.createElement("canvas");
    c.width = video.videoWidth; c.height = video.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg", 0.88);
    const base64 = dataUrl.split(",")[1];

    setFrozenDataUrl(dataUrl);
    setFrozen(true);
    setAiState("loading");
    setPapers([]);
    setAiError("");

    try {
      const result = await classifyPapers(base64);
      setPapers(result);
      setAiState("done");
    } catch (err: unknown) {
      const e = err as Error & { status?: number; code?: string };
      const detail = [e.status && `HTTP ${e.status}`, e.code, e.message].filter(Boolean).join(" · ");
      setAiError(detail || "Unknown error");
      setAiState("error");
      setFrozen(false);
    }
  }, []);

  const handleResume = useCallback(() => {
    setFrozen(false); setFrozenDataUrl(null);
    setPapers([]); setAiState("idle");
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const isActive = cameraState === "active";
  const canAnalyse = isActive && !frozen && aiState !== "loading";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
          Prototype — Desk Paper Triage
        </p>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-xl">
          Point the camera at papers on your desk. Tap <span className="font-mono">Scan</span> to
          freeze the frame and let the AI classify each document by type and urgency.
          Colour badges mark priority — no manual sorting required.
        </p>
      </div>

      {/* Viewport */}
      <div
        className="relative w-full overflow-hidden bg-foreground/5 border border-foreground/10 select-none"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Live video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline muted
          style={{ display: isActive && !frozen ? "block" : "none" }}
        />

        {/* Frozen frame */}
        {frozen && frozenDataUrl && (
          <img
            src={frozenDataUrl}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Frozen frame"
          />
        )}

        {/* Idle / error states */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {cameraState === "idle" && (
              <>
                <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    stroke="currentColor" strokeWidth="1.2" className="text-foreground/40">
                    <circle cx="10" cy="10" r="3.5" />
                    <path d="M1 7V5a2 2 0 0 1 2-2h2M1 13v2a2 2 0 0 0 2 2h2M19 7V5a2 2 0 0 0-2-2h-2M19 13v2a2 2 0 0 1-2 2h-2" />
                  </svg>
                </div>
                <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest">Camera inactive</p>
              </>
            )}
            {cameraState === "requesting" && <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest animate-pulse">Requesting access…</p>}
            {cameraState === "denied" && <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest text-center px-8">Camera permission denied</p>}
            {cameraState === "unsupported" && <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest text-center px-8">No camera found</p>}
          </div>
        )}

        {/* AI loading overlay */}
        {aiState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 px-5 py-3 flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "300ms" }} />
              <p className="text-xs font-mono text-white/70 uppercase tracking-widest">Classifying…</p>
            </div>
          </div>
        )}

        {/* Priority overlays */}
        {aiState === "done" && papers.map((paper) => {
          const cfg = PRIORITY_CONFIG[paper.priority];
          return (
            <div
              key={paper.id}
              className="absolute pointer-events-none"
              style={{
                left: `${paper.cx * 100}%`,
                top: `${paper.cy * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Colour block + label */}
              <div
                style={{
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  padding: "4px 8px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ opacity: 0.7, marginRight: 4 }}>{cfg.label}</span>
                {paper.type}
              </div>
              {/* Dot anchor */}
              <div style={{
                width: 6, height: 6,
                borderRadius: "50%",
                backgroundColor: cfg.bg,
                margin: "3px auto 0",
                boxShadow: `0 0 0 2px ${cfg.bg}44`,
              }} />
            </div>
          );
        })}

        {/* No papers found */}
        {aiState === "done" && papers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs font-mono text-white/60 uppercase tracking-widest bg-black/40 px-4 py-2">
              No papers detected
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {!isActive ? (
          <button onClick={() => startCamera(facingMode)}
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
            Start Camera
          </button>
        ) : (
          <>
            <button onClick={stopCamera}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
              Stop
            </button>
            <button onClick={flipCamera}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
              Flip
            </button>
            {!frozen ? (
              <button onClick={handleAnalyse} disabled={!canAnalyse}
                className="px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-foreground/70 text-foreground/80 hover:border-foreground hover:text-foreground">
                Scan
              </button>
            ) : (
              <button onClick={handleResume}
                className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
                Resume Live
              </button>
            )}
          </>
        )}
      </div>

      {/* Error */}
      {aiState === "error" && (
        <p className="mt-4 text-xs font-mono text-foreground/40">{aiError}</p>
      )}

      {/* Legend */}
      {aiState === "done" && papers.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Priority legend */}
          <div className="flex gap-3 flex-wrap">
            {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => {
              const cfg = PRIORITY_CONFIG[p];
              return (
                <div key={p} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cfg.bg }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{cfg.label}</span>
                </div>
              );
            })}
          </div>

          {/* Paper list */}
          <div className="border-t border-foreground/10 pt-6 space-y-3">
            {papers.map((paper) => {
              const cfg = PRIORITY_CONFIG[paper.priority];
              return (
                <div key={paper.id} className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 pt-0.5">
                    <div className="w-2 h-2 rounded-sm mt-1" style={{ backgroundColor: cfg.bg }} />
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs font-mono text-foreground/70">{paper.type}</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5"
                      style={{ color: cfg.bg }}>{cfg.label}</p>
                  </div>
                  <div className="col-span-8">
                    <p className="text-xs text-foreground/50 leading-relaxed">{paper.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
