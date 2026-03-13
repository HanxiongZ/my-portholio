import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function AudioDome() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const angleThumbRef = useRef<HTMLDivElement>(null);
  const trackThumbRef = useRef<HTMLDivElement>(null);
  const elevStripRef  = useRef<HTMLDivElement>(null);
  const trackStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container  = containerRef.current;
    const wrapper    = wrapperRef.current;
    const elevStrip  = elevStripRef.current;
    const trackStrip = trackStripRef.current;
    if (!container || !wrapper || !elevStrip || !trackStrip) return;

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

    const avatarGroup = new THREE.Group();
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.5 })
    );
    head.position.y = 1.6;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.2, 1.2, 16),
      new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, transparent: true, opacity: 0.35 })
    );
    body.position.y = 0.6;
    avatarGroup.add(head, body);
    sphereGroup.add(avatarGroup);

    const sourceGroup = new THREE.Group();
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({ color: INK })
    );
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 16),
      new THREE.MeshBasicMaterial({
        color: INK, transparent: true, opacity: 0.15,
        blending: THREE.NormalBlending, depthWrite: false,
      })
    );
    sourceGroup.add(dot, halo);
    sphereGroup.add(sourceGroup);

    // ── Interaction state ──────────────────────────────────────────
    let targetTrackIndex  = Math.floor(sliceTracks.length / 2);
    let targetAngle       = Math.PI / 2 - 0.3;
    let visualPhi         = sliceTracks[targetTrackIndex].phi;
    let visualAngle       = targetAngle;
    let visualScale       = 1.0;
    let isDragging        = false;
    let dragStartPos      = { x: 0, y: 0 };
    let lastPointerY      = 0;
    let lastPointerX      = 0;
    let initialTrackIndex = 0;
    let lockedAxis: "horizontal" | "vertical" | null = null;

    // Horizontal sensitivity weight relative to vertical.
    // Derived from camera geometry: camera is offset ~26° from the Z axis,
    // so world-Z changes project to ~sin(26°) ≈ 0.44 of screen-X per unit.
    const C = 0.75;

    const onPointerDown = (e: PointerEvent) => {
      isDragging        = true;
      lockedAxis        = null;
      dragStartPos      = { x: e.clientX, y: e.clientY };
      lastPointerY      = e.clientY;
      lastPointerX      = e.clientX;
      initialTrackIndex = targetTrackIndex;
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

      const cosA   = Math.cos(targetAngle);
      const sinA   = Math.sin(targetAngle);
      // sin(θ) > 0.5 means within ~30° of the top — horizontal gesture zone.
      const nearTop = sinA > 0.5;

      // ── Elevation: tangent-following formula ──────────────────────
      // dAngle = (−deltaY·cos θ − deltaX·C·sin θ) / sens
      //
      // This projects the gesture onto the arc tangent at the current angle:
      //   - Near front/back (cos≈1, sin≈0): only vertical drives the angle
      //   - Near top       (cos≈0, sin≈1): only horizontal drives the angle
      //   - cos(θ) changes sign at π/2 by itself → no onBackSide flip needed
      //   - Smooth blend in between
      //
      // Active when: locked vertical anywhere, OR locked horizontal near top.
      if (lockedAxis === "vertical" || (lockedAxis === "horizontal" && nearTop)) {
        const dAngle = (-deltaY * cosA - deltaX * C * sinA) / 120;
        const prev   = targetAngle;
        targetAngle  = Math.max(0, Math.min(Math.PI, targetAngle + dAngle));

        // Snap-through: if the gesture crossed π/2 with enough velocity,
        // push it a little past so the dot doesn't hover at the exact peak.
        const SNAP = 0.12;
        if ((prev - Math.PI / 2) * (targetAngle - Math.PI / 2) < 0 && Math.abs(dAngle) > 0.004) {
          targetAngle = Math.PI / 2 + Math.sign(targetAngle - Math.PI / 2) * SNAP;
        }
      }

      // ── Track: only when clearly horizontal and away from top ─────
      if (lockedAxis === "horizontal" && !nearTop) {
        const shift = Math.round(dx / 40);
        targetTrackIndex = Math.max(0, Math.min(sliceTracks.length - 1, initialTrackIndex + shift));
      }
    };

    const onPointerUp = () => { isDragging = false; lockedAxis = null; };

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

      sliceTracks.forEach((track, i) => {
        const mat = track.mesh.material as THREE.LineBasicMaterial;
        mat.opacity += ((i === targetTrackIndex ? 0.85 : 0.12) - mat.opacity) * 0.1;
      });

      const targetS = isDragging ? 1.4 : 1.0;
      visualScale += (targetS - visualScale) * 0.15;
      sourceGroup.scale.setScalar(visualScale);
      if (!isDragging) halo.scale.setScalar(1.0 + Math.sin(Date.now() * 0.005) * 0.1);

      visualPhi   += (sliceTracks[targetTrackIndex].phi - visualPhi)   * 0.12;
      visualAngle += (targetAngle - visualAngle) * 0.12;

      const sx = R * Math.sin(visualPhi);
      const sr = R * Math.cos(visualPhi);
      sourceGroup.position.set(sx, sr * Math.sin(visualAngle), sr * Math.cos(visualAngle));

      renderer.render(scene, camera);

      // ── Right strip: thumb traces an arc in 2D ─────────────────
      // X within strip: cos(angle) maps front(left) → top(center) → back(right)
      // Y within strip: sin(angle) maps floor(bottom) → overhead(top)
      if (angleThumbRef.current) {
        const hw  = elevStrip.clientWidth;
        const hh  = elevStrip.clientHeight;
        const padX = 12, padY = 20;
        const tx = padX + (1 - Math.cos(visualAngle)) / 2 * (hw - padX * 2);
        const ty = padY + (1 - Math.sin(visualAngle))      * (hh - padY * 2);
        angleThumbRef.current.style.left = `${tx}px`;
        angleThumbRef.current.style.top  = `${ty}px`;
      }

      // ── Bottom strip: thumb slides left–right ──────────────────
      if (trackThumbRef.current) {
        const tw   = trackStrip.clientWidth;
        const padX = 16;
        const norm = (visualPhi + Math.PI / 2) / Math.PI;
        trackThumbRef.current.style.left = `${padX + norm * (tw - padX * 2)}px`;
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

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative", width: "100%", maxWidth: "400px", margin: "0 auto",
        borderRadius: "16px", overflow: "hidden", touchAction: "none",
        background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(200,200,205,0.6) 0%, #f2f2f4 70%)",
      }}
    >
      {/* 3D canvas */}
      <div
        ref={containerRef}
        style={{ width: "100%", aspectRatio: "3 / 4", display: "block", pointerEvents: "none" }}
      />

      {/* ── Right strip: subtle 2D position indicator, bottom-right ── */}
      <div
        ref={elevStripRef}
        style={{
          position: "absolute", right: 0, bottom: "68px",
          width: "48px", height: "88px",
          pointerEvents: "none",
        }}
      >
        {/* Reference dots: front bottom-left, overhead top-center, back bottom-right */}
        <div style={{ position: "absolute", left: "10px",  bottom: "10px", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", left: "50%",   top:    "10px", transform: "translateX(-50%)", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", right: "10px", bottom: "10px", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
        {/* Labels */}
        <span style={{ position: "absolute", left: "4px",  bottom: "2px", fontSize: "7px", fontFamily: "monospace", color: "rgba(0,0,0,0.2)", userSelect: "none" }}>F</span>
        <span style={{ position: "absolute", right: "4px", bottom: "2px", fontSize: "7px", fontFamily: "monospace", color: "rgba(0,0,0,0.2)", userSelect: "none" }}>B</span>
        <span style={{ position: "absolute", left: "50%",  top:    "2px", transform: "translateX(-50%)", fontSize: "7px", fontFamily: "monospace", color: "rgba(0,0,0,0.2)", userSelect: "none" }}>↑</span>
        {/* Moving thumb */}
        <div
          ref={angleThumbRef}
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: "5px", height: "5px", borderRadius: "50%",
            background: "rgba(26,26,26,0.3)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* ── Bottom strip: left/right track indicator ── */}
      <div
        ref={trackStripRef}
        style={{
          position: "absolute", bottom: 0, left: 0, right: "52px", height: "60px",
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

      {/* Hint pill */}
      <div style={{
        position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)",
        padding: "8px 16px", borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.08)",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(0,0,0,0.4)", lineHeight: 1.5 }}>
          ↔ swipe to switch track &nbsp;·&nbsp; ↕ swipe to move position
        </p>
      </div>
    </div>
  );
}
