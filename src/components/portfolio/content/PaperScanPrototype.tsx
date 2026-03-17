import React, { useRef, useEffect, useState, useCallback } from "react";
import Anthropic from "@anthropic-ai/sdk";

// ── Claude client (browser-side, API key via env) ──
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? "",
  dangerouslyAllowBrowser: true,
});

// ── Types ──
interface PaperMetadata {
  detected: boolean;
  confidence: number;
  boundingBox: { x: number; y: number; w: number; h: number } | null;
  aspectRatio: string;
  orientation: "portrait" | "landscape" | "unknown";
  writingDensity: number;
  writingRegions: Array<{ x: number; y: number; w: number; h: number }>;
  paperArea: number;
}

interface AIAnalysis {
  documentType: string;
  language: string;
  contentSummary: string;
  fields: Array<{ label: string; value: string }>;
  writingStyle: string;
  completeness: string;
  agencyNotes: string;
  rawText: string;
}

const EMPTY_META: PaperMetadata = {
  detected: false,
  confidence: 0,
  boundingBox: null,
  aspectRatio: "—",
  orientation: "unknown",
  writingDensity: 0,
  writingRegions: [],
  paperArea: 0,
};

// ── Vision: grayscale + Sobel + paper detection ──
function grayscale(data: Uint8ClampedArray, w: number, h: number): Float32Array {
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    out[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }
  return out;
}

function sobelEdge(gray: Float32Array, w: number, h: number): Float32Array {
  const out = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx =
        -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)] +
        -2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)] +
        -gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];
      const gy =
        -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)] +
        gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
      out[y * w + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return out;
}

function detectPaper(imageData: ImageData, canvasW: number, canvasH: number): PaperMetadata {
  const { data, width: w, height: h } = imageData;
  const scale = 4;
  const sw = Math.floor(w / scale);
  const sh = Math.floor(h / scale);

  const small = new Uint8ClampedArray(sw * sh * 4);
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const si = (y * scale * w + x * scale) * 4;
      const di = (y * sw + x) * 4;
      small[di] = data[si]; small[di + 1] = data[si + 1];
      small[di + 2] = data[si + 2]; small[di + 3] = 255;
    }
  }

  const gray = grayscale(small, sw, sh);
  let minX = sw, maxX = 0, minY = sh, maxY = 0;
  let brightCount = 0;
  const BRIGHT_THRESH = 180;

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      if (gray[y * sw + x] > BRIGHT_THRESH) {
        brightCount++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }

  const brightFraction = brightCount / (sw * sh);
  if (brightFraction < 0.05 || brightCount === 0) return EMPTY_META;

  const edges = sobelEdge(gray, sw, sh);
  const avgEdge = edges.reduce((s, v) => s + v, 0) / edges.length;
  const boxW = maxX - minX; const boxH = maxY - minY;
  if (boxW < sw * 0.1 || boxH < sh * 0.1) return EMPTY_META;

  const fillRatio = brightCount / (boxW * boxH);
  const confidence = Math.min(1, fillRatio * 0.5 + brightFraction * 0.3 + Math.min(avgEdge / 30, 0.2));
  if (confidence < 0.2) return EMPTY_META;

  const GRID_X = 6, GRID_Y = 4;
  const cellW = Math.max(1, Math.floor(boxW / GRID_X));
  const cellH = Math.max(1, Math.floor(boxH / GRID_Y));
  const writingRegions: Array<{ x: number; y: number; w: number; h: number }> = [];
  let darkCellCount = 0;

  for (let gy = 0; gy < GRID_Y; gy++) {
    for (let gx = 0; gx < GRID_X; gx++) {
      const cx = minX + gx * cellW; const cy = minY + gy * cellH;
      let dark = 0, total = 0;
      for (let py = cy; py < Math.min(cy + cellH, sh); py++)
        for (let px = cx; px < Math.min(cx + cellW, sw); px++) {
          if (gray[py * sw + px] < 120) dark++;
          total++;
        }
      const dr = dark / Math.max(1, total);
      if (dr > 0.08 && dr < 0.7) {
        darkCellCount++;
        writingRegions.push({ x: (cx * scale) / canvasW, y: (cy * scale) / canvasH, w: (cellW * scale) / canvasW, h: (cellH * scale) / canvasH });
      }
    }
  }

  const realW = boxW * scale; const realH = boxH * scale;
  const ar = realW / realH;
  let aspectRatio = `${ar.toFixed(2)}:1`;
  if (Math.abs(ar - 1.414) < 0.15) aspectRatio = "A4 landscape";
  else if (Math.abs(ar - 0.707) < 0.15) aspectRatio = "A4 portrait";
  else if (Math.abs(ar - 1.294) < 0.1) aspectRatio = "Letter landscape";
  else if (Math.abs(ar - 0.773) < 0.1) aspectRatio = "Letter portrait";

  return {
    detected: confidence > 0.3,
    confidence,
    boundingBox: { x: (minX * scale) / canvasW, y: (minY * scale) / canvasH, w: (boxW * scale) / canvasW, h: (boxH * scale) / canvasH },
    aspectRatio,
    orientation: realW > realH ? "landscape" : "portrait",
    writingDensity: darkCellCount / (GRID_X * GRID_Y),
    writingRegions,
    paperArea: brightFraction,
  };
}

// ── Capture current video frame as JPEG base64 ──
function captureFrame(video: HTMLVideoElement, quality = 0.85): string | null {
  const c = document.createElement("canvas");
  c.width = video.videoWidth; c.height = video.videoHeight;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  return c.toDataURL("image/jpeg", quality).split(",")[1]; // strip data-URL prefix
}

// ── Claude vision analysis ──
async function analyseWithClaude(base64: string): Promise<AIAnalysis> {
  const resp = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64 },
          },
          {
            type: "text",
            text: `You are analysing a photo of a paper document, likely from a healthcare or clinical setting (patient forms, prescription pads, medical notes, administrative documents, etc.).

Extract and return the following as a JSON object with these exact keys:
{
  "documentType": "e.g. Patient intake form / Prescription / Clinical note / Unknown",
  "language": "detected language(s)",
  "contentSummary": "1–2 sentence summary of what the document is about",
  "fields": [{"label": "field name", "value": "field content"}],
  "writingStyle": "printed / handwritten / mixed",
  "completeness": "empty / partially filled / fully filled",
  "agencyNotes": "brief observation about the act of writing — what stage of annotation is visible, any incomplete fields, etc.",
  "rawText": "all legible text transcribed verbatim, empty string if nothing readable"
}

Return ONLY the JSON, no markdown fences, no explanation.`,
          },
        ],
      },
    ],
  });

  const text = resp.content[0].type === "text" ? resp.content[0].text : "{}";
  try {
    return JSON.parse(text) as AIAnalysis;
  } catch {
    return {
      documentType: "Unknown",
      language: "—",
      contentSummary: text.slice(0, 120),
      fields: [],
      writingStyle: "—",
      completeness: "—",
      agencyNotes: "—",
      rawText: "",
    };
  }
}

// ── Component ──
export function PaperScanPrototype() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const [meta, setMeta] = useState<PaperMetadata>(EMPTY_META);
  const [cameraState, setCameraState] = useState<"idle" | "requesting" | "active" | "denied" | "unsupported">("idle");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [aiError, setAiError] = useState<string>("");

  // ── Overlay drawing ──
  const drawOverlay = useCallback((m: PaperMetadata, w: number, h: number) => {
    const oc = overlayRef.current;
    if (!oc) return;
    const ctx = oc.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    if (!m.detected || !m.boundingBox) return;

    const { x, y, w: bw, h: bh } = m.boundingBox;
    const bx = x * w, by = y * h, bbw = bw * w, bbh = bh * h;

    ctx.strokeStyle = `rgba(255,255,255,${0.5 + m.confidence * 0.4})`;
    ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
    ctx.strokeRect(bx, by, bbw, bbh); ctx.setLineDash([]);

    const cs = 12;
    ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2;
    for (const [cx, cy, dx1, dy1, dx2, dy2] of [
      [bx, by, cs, 0, 0, cs], [bx + bbw, by, -cs, 0, 0, cs],
      [bx, by + bbh, cs, 0, 0, -cs], [bx + bbw, by + bbh, -cs, 0, 0, -cs],
    ] as const) {
      ctx.beginPath(); ctx.moveTo(cx + dx1, cy + dy1); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx2, cy + dy2); ctx.stroke();
    }

    for (const r of m.writingRegions) {
      ctx.fillStyle = "rgba(80,160,255,0.08)"; ctx.strokeStyle = "rgba(80,160,255,0.25)";
      ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.fillRect(r.x * w, r.y * h, r.w * w, r.h * h);
      ctx.strokeRect(r.x * w, r.y * h, r.w * w, r.h * h);
      ctx.setLineDash([]);
    }

    ctx.font = "10px monospace"; ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(`Paper ${(m.confidence * 100).toFixed(0)}%`, bx + 4, by - 6);
  }, []);

  // ── Analysis loop ──
  const startAnalysis = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const loop = () => {
      if (video.readyState < 2) { rafRef.current = requestAnimationFrame(loop); return; }
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) { rafRef.current = requestAnimationFrame(loop); return; }

      const overlay = overlayRef.current;
      if (overlay) { overlay.width = vw; overlay.height = vh; }
      canvas.width = vw; canvas.height = vh;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, vw, vh);
      const result = detectPaper(ctx.getImageData(0, 0, vw, vh), vw, vh);
      setMeta(result);
      drawOverlay(result, vw, vh);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawOverlay]);

  // ── Camera control ──
  const startCamera = useCallback(async (mode: "environment" | "user" = "environment") => {
    setCameraState("requesting");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraState("active");
      startAnalysis();
    } catch (err: unknown) {
      const e = err as Error;
      setCameraState(e.name === "NotFoundError" ? "unsupported" : "denied");
    }
  }, [startAnalysis]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle"); setMeta(EMPTY_META);
    setAiState("idle"); setAiResult(null);
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next); startCamera(next);
  }, [facingMode, startCamera]);

  // ── AI Analyse ──
  const handleAnalyse = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const base64 = captureFrame(video);
    if (!base64) return;
    setAiState("loading"); setAiResult(null); setAiError("");
    try {
      const result = await analyseWithClaude(base64);
      setAiResult(result); setAiState("done");
    } catch (err: unknown) {
      const e = err as Error;
      setAiError(e.message ?? "Unknown error"); setAiState("error");
    }
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const isActive = cameraState === "active";
  const canAnalyse = isActive && meta.detected && aiState !== "loading";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
          Prototype — Paper Detection + AI Analysis
        </p>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-xl">
          Point the camera at a paper document. The local vision layer detects
          the paper boundary and writing regions in real time. Tap{" "}
          <span className="font-mono">Analyse</span> to send a frame to Claude
          for content extraction and metadata.
        </p>
      </div>

      {/* Viewport */}
      <div className="relative w-full overflow-hidden bg-foreground/5 border border-foreground/10" style={{ aspectRatio: "16/9" }}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted style={{ display: isActive ? "block" : "none" }} />
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={overlayRef} className="absolute inset-0 w-full h-full" style={{ display: isActive ? "block" : "none", pointerEvents: "none" }} />

        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {cameraState === "idle" && (
              <>
                <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-foreground/40">
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

        {/* Status dot */}
        {isActive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: meta.detected ? "rgba(80,200,120,0.9)" : "rgba(255,255,255,0.3)" }} />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              {meta.detected ? "Paper" : "Scanning"}
            </span>
          </div>
        )}

        {/* AI loading overlay */}
        {aiState === "loading" && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-xs font-mono text-white/70 uppercase tracking-widest animate-pulse">Analysing…</p>
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
            <button onClick={handleAnalyse} disabled={!canAnalyse}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: canAnalyse ? "var(--foreground)" : undefined,
                color: canAnalyse ? "var(--foreground)" : undefined,
              }}>
              {aiState === "loading" ? "Analysing…" : "Analyse with AI"}
            </button>
          </>
        )}
      </div>

      {/* Vision metadata panel */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px border border-foreground/10">
        {[
          { label: "Detected", value: meta.detected ? "Yes" : "No", highlight: meta.detected },
          { label: "Confidence", value: meta.detected ? `${(meta.confidence * 100).toFixed(0)}%` : "—" },
          { label: "Aspect Ratio", value: meta.detected ? meta.aspectRatio : "—" },
          { label: "Orientation", value: meta.detected ? meta.orientation.charAt(0).toUpperCase() + meta.orientation.slice(1) : "—" },
          { label: "Frame Coverage", value: meta.detected ? `${(meta.paperArea * 100).toFixed(0)}%` : "—" },
          { label: "Writing Density", value: meta.detected ? `${(meta.writingDensity * 100).toFixed(0)}%` : "—" },
          { label: "Writing Regions", value: meta.detected ? `${meta.writingRegions.length}` : "—" },
          { label: "Agency", value: meta.detected && meta.writingDensity > 0.1 ? "Annotating" : meta.detected ? "Idle" : "—" },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="bg-foreground/[0.02] px-4 py-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-1">{label}</p>
            <p className="text-sm font-mono transition-colors"
              style={{ color: highlight ? "rgba(80,200,120,0.85)" : "var(--foreground)", opacity: highlight ? 1 : 0.65 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Writing activity bar */}
      {meta.detected && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30">Writing Activity</p>
            <p className="text-[10px] font-mono text-foreground/30">{(meta.writingDensity * 100).toFixed(0)}%</p>
          </div>
          <div className="h-px w-full bg-foreground/10 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-foreground/40 transition-all duration-500"
              style={{ width: `${meta.writingDensity * 100}%` }} />
          </div>
        </div>
      )}

      {/* ── AI Analysis results ── */}
      {aiState === "error" && (
        <div className="mt-8 border border-foreground/10 px-4 py-4">
          <p className="text-xs font-mono uppercase tracking-widest text-foreground/30 mb-2">AI Error</p>
          <p className="text-sm font-mono text-foreground/50">{aiError}</p>
        </div>
      )}

      {aiState === "done" && aiResult && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">
              AI Analysis — Claude
            </p>
          </div>

          {/* Top-level metadata */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px border border-foreground/10">
            {[
              { label: "Document Type", value: aiResult.documentType },
              { label: "Language", value: aiResult.language },
              { label: "Writing Style", value: aiResult.writingStyle },
              { label: "Completeness", value: aiResult.completeness },
            ].map(({ label, value }) => (
              <div key={label} className="bg-foreground/[0.02] px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-1">{label}</p>
                <p className="text-sm font-mono text-foreground/70">{value || "—"}</p>
              </div>
            ))}
          </div>

          {/* Content summary */}
          {aiResult.contentSummary && (
            <div className="border-t border-foreground/10 pt-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-2">Summary</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{aiResult.contentSummary}</p>
            </div>
          )}

          {/* Agency notes */}
          {aiResult.agencyNotes && (
            <div className="border-t border-foreground/10 pt-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-2">Agency Observation</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{aiResult.agencyNotes}</p>
            </div>
          )}

          {/* Detected fields */}
          {aiResult.fields.length > 0 && (
            <div className="border-t border-foreground/10 pt-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-3">Detected Fields</p>
              <div className="space-y-2">
                {aiResult.fields.map((f, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 text-sm">
                    <span className="col-span-2 font-mono text-foreground/40 truncate">{f.label}</span>
                    <span className="col-span-3 text-foreground/70">{f.value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw transcription */}
          {aiResult.rawText && (
            <div className="border-t border-foreground/10 pt-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 mb-3">Transcription</p>
              <pre className="text-xs font-mono text-foreground/60 whitespace-pre-wrap leading-relaxed bg-foreground/[0.02] border border-foreground/10 px-4 py-4">
                {aiResult.rawText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
