import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import audioMusic   from "../../../assets/audio_music.mp3";
import audioPhone   from "../../../assets/audio_phone.mp3";
import audioPodcast from "../../../assets/audio_podcast.mp3";

// ── Source definitions ─────────────────────────────────────────────
const SOURCE_DEFS = [
  { name: "Music",   color: 0x8b5cf6, trackIdx: 5, angle: Math.PI / 2 - 0.3, file: audioMusic,   muted: false, volume: 2.0 },
  { name: "Phone",   color: 0x16a34a, trackIdx: 2, angle: Math.PI / 3.5,     file: audioPhone,   muted: true,  volume: 1.0 },
  { name: "Podcast", color: 0xef4444, trackIdx: 8, angle: Math.PI * 0.68,    file: audioPodcast, muted: false, volume: 1.0 },
];


export function AudioDome() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const arcDotRef       = useRef<SVGCircleElement>(null);
  const trackThumbRef   = useRef<HTMLDivElement>(null);
  const trackStripRef   = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const setActiveIdxRef = useRef(setActiveIdx);

  // ── Spatial audio ──────────────────────────────────────────────
  const [audioState, setAudioState]   = useState<"off" | "loading" | "playing">("off");
  const [mutedSources, setMutedSources] = useState<boolean[]>(SOURCE_DEFS.map(d => d.muted));
  const mutedSourcesRef = useRef(mutedSources);
  mutedSourcesRef.current = mutedSources;

  const audioCtxRef   = useRef<AudioContext | null>(null);
  const pannersRef    = useRef<PannerNode[]>([]);
  const gainNodesRef  = useRef<GainNode[]>([]);
  const bufSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const toggleMute = (i: number) => {
    const next = mutedSourcesRef.current.map((m, idx) => idx === i ? !m : m);
    setMutedSources(next);
    const g = gainNodesRef.current[i];
    if (g) g.gain.value = next[i] ? 0 : SOURCE_DEFS[i].volume;
  };

  const togglePreview = async () => {
    if (audioState === "playing" || audioState === "loading") {
      bufSourcesRef.current.forEach(s => { try { s.stop(); } catch { /* already stopped */ } });
      audioCtxRef.current?.close();
      audioCtxRef.current   = null;
      pannersRef.current    = [];
      gainNodesRef.current  = [];
      bufSourcesRef.current = [];
      setAudioState("off");
      return;
    }

    setAudioState("loading");
    const ctx = new AudioContext();
    await ctx.resume();
    audioCtxRef.current = ctx;

    const panners: PannerNode[]              = [];
    const gains: GainNode[]                  = [];
    const bufSources: AudioBufferSourceNode[] = [];

    for (let i = 0; i < SOURCE_DEFS.length; i++) {
      const def = SOURCE_DEFS[i];

      const panner = ctx.createPanner();
      panner.panningModel  = "HRTF";
      panner.distanceModel = "inverse";
      panner.refDistance   = 6;
      panner.rolloffFactor = 0.6;
      panner.connect(ctx.destination);
      panners.push(panner);

      const gainNode = ctx.createGain();
      gainNode.gain.value = mutedSourcesRef.current[i] ? 0 : def.volume;
      gainNode.connect(panner);
      gains.push(gainNode);

      const res      = await fetch(def.file);
      const arrBuf   = await res.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(arrBuf);
      const source   = ctx.createBufferSource();
      source.buffer  = audioBuf;
      source.loop    = true;
      source.connect(gainNode);
      source.start();
      bufSources.push(source);
    }

    pannersRef.current    = panners;
    gainNodesRef.current  = gains;
    bufSourcesRef.current = bufSources;
    setAudioState("playing");
  };

  useEffect(() => {
    const container  = containerRef.current;
    const wrapper    = wrapperRef.current;
    const trackStrip = trackStripRef.current;
    if (!container || !wrapper || !trackStrip) return;

    // ── Scene ──────────────────────────────────────────────────────
    const BG = 0xf2f2f4;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 14, 32);

    const camera = new THREE.PerspectiveCamera(
      62,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-7, 5, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(BG);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);


    // ── Geometry ───────────────────────────────────────────────────
    const R   = 6.5;
    const INK = 0x1a1a1a;

    function createArc(
      radius: number,
      startAngle: number,
      endAngle: number,
      mat: THREE.LineBasicMaterial
    ) {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, endAngle, false, 0);
      const geo   = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
      return new THREE.Line(geo, mat);
    }

    const baseLineMaterial = new THREE.LineBasicMaterial({
      color: INK, transparent: true, opacity: 0.28,
      depthWrite: false, blending: THREE.NormalBlending,
    });

    const boundaryGeo  = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2, false, 0).getPoints(128)
    );
    const boundaryLine = new THREE.LineLoop(boundaryGeo, baseLineMaterial.clone());
    boundaryLine.rotation.x = -Math.PI / 2;
    sphereGroup.add(boundaryLine);

    const numSlices = 11;
    const sliceTracks: { phi: number; mesh: THREE.Line }[] = [];

    for (let i = 0; i < numSlices; i++) {
      const phi = (i / (numSlices - 1)) * Math.PI - Math.PI / 2;
      const x   = R * Math.sin(phi);
      const r   = R * Math.cos(phi);
      if (r > 0.05) {
        const mat = baseLineMaterial.clone();
        const arc = createArc(r, 0, Math.PI, mat);
        arc.rotation.y = -Math.PI / 2;
        arc.position.x = x;
        sphereGroup.add(arc);
        sliceTracks.push({ phi, mesh: arc });
      }
    }

    // ── Avatar ─────────────────────────────────────────────────────
    const avatarGroup = new THREE.Group();
    const avatarMat   = new THREE.LineBasicMaterial({
      color: INK, transparent: true, opacity: 0.45, depthWrite: false,
    });

    const headSphereGeo = new THREE.SphereGeometry(0.6, 9, 6);
    const headEdgesGeo  = new THREE.EdgesGeometry(headSphereGeo, 8);
    const head = new THREE.LineSegments(headEdgesGeo, avatarMat.clone());
    head.scale.set(0.9, 1.12, 0.85);
    head.position.y = 1.66;

    const shoulderCurve  = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 1.08, 0), new THREE.Vector3(-0.55, 1.0,  0),
      new THREE.Vector3(-0.88, 0.78, 0), new THREE.Vector3(-1.05, 0.5,  0),
    ]);
    const shoulderCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3( 0.22, 1.08, 0), new THREE.Vector3( 0.55, 1.0,  0),
      new THREE.Vector3( 0.88, 0.78, 0), new THREE.Vector3( 1.05, 0.5,  0),
    ]);
    const mkLine = (curve: THREE.CatmullRomCurve3) => {
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      return new THREE.Line(geo, avatarMat.clone());
    };

    const neckGeo  = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.06, 0), new THREE.Vector3(0, 1.28, 0),
    ]);
    const neckLine = new THREE.Line(neckGeo, avatarMat.clone());

    avatarGroup.add(head, mkLine(shoulderCurve), mkLine(shoulderCurveR), neckLine);
    sphereGroup.add(avatarGroup);

    // ── Three audio sources ────────────────────────────────────────
    const sources = SOURCE_DEFS.map(cfg => {
      const group = new THREE.Group();
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 16, 16),
        new THREE.MeshBasicMaterial({ color: cfg.color })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 16, 16),
        new THREE.MeshBasicMaterial({
          color: cfg.color, transparent: true, opacity: 0.2,
          blending: THREE.NormalBlending, depthWrite: false,
        })
      );
      group.add(dot, halo);
      sphereGroup.add(group);
      return {
        group, halo, color: cfg.color,
        targetTrackIndex: cfg.trackIdx,
        targetAngle:      cfg.angle,
        visualPhi:        sliceTracks[cfg.trackIdx].phi,
        visualAngle:      cfg.angle,
        visualScale:      1.0,
      };
    });

    // ── Interaction state ──────────────────────────────────────────
    let activeIdx         = 0;  // local mutable for animation loop
    let isDragging        = false;
    let dragStartPos      = { x: 0, y: 0 };
    let pointerDownTime   = 0;
    let lastPointerY      = 0;
    let lastPointerX      = 0;
    let initialTrackIndex = 0;
    let lockedAxis: "horizontal" | "vertical" | null = null;

    // Convenience getters for the active source
    const active = () => sources[activeIdx];

    // Horizontal sensitivity weight relative to vertical.
    // Derived from camera geometry: camera is offset ~26° from the Z axis,
    // so world-Z changes project to ~sin(26°) ≈ 0.44 of screen-X per unit.
    const C = 0.75;

    const onPointerDown = (e: PointerEvent) => {
      isDragging        = true;
      lockedAxis        = null;
      pointerDownTime   = Date.now();
      dragStartPos      = { x: e.clientX, y: e.clientY };
      lastPointerY      = e.clientY;
      lastPointerX      = e.clientX;
      initialTrackIndex = active().targetTrackIndex;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const dx     = e.clientX - dragStartPos.x;
      const dy     = e.clientY - dragStartPos.y;
      const deltaY = e.clientY - lastPointerY;
      const deltaX = e.clientX - lastPointerX;
      lastPointerY = e.clientY;
      lastPointerX = e.clientX;

      if (!lockedAxis) {
        if (Math.sqrt(dx * dx + dy * dy) < 14) return;
        lockedAxis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      const src     = active();
      const cosA    = Math.cos(src.targetAngle);
      const sinA    = Math.sin(src.targetAngle);
      const nearTop = sinA > 0.5;

      if (lockedAxis === "vertical" || (lockedAxis === "horizontal" && nearTop)) {
        const dAngle     = (-deltaY * cosA - deltaX * C * sinA) / 120;
        const prev       = src.targetAngle;
        src.targetAngle  = Math.max(0, Math.min(Math.PI, src.targetAngle + dAngle));
        const SNAP = 0.12;
        if ((prev - Math.PI / 2) * (src.targetAngle - Math.PI / 2) < 0 && Math.abs(dAngle) > 0.004) {
          src.targetAngle = Math.PI / 2 + Math.sign(src.targetAngle - Math.PI / 2) * SNAP;
        }
      }

      if (lockedAxis === "horizontal" && !nearTop) {
        const shift = Math.round(dx / 40);
        src.targetTrackIndex = Math.max(0, Math.min(sliceTracks.length - 1, initialTrackIndex + shift));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      // Short tap (no drag) → select the closest source dot
      const dist = Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y);
      if (Date.now() - pointerDownTime < 260 && dist < 8) {
        const rect = container.getBoundingClientRect();
        let closestIdx = -1;
        let closestDist = 64; // px tap threshold
        sources.forEach((src, i) => {
          const pos = src.group.position.clone();
          pos.project(camera);
          const sx = (pos.x + 1) / 2 * rect.width  + rect.left;
          const sy = (-pos.y + 1) / 2 * rect.height + rect.top;
          const d  = Math.hypot(e.clientX - sx, e.clientY - sy);
          if (d < closestDist) { closestDist = d; closestIdx = i; }
        });
        if (closestIdx !== -1) {
          activeIdx = closestIdx;
          initialTrackIndex = active().targetTrackIndex;
          setActiveIdxRef.current(activeIdx);
        }
      }
      isDragging = false;
      lockedAxis = null;
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove",  onPointerMove);
    window.addEventListener("pointerup",    onPointerUp);

    const onResize = () => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    // ResizeObserver reacts to CSS fullscreen layout changes
    // (window resize event alone misses element-level size changes on iOS)
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize);

    // ── Animation loop ─────────────────────────────────────────────
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const act = active();

      sliceTracks.forEach((track, i) => {
        const mat = track.mesh.material as THREE.LineBasicMaterial;
        mat.opacity += ((i === act.targetTrackIndex ? 1.0 : 0.2) - mat.opacity) * 0.1;
      });

      // Update all sources
      sources.forEach((src, i) => {
        const isActive = i === activeIdx;
        const targetS  = isActive ? (isDragging ? 1.4 : 1.0) : 0.72;
        src.visualScale += (targetS - src.visualScale) * 0.15;
        src.group.scale.setScalar(src.visualScale);
        if (isActive && !isDragging) {
          src.halo.scale.setScalar(1.0 + Math.sin(Date.now() * 0.005) * 0.1);
        }
        src.visualPhi   += (sliceTracks[src.targetTrackIndex].phi - src.visualPhi)   * 0.12;
        src.visualAngle += (src.targetAngle - src.visualAngle) * 0.12;
        const sx = R * Math.sin(src.visualPhi);
        const sr = R * Math.cos(src.visualPhi);
        src.group.position.set(sx, sr * Math.sin(src.visualAngle), sr * Math.cos(src.visualAngle));
      });

      renderer.render(scene, camera);

      // ── Spatial audio: sync panner positions every frame ──────
      if (pannersRef.current.length) {
        sources.forEach((src, i) => {
          const p = pannersRef.current[i];
          if (!p) return;
          const px = R * Math.sin(src.visualPhi);
          const pr = R * Math.cos(src.visualPhi);
          p.positionX.value =  px;
          p.positionY.value =  pr * Math.sin(src.visualAngle);
          p.positionZ.value = -pr * Math.cos(src.visualAngle);
        });
      }

      // ── Arc indicator — tracks active source ──────────────────
      if (arcDotRef.current) {
        const cx = 28 - 24 * Math.cos(act.visualAngle);
        const cy = 34 - 24 * Math.sin(act.visualAngle);
        arcDotRef.current.setAttribute("cx", String(cx.toFixed(2)));
        arcDotRef.current.setAttribute("cy", String(cy.toFixed(2)));
        arcDotRef.current.setAttribute("fill", `#${act.color.toString(16).padStart(6, "0")}88`);
      }

      // ── Bottom strip: thumb slides left–right ──────────────────
      if (trackThumbRef.current) {
        const tw   = trackStrip.clientWidth;
        const padX = 16;
        const norm = (act.visualPhi + Math.PI / 2) / Math.PI;
        trackThumbRef.current.style.left      = `${padX + norm * (tw - padX * 2)}px`;
        trackThumbRef.current.style.background = `#${act.color.toString(16).padStart(6, "0")}`;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove",  onPointerMove);
      window.removeEventListener("pointerup",    onPointerUp);
      window.removeEventListener("resize",       onResize);
      ro.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const N = 11;

  return (
  <div>
    <div
      ref={wrapperRef}
      style={{
        position: "relative", width: "100%", maxWidth: "400px", margin: "0 auto",
        borderRadius: "16px", overflow: "hidden", touchAction: "none",
        background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(200,200,205,0.6) 0%, #f2f2f4 70%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', sans-serif",
      }}
    >
      {/* 3D canvas */}
      <div
        ref={containerRef}
        style={{ width: "100%", aspectRatio: "3 / 4", display: "block", pointerEvents: "none" }}
      />

      {/* ── Arc position indicator — SVG semicircle, bottom-right ── */}
      <div style={{
        position: "absolute", right: "14px", bottom: "68px",
        pointerEvents: "none",
      }}>
        <svg width="56" height="42" viewBox="0 0 56 42" fill="none">
          {/* Semicircle arc: front(left) → overhead(top) → back(right) */}
          <path d="M 4,38 A 24,24 0 0,1 52,38" stroke="rgba(26,26,26,0.12)" strokeWidth="1" />
          {/* End-cap ticks */}
          <line x1="4" y1="35" x2="4" y2="38" stroke="rgba(26,26,26,0.18)" strokeWidth="1" />
          <line x1="52" y1="35" x2="52" y2="38" stroke="rgba(26,26,26,0.18)" strokeWidth="1" />
          {/* Labels */}
          <text x="4"  y="42" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgba(26,26,26,0.22)">F</text>
          <text x="52" y="42" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgba(26,26,26,0.22)">B</text>
          {/* Moving dot */}
          <circle ref={arcDotRef} cx="4" cy="38" r="3" fill="rgba(26,26,26,0.45)" />
        </svg>
      </div>

      {/* ── Bottom strip: track indicator, centered ── */}
      <div
        ref={trackStripRef}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
          pointerEvents: "none",
        }}
      >
        <div style={{
          position: "absolute", top: "50%", left: "16px", right: "16px",
          transform: "translateY(-50%)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {Array.from({ length: N }, (_, i) => (
            <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,0.18)", flexShrink: 0 }} />
          ))}
        </div>
        <span style={{
          position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
          fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase",
          color: "rgba(0,0,0,0.22)", userSelect: "none", whiteSpace: "nowrap",
        }}>track</span>
        <div
          ref={trackThumbRef}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "10px", height: "10px", borderRadius: "50%",
            background: "rgba(26,26,26,0.65)",
            boxShadow: "0 0 0 3px rgba(26,26,26,0.1)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Source selector chips — top left */}
      <div style={{
        position: "absolute", top: "16px", left: "16px",
        display: "flex", flexDirection: "column", gap: "6px",
      }}>
        {SOURCE_DEFS.map((src, i) => {
          const hex    = `#${src.color.toString(16).padStart(6, "0")}`;
          const isActive = i === activeIdx;
          const isMuted  = mutedSources[i];
          return (
            <button
              key={i}
              onClick={() => toggleMute(i)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: isActive && !isMuted ? `${hex}22` : "rgba(255,255,255,0.55)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${isActive && !isMuted ? `${hex}66` : "rgba(0,0,0,0.08)"}`,
                borderRadius: "20px", padding: "4px 8px 4px 7px",
                cursor: "pointer", transition: "all 0.2s",
                opacity: isMuted ? 0.45 : 1,
              }}
            >
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: isMuted ? "rgba(0,0,0,0.25)" : hex,
                boxShadow: isActive && !isMuted ? `0 0 0 2px ${hex}44` : "none",
                transition: "all 0.2s",
              }} />
              <span style={{
                fontSize: "11px", letterSpacing: "0.04em",
                color: isActive && !isMuted ? hex : "rgba(0,0,0,0.4)",
                fontWeight: isActive && !isMuted ? 600 : 400,
                textDecoration: isMuted ? "line-through" : "none",
              }}>
                {src.name}
              </span>
              {/* mute/unmute icon */}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
                stroke={isMuted ? "rgba(0,0,0,0.3)" : hex} strokeWidth="1.2" strokeLinecap="round">
                {isMuted
                  ? <><line x1="1" y1="1" x2="8" y2="8"/><line x1="8" y1="1" x2="1" y2="8"/></>
                  : <><path d="M1.5 3H0.75a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25H1.5l2 1.5V1.5L1.5 3z"/><path d="M6 3a2 2 0 0 1 0 3"/></>
                }
              </svg>
            </button>
          );
        })}
      </div>

      {/* Hint pill */}
      <div style={{
        position: "absolute", top: "20px", right: "16px",
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)",
        padding: "6px 12px", borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.08)",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        <p style={{ margin: 0, fontSize: "10px", color: "rgba(0,0,0,0.35)", lineHeight: 1.5 }}>
          tap · drag
        </p>
      </div>


    </div>

    {/* Preview button + tag */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "16px" }}>
      <button
        onClick={togglePreview}
        className="bg-foreground"
        style={{
          borderRadius: "62px", padding: "16px 40px",
          border: "none", cursor: audioState === "loading" ? "wait" : "pointer",
          display: "inline-flex", alignItems: "center", gap: "10px",
          whiteSpace: "nowrap", transition: "opacity 0.2s",
        }}
      >
        <span className="text-background" style={{ fontSize: "18px", fontWeight: 500, lineHeight: 1 }}>
          {audioState === "loading" ? "Loading…" : audioState === "playing" ? "Stop" : "Preview"}
        </span>
        <span className="text-background/50" style={{ fontSize: "11px", fontWeight: 400, lineHeight: 1 }}>
          {audioState === "playing" ? "(spatial audio on)" : "(best with headphones)"}
        </span>
      </button>
    </div>
  </div>
  );
}
