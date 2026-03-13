import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function AudioDome() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ──────────────────────────────────────────────────────
    const BG = 0xf2f2f4;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 12, 28);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-10, 7, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(BG);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // ── Geometry ───────────────────────────────────────────────────
    const R = 5;

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
      color: INK,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    // Boundary circle
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2, false, 0).getPoints(128)
    );
    const boundaryLine = new THREE.LineLoop(boundaryGeo, baseLineMaterial.clone());
    boundaryLine.rotation.x = -Math.PI / 2;
    sphereGroup.add(boundaryLine);

    // Vertical arc tracks
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

    // Simple wireframe avatar
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

    // Audio source node — dark dot + soft gray halo
    const sourceGroup = new THREE.Group();
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshBasicMaterial({ color: INK })
    );
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({
        color: INK,
        transparent: true,
        opacity: 0.15,
        blending: THREE.NormalBlending,
        depthWrite: false,
      })
    );
    sourceGroup.add(dot, halo);
    sphereGroup.add(sourceGroup);

    // ── Interaction state ──────────────────────────────────────────
    let targetTrackIndex = Math.floor(sliceTracks.length / 2);
    let targetAngle = Math.PI / 2;
    let visualPhi = sliceTracks[targetTrackIndex].phi;
    let visualAngle = targetAngle;
    let visualScale = 1.0;
    let isDragging = false;
    let dragStartPos = { x: 0, y: 0 };
    let initialTrackIndex = 0;
    let initialAngle = 0;
    let dragMode: "horizontal" | "vertical" | null = null;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartPos = { x: e.clientX, y: e.clientY };
      initialTrackIndex = targetTrackIndex;
      initialAngle = targetAngle;
      dragMode = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;

      if (!dragMode) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 20) {
          // Angle from horizontal axis (0° = right, 90° = down)
          const angle = Math.abs(Math.atan2(dy, dx)) * (180 / Math.PI);
          if (angle < 30 || angle > 150) dragMode = "horizontal";       // within 30° of horizontal
          else if (angle > 60 && angle < 120) dragMode = "vertical";    // within 30° of vertical
          // 30–60° / 120–150° diagonal zone: keep waiting
        }
      }

      if (dragMode === "horizontal") {
        const shift = Math.round(dx / 35);
        targetTrackIndex = Math.max(0, Math.min(sliceTracks.length - 1, initialTrackIndex + shift));
      } else if (dragMode === "vertical") {
        // When source starts behind the top (cos < 0), screen-up maps to arc going
        // back toward top, so invert the drag direction to match visual expectation
        const sign = Math.cos(initialAngle) >= 0 ? 1 : -1;
        targetAngle = Math.max(0, Math.min(Math.PI, initialAngle - (dy / 100) * sign));
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      dragMode = null;
    };

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", onResize);

    // ── Animation loop ─────────────────────────────────────────────
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Track highlight lerp
      sliceTracks.forEach((track, i) => {
        const mat = track.mesh.material as THREE.LineBasicMaterial;
        const target = i === targetTrackIndex ? 0.85 : 0.12;
        mat.opacity += (target - mat.opacity) * 0.1;
      });

      // Source scale
      const targetS = isDragging ? 1.4 : 1.0;
      visualScale += (targetS - visualScale) * 0.15;
      sourceGroup.scale.setScalar(visualScale);
      if (!isDragging) {
        halo.scale.setScalar(1.0 + Math.sin(Date.now() * 0.005) * 0.1);
      }

      // Position lerp
      visualPhi += (sliceTracks[targetTrackIndex].phi - visualPhi) * 0.15;
      visualAngle += (targetAngle - visualAngle) * 0.15;

      const sx = R * Math.sin(visualPhi);
      const sr = R * Math.cos(visualPhi);
      sourceGroup.position.set(sx, sr * Math.sin(visualAngle), sr * Math.cos(visualAngle));

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden",
      background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(200,200,205,0.6) 0%, #f2f2f4 70%)",
    }}>
      <div
        ref={containerRef}
        style={{ width: "100%", aspectRatio: "4 / 3", touchAction: "none", display: "block" }}
      />
      {/* Overlay hint */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(6px)",
        padding: "8px 16px",
        borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.08)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(0,0,0,0.4)", lineHeight: 1.5 }}>
          ↔ swipe to switch track &nbsp;·&nbsp; ↕ swipe to move position
        </p>
      </div>
    </div>
  );
}
