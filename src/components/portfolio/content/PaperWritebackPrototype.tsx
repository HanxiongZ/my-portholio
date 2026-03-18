import React, { useRef, useEffect, useState, useCallback } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "proxy",
  baseURL: `${window.location.origin}/api/openai`,
  dangerouslyAllowBrowser: true,
});

const TAG_CONFIG = {
  Symptom:        { color: "#c0392b", bg: "rgba(192,57,43,0.15)"  },
  Medication:     { color: "#2471a3", bg: "rgba(36,113,163,0.15)" },
  Diagnosis:      { color: "#7d3c98", bg: "rgba(125,60,152,0.15)" },
  "Follow-up":    { color: "#d35400", bg: "rgba(211,84,0,0.15)"  },
  "Patient Info": { color: "#1e8449", bg: "rgba(30,132,73,0.15)" },
  Other:          { color: "#616a6b", bg: "rgba(97,106,107,0.15)"},
} as const;
type TagCategory = keyof typeof TAG_CONFIG;

interface AITag { label: TagCategory; text: string; cx: number; cy: number; }
interface DigitalNotes {
  chiefComplaint: string; symptoms: string[]; medications: string[];
  diagnosis: string; followUp: string; rawTranscription: string;
}
interface AIResult { consent: boolean; tags: AITag[]; notes: DigitalNotes; }

// ── Loading phase steps ──
const LOADING_STEPS = [
  { text: "Image acquired",               ms: 0    },
  { text: "Consent marker verified ✓",    ms: 700  },
  { text: "Handwriting regions detected", ms: 1300 },
  { text: "Parsing medical content",      ms: 2000 },
  { text: "Structuring notes…",           ms: 2700 },
];

// ── Typewriter component ──
function Typewriter({ text, speed = 22, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setVisible(""); setDone(false);
    if (!text) { onDone?.(); return; }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {visible}
      {!done && (
        <span style={{ display: "inline-block", width: 1.5, height: "0.85em", backgroundColor: "currentColor", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulse 1s infinite" }} />
      )}
    </span>
  );
}

// ── Capture ──
function captureFrame(video: HTMLVideoElement): { base64: string; dataUrl: string } | null {
  const c = document.createElement("canvas");
  c.width = video.videoWidth; c.height = video.videoHeight;
  const ctx = c.getContext("2d"); if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  const dataUrl = c.toDataURL("image/jpeg", 0.9);
  return { base64: dataUrl.split(",")[1], dataUrl };
}

// ── AI ──
async function analyseNotes(base64: string): Promise<AIResult> {
  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-nano", max_tokens: 1500,
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}`, detail: "high" } },
        { type: "text", text: `You are a clinical AI assistant helping a doctor during a patient consultation. The doctor is taking handwritten notes in real time — content will always be medically relevant: symptoms, diagnoses, medications, dosages, patient history, follow-up instructions, vitals, etc.

STEP 1 — Consent check: Look for a gray circular object placed anywhere on the paper. If present, set "consent": true. If not, set "consent": false and return empty data immediately.

STEP 2 — If consent is true, read and interpret the handwritten notes with medical expertise:
- Handwriting may be rushed, abbreviated, or partially illegible — use clinical context to infer what was written. For example, "HTN" means hypertension, "SOB" means shortness of breath, "bid" means twice daily, a number next to "mg" is a dosage, etc.
- If a word is unclear, make your best medical inference and note it with a "?" suffix (e.g. "amoxicillin?").
- Do NOT produce nonsensical output. If something is unreadable, skip it or infer from surrounding context.
- Separate the content into structured fields: chief complaint, symptoms, medications with dosages, working diagnosis, and follow-up plan.

Return ONLY this JSON (no markdown, no explanation):
{
  "consent": true,
  "tags": [{ "label": "Symptom|Medication|Diagnosis|Follow-up|Patient Info|Other", "text": "inferred text", "cx": 0.0, "cy": 0.0 }],
  "notes": {
    "chiefComplaint": "",
    "symptoms": [],
    "medications": [],
    "diagnosis": "",
    "followUp": "",
    "rawTranscription": ""
  }
}

No consent: { "consent": false, "tags": [], "notes": { "chiefComplaint": "", "symptoms": [], "medications": [], "diagnosis": "", "followUp": "", "rawTranscription": "" } }` },
      ],
    }],
  });
  const text = resp.choices[0]?.message?.content ?? "{}";
  try { return JSON.parse(text) as AIResult; }
  catch { return { consent: false, tags: [], notes: { chiefComplaint: "", symptoms: [], medications: [], diagnosis: "", followUp: "", rawTranscription: "" } }; }
}

// ── Notes panel ──
function NotesPanel({ aiState, result, aiError }: {
  aiState: string; result: AIResult | null; aiError: string;
}) {
  const [loadStep, setLoadStep] = useState(0);
  const [revealStep, setRevealStep] = useState(0);

  // Loading: show log lines one by one
  useEffect(() => {
    if (aiState !== "loading") { setLoadStep(0); return; }
    const timers = LOADING_STEPS.map((s, i) => setTimeout(() => setLoadStep(i + 1), s.ms));
    return () => timers.forEach(clearTimeout);
  }, [aiState]);

  // Done: reveal sections progressively
  useEffect(() => {
    if (aiState !== "done") { setRevealStep(0); return; }
    setRevealStep(0);
    const delays = [100, 600, 1200, 1900, 2600, 3400];
    const timers = delays.map((d, i) => setTimeout(() => setRevealStep(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, [aiState]);

  const n = result?.notes;
  const sections = n ? [
    n.chiefComplaint ? { key: "cc", label: "Chief Complaint", color: "var(--foreground)", items: null, text: n.chiefComplaint } : null,
    n.symptoms.length   ? { key: "sx", label: "Symptoms",        color: TAG_CONFIG.Symptom.color,     items: n.symptoms,    text: null } : null,
    n.medications.length? { key: "rx", label: "Medications",     color: TAG_CONFIG.Medication.color,  items: n.medications, text: null } : null,
    n.diagnosis         ? { key: "dx", label: "Diagnosis",       color: TAG_CONFIG.Diagnosis.color,   items: null, text: n.diagnosis } : null,
    n.followUp          ? { key: "fu", label: "Follow-up",       color: TAG_CONFIG["Follow-up"].color, items: null, text: n.followUp } : null,
    n.rawTranscription  ? { key: "rt", label: "Transcription",   color: "var(--foreground)", items: null, text: n.rawTranscription, raw: true } : null,
  ].filter(Boolean) : [];

  return (
    <div className="border border-foreground/10 flex flex-col h-full" style={{ minHeight: 320 }}>
      {/* Header */}
      <div className="border-b border-foreground/10 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">Digital Notes</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{
            backgroundColor:
              aiState === "done"       ? "#27ae60" :
              aiState === "loading"    ? "#f39c12" :
              aiState === "no-consent" ? "#c0392b" : "rgba(128,128,128,0.2)",
          }} />
          <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest">
            { aiState === "idle"       ? "Standby"
            : aiState === "loading"    ? "Processing"
            : aiState === "done"       ? "Complete"
            : aiState === "no-consent" ? "No consent"
            : "Error" }
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Idle */}
        {aiState === "idle" && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 py-12">
            <div className="w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-foreground/10" />
            </div>
            <p className="text-[10px] font-mono text-foreground/25 uppercase tracking-widest text-center leading-relaxed">
              Place gray circle on paper<br />then tap Scan
            </p>
          </div>
        )}

        {/* Loading — terminal log */}
        {aiState === "loading" && (
          <div className="px-4 py-5 font-mono space-y-2">
            {LOADING_STEPS.slice(0, loadStep).map((s, i) => (
              <div key={i} className="flex items-start gap-3"
                style={{ opacity: i < loadStep - 1 ? 0.35 : 1, transition: "opacity 0.4s" }}>
                <span className="text-[10px] text-foreground/25 pt-px select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-foreground/70">
                  {i === loadStep - 1
                    ? <Typewriter text={s.text} speed={18} />
                    : s.text}
                </span>
              </div>
            ))}
            {/* Blinking cursor after last line */}
            {loadStep > 0 && loadStep < LOADING_STEPS.length && (
              <div className="flex items-center gap-3 pl-8">
                <span className="text-xs text-foreground/20 animate-pulse">_</span>
              </div>
            )}
          </div>
        )}

        {/* No consent */}
        {aiState === "no-consent" && (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-6 py-12">
            <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest text-center leading-loose">
              Consent object not found<br />in the image
            </p>
          </div>
        )}

        {/* Error */}
        {aiState === "error" && (
          <div className="px-4 py-5">
            <p className="text-xs font-mono text-foreground/40">{aiError}</p>
          </div>
        )}

        {/* Done — progressive reveal */}
        {aiState === "done" && result?.consent && (
          <div className="px-4 py-5 space-y-5">
            {sections.map((sec, idx) => {
              if (!sec) return null;
              const visible = revealStep > idx;
              return (
                <div key={sec.key}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}>
                  {/* Section label */}
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5"
                    style={{ color: idx === 0 ? "var(--muted-foreground)" : sec.color, opacity: 0.7 }}>
                    {sec.label}
                  </p>

                  {/* List items */}
                  {sec.items && (
                    <ul className="space-y-1.5">
                      {sec.items.map((item: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sec.color }} />
                          {visible && revealStep === idx + 1
                            ? <Typewriter text={item} speed={16} />
                            : item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Single text */}
                  {sec.text && !sec.items && (
                    sec.raw
                      ? <pre className="text-xs font-mono text-foreground/45 whitespace-pre-wrap leading-relaxed border-t border-foreground/8 pt-3 mt-1">
                          {visible && revealStep === idx + 1
                            ? <Typewriter text={sec.text} speed={8} />
                            : sec.text}
                        </pre>
                      : <p className="text-sm text-foreground/70 leading-relaxed">
                          {visible && revealStep === idx + 1
                            ? <Typewriter text={sec.text} speed={20} />
                            : sec.text}
                        </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ──
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
    } catch { setCameraState("denied"); }
  }, []);

  const handleScan = useCallback(() => {
    const video = videoRef.current; if (!video) return;
    const frame = captureFrame(video); if (!frame) return;
    setFrozenDataUrl(frame.dataUrl);
    setAiState("loading"); setResult(null); setAiError("");
    analyseNotes(frame.base64)
      .then((r) => { setResult(r); setAiState(r.consent ? "done" : "no-consent"); })
      .catch((e: Error) => { setAiError(e.message); setAiState("error"); });
  }, []);

  const reset = useCallback(() => {
    setAiState("idle"); setResult(null); setFrozenDataUrl(null); setAiError("");
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle"); setAiState("idle"); setResult(null); setFrozenDataUrl(null);
  }, []);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  const isActive = cameraState === "active";
  const showFrozen = !!(frozenDataUrl && aiState !== "idle");

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
          Prototype 02 — AI Intervention via Consent Object
        </p>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-xl">
          Write consultation notes on paper. Place a <span className="font-mono">gray circular object</span> to signal
          consent, then tap <span className="font-mono">Scan</span>. The AI verifies consent before reading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: camera */}
        <div className="lg:col-span-7">
          <div className="relative w-full overflow-hidden bg-foreground/5 border border-foreground/10"
            style={{ aspectRatio: "16/9" }}>
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
              playsInline muted style={{ display: isActive && !showFrozen ? "block" : "none" }} />
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
                  }}>{tag.label}</div>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: cfg.color, margin: "2px auto 0" }} />
                </div>
              );
            })}

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

            {aiState === "no-consent" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="border border-foreground/20 bg-background/80 px-5 py-4 text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1">No consent object detected</p>
                  <p className="text-[10px] font-mono text-foreground/30">Place a gray circular object on the paper</p>
                </div>
              </div>
            )}

            {aiState === "loading" && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Scan line animation */}
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  animation: "scanline 2s linear infinite",
                }} />
              </div>
            )}
          </div>

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
                {!showFrozen
                  ? <button onClick={handleScan} disabled={aiState === "loading"}
                      className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/70 text-foreground/80 hover:border-foreground hover:text-foreground transition-colors disabled:opacity-30">
                      Scan
                    </button>
                  : <button onClick={reset}
                      className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
                      Rescan
                    </button>
                }
              </>
            )}
          </div>

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

        {/* Right: immersive notes panel */}
        <div className="lg:col-span-5">
          <NotesPanel aiState={aiState} result={result} aiError={aiError} />
        </div>
      </div>

      {/* Scanline keyframe */}
      <style>{`
        @keyframes scanline {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
