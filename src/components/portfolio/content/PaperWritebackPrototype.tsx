import React, { useRef, useEffect, useState, useCallback } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "proxy",
  baseURL: `${window.location.origin}/api/openai`,
  dangerouslyAllowBrowser: true,
});

// ── Tag categories ──
const TAG_CONFIG = {
  Symptom:       { color: "#c0392b", bg: "rgba(192,57,43,0.15)"  },
  Medication:    { color: "#2471a3", bg: "rgba(36,113,163,0.15)" },
  Diagnosis:     { color: "#7d3c98", bg: "rgba(125,60,152,0.15)" },
  "Follow-up":   { color: "#d35400", bg: "rgba(211,84,0,0.15)"  },
  "Patient Info":{ color: "#1e8449", bg: "rgba(30,132,73,0.15)" },
  Other:         { color: "#616a6b", bg: "rgba(97,106,107,0.15)"},
} as const;

type TagCategory = keyof typeof TAG_CONFIG;

interface AITag {
  label: TagCategory;
  text: string;
  cx: number;
  cy: number;
}

interface DigitalNotes {
  chiefComplaint: string;
  symptoms: string[];
  medications: string[];
  diagnosis: string;
  followUp: string;
  rawTranscription: string;
}

interface AIResult {
  consent: boolean; // whether gray circle was detected
  tags: AITag[];
  notes: DigitalNotes;
}

// ── Capture frame as base64 ──
function captureFrame(video: HTMLVideoElement): { base64: string; dataUrl: string } | null {
  const c = document.createElement("canvas");
  c.width = video.videoWidth; c.height = video.videoHeight;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  const dataUrl = c.toDataURL("image/jpeg", 0.9);
  return { base64: dataUrl.split(",")[1], dataUrl };
}

// ── AI: detect consent object + analyse notes ──
async function analyseNotes(base64: string): Promise<AIResult> {
  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}`, detail: "high" } },
        {
          type: "text",
          text: `You are assisting a doctor during a patient consultation.

STEP 1 — Consent check:
Look for a gray circular object placed anywhere on the paper. It can be any gray round item (coin, eraser, pebble, circular sticker). If you see one, set "consent": true. If not, set "consent": false and return immediately with empty tags and notes.

STEP 2 — If consent is true, analyse the handwritten notes:
- Transcribe all legible text
- Identify and tag key medical concepts
- Estimate each tag's center position as fractions of the image (cx: 0=left→1=right, cy: 0=top→1=bottom)

Return ONLY this JSON (no markdown, no explanation):
{
  "consent": true,
  "tags": [
    { "label": "Symptom|Medication|Diagnosis|Follow-up|Patient Info|Other", "text": "exact text", "cx": 0.0, "cy": 0.0 }
  ],
  "notes": {
    "chiefComplaint": "",
    "symptoms": [],
    "medications": [],
    "diagnosis": "",
    "followUp": "",
    "rawTranscription": ""
  }
}

If no consent object: { "consent": false, "tags": [], "notes": { "chiefComplaint": "", "symptoms": [], "medications": [], "diagnosis": "", "followUp": "", "rawTranscription": "" } }`,
        },
      ],
    }],
  });

  const text = resp.choices[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(text) as AIResult;
  } catch {
    return {
      consent: false,
      tags: [],
      notes: { chiefComplaint: "", symptoms: [], medications: [], diagnosis: "", followUp: "", rawTranscription: "" },
    };
  }
}

// ── Component ──
export function PaperWritebackPrototype() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "requesting" | "active" | "denied">("idle");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "no-consent" | "error">("idle");
  const [frozenDataUrl, setFrozenDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState("");

  const startCamera = useCallback(async (mode: "environment" | "user" = "environment") => {
    setCameraState("requesting");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setAiState("idle"); setResult(null); setFrozenDataUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraState("active");
    } catch {
      setCameraState("denied");
    }
  }, []);

  const handleScan = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const frame = captureFrame(video);
    if (!frame) return;
    setFrozenDataUrl(frame.dataUrl);
    setAiState("loading");
    setResult(null); setAiError("");
    analyseNotes(frame.base64)
      .then((r) => {
        setResult(r);
        setAiState(r.consent ? "done" : "no-consent");
      })
      .catch((e: Error) => { setAiError(e.message); setAiState("error"); });
  }, []);

  const reset = useCallback(() => {
    setAiState("idle"); setResult(null); setFrozenDataUrl(null); setAiError("");
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle"); setAiState("idle");
    setResult(null); setFrozenDataUrl(null);
  }, []);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  const isActive = cameraState === "active";
  const showFrozen = !!(frozenDataUrl && aiState !== "idle");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
          Prototype 02 — AI Intervention via Consent Object
        </p>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-xl">
          Write consultation notes on paper. Place a{" "}
          <span className="font-mono">gray circular object</span> on the paper to signal
          consent, then tap <span className="font-mono">Scan</span>. The AI verifies the
          consent object before reading — if absent, it refuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left: viewport ── */}
        <div className="lg:col-span-7">
          <div className="relative w-full overflow-hidden bg-foreground/5 border border-foreground/10"
            style={{ aspectRatio: "16/9" }}>

            {/* Live video */}
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
              playsInline muted style={{ display: isActive && !showFrozen ? "block" : "none" }} />

            {/* Frozen frame */}
            {showFrozen && frozenDataUrl && (
              <img src={frozenDataUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
            )}

            {/* Tag overlays */}
            {aiState === "done" && result?.tags.map((tag, i) => {
              const cfg = TAG_CONFIG[tag.label] ?? TAG_CONFIG.Other;
              return (
                <div key={i} className="absolute pointer-events-none"
                  style={{ left: `${tag.cx * 100}%`, top: `${tag.cy * 100}%`, transform: "translate(-50%, -100%)" }}>
                  <div style={{
                    backgroundColor: cfg.bg, border: `1px solid ${cfg.color}`,
                    padding: "2px 6px", fontSize: "9px", fontFamily: "monospace",
                    color: cfg.color, letterSpacing: "0.06em", textTransform: "uppercase",
                    whiteSpace: "nowrap", backdropFilter: "blur(2px)",
                  }}>
                    {tag.label}
                  </div>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: cfg.color, margin: "2px auto 0" }} />
                </div>
              );
            })}

            {/* Idle state */}
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {cameraState === "idle" && (
                  <>
                    <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
                        stroke="currentColor" strokeWidth="1.2" className="text-foreground/40">
                        <circle cx="10" cy="10" r="3.5" />
                        <path d="M1 7V5a2 2 0 0 1 2-2h2M1 13v2a2 2 0 0 0 2 2h2M19 7V5a2 2 0 0 0-2-2h-2M19 13v2a2 2 0 0 1-2 2h-2" />
                      </svg>
                    </div>
                    <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest">Camera inactive</p>
                  </>
                )}
                {cameraState === "requesting" && <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest animate-pulse">Requesting…</p>}
                {cameraState === "denied" && <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Permission denied</p>}
              </div>
            )}

            {/* No consent overlay */}
            {aiState === "no-consent" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="border border-foreground/20 bg-background/80 px-5 py-4 text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1">No consent object detected</p>
                  <p className="text-[10px] font-mono text-foreground/30">Place a gray circular object on the paper</p>
                </div>
              </div>
            )}

            {/* AI loading */}
            {aiState === "loading" && (
              <div className="absolute inset-0 flex items-end justify-start p-4">
                <div className="bg-black/50 px-4 py-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "120ms" }} />
                  <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "240ms" }} />
                  <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">AI reading…</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-3 flex-wrap">
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
                <button onClick={() => { const next = facingMode === "environment" ? "user" : "environment"; setFacingMode(next); startCamera(next); }}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
                  Flip
                </button>
                {!showFrozen ? (
                  <button onClick={handleScan} disabled={aiState === "loading"}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/70 text-foreground/80 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-30">
                    Scan
                  </button>
                ) : (
                  <button onClick={reset}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
                    Rescan
                  </button>
                )}
              </>
            )}
          </div>

          {aiState === "error" && (
            <p className="mt-3 text-xs font-mono text-foreground/40">{aiError}</p>
          )}

          {/* Tag legend */}
          {aiState === "done" && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {Object.entries(TAG_CONFIG).map(([label, cfg]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: cfg.color }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: digital notes panel ── */}
        <div className="lg:col-span-5">
          <div className="border border-foreground/10 h-full">
            <div className="border-b border-foreground/10 px-4 py-3 flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">Digital Notes</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  backgroundColor:
                    aiState === "done" ? "#27ae60" :
                    aiState === "loading" ? "#f39c12" :
                    aiState === "no-consent" ? "#c0392b" :
                    "rgba(0,0,0,0.15)",
                }} />
                <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest">
                  {aiState === "idle" ? "Standby" : aiState === "loading" ? "Processing" :
                   aiState === "done" ? "Ready" : aiState === "no-consent" ? "No consent" : "Error"}
                </span>
              </div>
            </div>

            {aiState === "idle" && (
              <div className="flex flex-col items-center justify-center h-48 gap-3 px-6">
                <div className="w-8 h-8 rounded-full border border-foreground/15 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-foreground/10" />
                </div>
                <p className="text-xs font-mono text-foreground/25 uppercase tracking-widest text-center leading-relaxed">
                  Place gray circle on paper<br />then tap Scan
                </p>
              </div>
            )}

            {aiState === "loading" && (
              <div className="flex items-center justify-center h-48">
                <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest animate-pulse">Transcribing…</p>
              </div>
            )}

            {aiState === "no-consent" && (
              <div className="flex flex-col items-center justify-center h-48 gap-3 px-6">
                <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest text-center leading-relaxed">
                  Consent object not found<br />in the image
                </p>
              </div>
            )}

            {aiState === "done" && result && (
              <div className="px-4 py-4 space-y-5 overflow-y-auto" style={{ maxHeight: "480px" }}>
                {result.notes.chiefComplaint && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-1">Chief Complaint</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{result.notes.chiefComplaint}</p>
                  </div>
                )}
                {result.notes.symptoms.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: TAG_CONFIG.Symptom.color }}>Symptoms</p>
                    <ul className="space-y-1">
                      {result.notes.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/65">
                          <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: TAG_CONFIG.Symptom.color }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.notes.medications.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: TAG_CONFIG.Medication.color }}>Medications</p>
                    <ul className="space-y-1">
                      {result.notes.medications.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/65">
                          <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: TAG_CONFIG.Medication.color }} />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.notes.diagnosis && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: TAG_CONFIG.Diagnosis.color }}>Diagnosis</p>
                    <p className="text-sm text-foreground/70">{result.notes.diagnosis}</p>
                  </div>
                )}
                {result.notes.followUp && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: TAG_CONFIG["Follow-up"].color }}>Follow-up</p>
                    <p className="text-sm text-foreground/70">{result.notes.followUp}</p>
                  </div>
                )}
                {result.notes.rawTranscription && (
                  <div className="border-t border-foreground/10 pt-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-2">Raw Transcription</p>
                    <pre className="text-xs font-mono text-foreground/50 whitespace-pre-wrap leading-relaxed">
                      {result.notes.rawTranscription}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
