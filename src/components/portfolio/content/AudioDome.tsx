import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export function AudioDome() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const arcDotRef     = useRef<SVGCircleElement>(null);
  const trackThumbRef = useRef<HTMLDivElement>(null);
  const trackStripRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Fullscreen logic ───────────────────────────────────────────
  // iOS (Safari & Chrome) does not support the Fullscreen API at all.
  // We use CSS position:fixed as the primary approach, and try native API
  // as a progressive enhancement for Android Chrome / desktop.
  const enterFullscreen = () => {
    setIsFullscreen(true);
    // Trigger Three.js resize after layout settles
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    const el = wrapperRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {/* CSS fallback already active */});
    } else if ((el as HTMLDivElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
      (el as HTMLDivElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
    };
  }, []);

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
    const R = 6.5;

    function createArc(
      radius: number,
      startAngle: number,
      endAngle: number,
      mat: THREE.LineBasicMaterial
    ) {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, endAngle, false, 0);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
      return new THREE.Line(geo, mat);
    }

    const INK = 0x1a1a1a;
    const baseLineMaterial = new THREE.LineBasicMaterial({
      color: INK, transparent: true, opacity: 0.15,
      depthWrite: false, blending: THREE.NormalBlending,
    });

    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2, false, 0).getPoints(128)
    );
    const boundaryLine = new THREE.LineLoop(boundaryGeo, baseLineMaterial.clone());
    boundaryLine.rotation.x = -Math.PI / 2;
    sphereGroup.add(boundaryLine);

    const numSlices = 11;
    const sliceTracks: { phi: number; mesh: THREE.Line }[] = [];

    for (let i = 0; i < numSlices; i++) {
      const phi = (i / (numSlices - 1)) * Math.PI - Math.PI / 2;
      const x = R * Math.sin(phi);
      const r = R * Math.cos(phi);
      if (r > 0.05) {
        const mat = baseLineMaterial.clone();
        const arc = createArc(r, 0, Math.PI, mat);
        arc.rotation.y = -Math.PI / 2;
        arc.position.x = x;
        sphereGroup.add(arc);
        sliceTracks.push({ phi, mesh: arc });
      }
    }

    // ── Avatar — line-based, matches dome visual language ──────────
    const avatarGroup = new THREE.Group();

    const avatarMat = new THREE.LineBasicMaterial({
      color: INK, transparent: true, opacity: 0.22, depthWrite: false,
    });

    // Head: low-poly sphere edges — same line style as dome arcs
    const headSphereGeo = new THREE.SphereGeometry(0.6, 9, 6);
    const headEdgesGeo  = new THREE.EdgesGeometry(headSphereGeo, 8);
    const head = new THREE.LineSegments(headEdgesGeo, avatarMat.clone());
    head.scale.set(0.9, 1.12, 0.85);
    head.position.y = 1.66;

    // Shoulders: two arcs curving outward from neck
    const shoulderCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 1.08, 0),
      new THREE.Vector3(-0.55, 1.0,  0),
      new THREE.Vector3(-0.88, 0.78, 0),
      new THREE.Vector3(-1.05, 0.5,  0),
    ]);
    const shoulderCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3( 0.22, 1.08, 0),
      new THREE.Vector3( 0.55, 1.0,  0),
      new THREE.Vector3( 0.88, 0.78, 0),
      new THREE.Vector3( 1.05, 0.5,  0),
    ]);
    const mkLine = (curve: THREE.CatmullRomCurve3) => {
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      return new THREE.Line(geo, avatarMat.clone());
    };

    // Neck: short vertical segment
    const neckGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.06, 0),
      new THREE.Vector3(0, 1.28, 0),
    ]);
    const neckLine = new THREE.Line(neckGeo, avatarMat.clone());

    avatarGroup.add(head, mkLine(shoulderCurve), mkLine(shoulderCurveR), neckLine);
    sphereGroup.add(avatarGroup);

    // ── Three audio sources ────────────────────────────────────────
    const sourceConfigs = [
      { color: 0x1a1a1a, trackIdx: 5, angle: Math.PI / 2 - 0.3 },  // neutral dark
      { color: 0x5c2a10, trackIdx: 2, angle: Math.PI / 3.5 },       // warm sienna
      { color: 0x10284a, trackIdx: 8, angle: Math.PI * 0.68 },      // cool navy
    ];

    const sources = sourceConfigs.map(cfg => {
      const group = new THREE.Group();
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: cfg.color })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 16),
        new THREE.MeshBasicMaterial({
          color: cfg.color, transparent: true, opacity: 0.12,
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
    let activeIdx         = 0;
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
      // Short tap (no drag) → cycle to next source
      const dist = Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y);
      if (Date.now() - pointerDownTime < 260 && dist < 8) {
        activeIdx = (activeIdx + 1) % sources.length;
        initialTrackIndex = active().targetTrackIndex;
      }
      isDragging = false;
      lockedAxis = null;
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove",  onPointerMove);
    window.addEventListener("pointerup",    onPointerUp);

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ─────────────────────────────────────────────
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const act = active();

      sliceTracks.forEach((track, i) => {
        const mat = track.mesh.material as THREE.LineBasicMaterial;
        mat.opacity += ((i === act.targetTrackIndex ? 0.85 : 0.12) - mat.opacity) * 0.1;
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
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const N = 11;

  const wrapperStyle: React.CSSProperties = isFullscreen
    ? { position: "fixed", inset: 0, zIndex: 9999, maxWidth: "none", borderRadius: 0,
        width: "100%", height: "100%",
        overflow: "hidden", touchAction: "none",
        background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(200,200,205,0.6) 0%, #f2f2f4 70%)" }
    : { position: "relative", width: "100%", maxWidth: "400px", margin: "0 auto",
        borderRadius: "16px", overflow: "hidden", touchAction: "none",
        background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(200,200,205,0.6) 0%, #f2f2f4 70%)" };

  const canvasStyle: React.CSSProperties = isFullscreen
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }
    : { width: "100%", aspectRatio: "3 / 4", display: "block", pointerEvents: "none" };

  return (
  <div>
    <div ref={wrapperRef} style={wrapperStyle}>
      {/* 3D canvas */}
      <div ref={containerRef} style={canvasStyle} />

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
          fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
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

      {/* Source selector dots — tap card to cycle */}
      <div style={{
        position: "absolute", top: "16px", right: "16px",
        display: "flex", gap: "6px", alignItems: "center",
        pointerEvents: "none",
      }}>
        {([0x1a1a1a, 0x5c2a10, 0x10284a] as const).map((color, i) => (
          <div key={i} style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: `#${color.toString(16).padStart(6, "0")}`,
            opacity: 0.5,
          }} />
        ))}
      </div>

      {/* Hint pill */}
      <div style={{
        position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)",
        padding: "8px 16px", borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.08)",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(0,0,0,0.4)", lineHeight: 1.5 }}>
          tap to select &nbsp;·&nbsp; swipe to move
        </p>
      </div>

      {/* Exit button — shown inside the dome when fullscreen */}
      {isFullscreen && (
        <div style={{ position: "absolute", bottom: "32px", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}>
          <button
            onClick={exitFullscreen}
            style={{
              background: "#060606", borderRadius: "62px", padding: "14px 36px",
              border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 500, color: "#ffffff", lineHeight: 1 }}>
              Exit full screen
            </span>
          </button>
        </div>
      )}
    </div>

    {/* Enter fullscreen button — shown below the dome when not fullscreen */}
    {!isFullscreen && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={enterFullscreen}
          style={{
            background: "#060606", borderRadius: "62px", padding: "16px 40px",
            border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 500, color: "#ffffff", lineHeight: 1 }}>
            Full screen
          </span>
          <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>
            (Optimised for phone)
          </span>
        </button>
      </div>
    )}
  </div>
  );
}
