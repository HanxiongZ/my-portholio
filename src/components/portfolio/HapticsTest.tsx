import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useOutletContext } from "react-router";
import type { OutletContextType } from "./Layout";

/**
 * TEMPORARY sandbox page for vibe-coding animations that convey haptics.
 *
 * Route: /haptics-test
 * Safe to delete: remove this file + its route in routes.ts.
 *
 * Demo 01 — WEIGHT. A row of identical weights (5 g … 1000 g) — same size, so
 * ONLY the motion tells them apart. Grab one and drag it up: two soft fingers
 * appear where you press; the heavier the weight, the more it lags and the
 * harder the fingers squeeze inward to hold it.
 */

/* ------------------------------------------------------------------ */
/* Tunables — the "feel" lives here                                    */
/* ------------------------------------------------------------------ */
const WEIGHTS = [5, 50, 200, 500, 1000]; // grams
const CYL_H = 120; // uniform cylinder height
const CYL_W = CYL_H * 0.59; // uniform cylinder width (graphic ratio)
const FINGER_H = 62; // uniform fingerpad height
const FINGER_W = FINGER_H * (24.205 / 54.8721); // fingerpad width (graphic ratio)
const OVERLAP = FINGER_W * 0.42; // how far a pad hugs the cylinder edge
const TRAVEL = 150; // px a weight can be lifted
// Deformation is driven by the MOTION itself — the live lag between the finger
// and the trailing object. It grows while lifting and relaxes when settled.
const LAG_REF = 72; // px of lag that maps to a full stretch (higher = less sensitive)
const MAX_STRETCH = 0.28; // vertical taffy stretch at full lag
const STRETCH_CAP = 0.85; // clamp the acceleration spike (× MAX_STRETCH)
const GRIP_SQUEEZE = 0.14; // steady horizontal grip squeeze from weight

const logMin = Math.log(WEIGHTS[0]);
const logMax = Math.log(WEIGHTS[WEIGHTS.length - 1]);
/** Normalise grams → 0..1 on a log scale (5 g → 0, 1000 g → 1). */
const normOf = (g: number) => (Math.log(g) - logMin) / (logMax - logMin);
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/** The object: a cylinder. Inlined vector from Figma node 3261:608. */
function Cylinder() {
  return (
    <svg
      className="block w-full h-full"
      width="165"
      height="279"
      viewBox="0 0 165 279"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      data-node-id="3261:608"
    >
      <g>
        <mask id="cyl-body-inside" fill="white">
          <path d="M82.5 0C128.063 0 165 4.92487 165 11V256H164.979C164.045 268.748 127.477 279 82.5 279C37.5233 279 0.954925 268.748 0.0205078 256H0V11C0 4.92487 36.9365 0 82.5 0Z" />
        </mask>
        <path
          d="M82.5 0C128.063 0 165 4.92487 165 11V256H164.979C164.045 268.748 127.477 279 82.5 279C37.5233 279 0.954925 268.748 0.0205078 256H0V11C0 4.92487 36.9365 0 82.5 0Z"
          fill="#D9D9D9"
          fillOpacity="0.2"
        />
        <path
          d="M165 256V257H166V256H165ZM164.979 256V255H164.05L163.982 255.927L164.979 256ZM0.0205078 256L1.01783 255.927L0.94989 255H0.0205078V256ZM0 256H-1V257H0V256ZM82.5 0V1C105.252 1 125.831 2.22991 140.704 4.21305C148.148 5.2056 154.123 6.3817 158.216 7.67204C160.27 8.31944 161.791 8.97768 162.778 9.62095C163.817 10.2978 164 10.7785 164 11H165H166C166 9.70272 165.029 8.70056 163.87 7.94528C162.659 7.1564 160.938 6.43319 158.817 5.76457C154.561 4.42287 148.454 3.22866 140.968 2.2306C125.983 0.232523 105.312 -1 82.5 -1V0ZM165 11H164V256H165H166V11H165ZM165 256V255H164.979V256V257H165V256ZM164.979 256L163.982 255.927C163.784 258.634 161.663 261.43 157.48 264.132C153.336 266.809 147.378 269.253 139.987 271.317C125.215 275.443 104.923 278 82.5 278V279V280C105.054 280 125.534 277.431 140.525 273.244C148.014 271.152 154.185 268.642 158.565 265.812C162.908 263.006 165.708 259.74 165.977 256.073L164.979 256ZM82.5 279V278C60.0768 278 39.7851 275.443 25.0134 271.317C17.6217 269.253 11.6643 266.809 7.51994 264.132C3.33736 261.43 1.21623 258.634 1.01783 255.927L0.0205078 256L-0.976816 256.073C-0.708007 259.74 2.09232 263.006 6.43462 265.812C10.8152 268.642 16.9861 271.152 24.4754 273.244C39.4657 277.431 59.9464 280 82.5 280V279ZM0.0205078 256V255H0V256V257H0.0205078V256ZM0 256H1V11H0H-1V256H0ZM0 11H1C1 10.7785 1.18322 10.2978 2.22203 9.62095C3.20927 8.97768 4.73019 8.31944 6.78391 7.67204C10.8772 6.3817 16.8518 5.2056 24.2959 4.21305C39.1694 2.22991 59.7482 1 82.5 1V0V-1C59.6883 -1 39.0171 0.232523 24.0315 2.2306C16.546 3.22866 10.4388 4.42287 6.18261 5.76457C4.0616 6.43319 2.34089 7.1564 1.13019 7.94528C-0.028955 8.70056 -1 9.70272 -1 11H0Z"
          fill="#CECECE"
          mask="url(#cyl-body-inside)"
        />
      </g>
      <path
        d="M82.5 0.5C105.267 0.5 125.869 1.7309 140.771 3.71777C148.225 4.71168 154.232 5.89217 158.366 7.19531C160.437 7.84801 162.008 8.52249 163.051 9.20215C164.12 9.89862 164.5 10.5096 164.5 11C164.5 11.4904 164.12 12.1014 163.051 12.7979C162.008 13.4775 160.437 14.152 158.366 14.8047C154.232 16.1078 148.225 17.2883 140.771 18.2822C125.869 20.2691 105.267 21.5 82.5 21.5C59.7332 21.5 39.1311 20.2691 24.2295 18.2822C16.7753 17.2883 10.7677 16.1078 6.63379 14.8047C4.56328 14.152 2.99233 13.4775 1.94922 12.7979C0.880328 12.1014 0.5 11.4904 0.5 11C0.5 10.5096 0.880328 9.89862 1.94922 9.20215C2.99233 8.52249 4.56328 7.84801 6.63379 7.19531C10.7677 5.89217 16.7753 4.71168 24.2295 3.71777C39.1311 1.7309 59.7332 0.5 82.5 0.5Z"
        stroke="#D8D8D8"
      />
    </svg>
  );
}

/** A soft fingerpad. Inlined vector from Figma node 3261:621 (Ellipse 3). */
function FingerShape() {
  return (
    <svg
      className="block w-full h-full"
      width="24.205"
      height="54.8721"
      viewBox="0 0 24.205 54.8721"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      data-node-id="3261:621"
    >
      <path
        d="M24.1495 27.0677C24.1495 42.4653 25.2544 54.8721 17.602 54.8721C9.94967 54.8721 0 42.38 0 26.9824C0 11.5848 8.97248 0 16.6249 0C24.2772 0 24.1495 11.6701 24.1495 27.0677Z"
        fill="#D9D9D9"
      />
    </svg>
  );
}

/**
 * One fingerpad within the cylinder box. `side` = -1 left / +1 right.
 * Deformation is centred on the contact point (the inner edge) and combines
 * the two forces the pad actually feels: normal pressure (compress in / bulge)
 * and downward static friction (shear + sag the flesh downward).
 */
function Fingerpad({
  side,
  gripTop,
  scaleX,
  scaleY,
}: {
  side: -1 | 1;
  gripTop: number;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        top: gripTop,
        [side === -1 ? "left" : "right"]: -OVERLAP,
        width: FINGER_W,
        height: FINGER_H,
        scaleX,
        scaleY,
        // Anchored at the contact point (inner edge, near the top) so the flesh
        // stretches DOWNWARD under the load and stays glued to the surface.
        transformOrigin: side === -1 ? "100% 22%" : "0% 22%",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: side === -1 ? "scaleX(-1)" : undefined,
        }}
      >
        <FingerShape />
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* TEMPERATURE — Property 02                                          */
/* Perceived temperature = rate of heat exchange. Press & hold a       */
/* material: the faster its colour shifts, the colder it feels.        */
/* ================================================================== */
const T_REST = "#F7F7F7";
const T_STROKE = "#CECECE";
const T_WARM = "#E2894C";
const T_COLD = "#5E93C4";
const T_SIZE = 72; // circle diameter — matches the weight row scale

function tmix(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

type TMaterial = { name: string; cold: number };
const T_MATERIALS: TMaterial[] = [
  { name: "Aluminium", cold: 0.95 },
  { name: "Glass", cold: 0.7 },
  { name: "Ceramic", cold: 0.5 },
  { name: "Wood", cold: 0.26 },
  { name: "Wool", cold: 0.05 },
];
const tRate = (m: TMaterial) => 0.35 + (1 - m.cold) * 2.6; // fast for cold materials

type TCircleHandle = { play: () => void; reset: () => void };

/** A material circle: colour blooms from the centre at the material's rate. */
const MaterialCircle = forwardRef<TCircleHandle, { material: TMaterial }>(
  ({ material }, ref) => {
    const op = useMotionValue(0);
    const sc = useMotionValue(0.55);
    const fill = tmix(T_WARM, T_COLD, material.cold);
    const dur = tRate(material);

    const touch = () => {
      op.stop();
      sc.stop();
      animate(op, 1, { duration: dur, ease: [0.16, 1, 0.3, 1] });
      animate(sc, 1, { duration: dur, ease: [0.16, 1, 0.3, 1] });
    };
    const release = () => {
      animate(op, 0, { duration: 0.5, ease: [0.4, 0, 0.2, 1] });
      animate(sc, 0.55, { duration: 0.5, ease: [0.4, 0, 0.2, 1] });
    };
    useImperativeHandle(ref, () => ({ play: touch, reset: release }));

    return (
      <div className="flex flex-col items-center gap-3">
        <div
          onPointerDown={(e) => {
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
            touch();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          className="rounded-full overflow-hidden cursor-pointer touch-none relative"
          style={{ width: T_SIZE, height: T_SIZE, background: T_REST, border: `1px solid ${T_STROKE}` }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: fill, opacity: op, scale: sc }}
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
          {material.name}
        </span>
      </div>
    );
  },
);
MaterialCircle.displayName = "MaterialCircle";

function TemperatureSection() {
  const refs = useRef<(TCircleHandle | null)[]>([]);
  const previewing = useRef(false);

  const preview = async () => {
    if (previewing.current) return;
    previewing.current = true;
    for (let i = 0; i < T_MATERIALS.length; i++) {
      refs.current[i]?.play();
      await new Promise((r) => setTimeout(r, tRate(T_MATERIALS[i]) * 1000 + 500));
      refs.current[i]?.reset();
      await new Promise((r) => setTimeout(r, 450));
    }
    previewing.current = false;
  };

  return (
    <div className="mt-32">
      {/* HEADING */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16">
        <div className="col-span-12 md:col-span-5 pl-2 md:pl-3">
          <span className="inline-block text-xs font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none">
            Property 02
          </span>
          <div className="h-px bg-foreground/10 w-full mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-[-0.02em] leading-[0.95] mb-6">
            Temperature
          </h1>
          <button
            onClick={preview}
            className="px-5 py-2 rounded-full bg-foreground text-background text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Preview
          </button>
        </div>
        <div className="col-span-12 md:col-start-7 md:col-span-6 pl-2 md:pl-3 flex md:items-end">
          <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
            Temperature is felt as heat exchange. Press &amp; hold a material —
            the faster its colour shifts, the colder it feels: metal races to
            cold, wool barely warms.
          </p>
        </div>
      </div>

      {/* STAGE */}
      <div className="flex items-center justify-center gap-6 md:gap-10 min-h-[120px]">
        {T_MATERIALS.map((m, i) => (
          <MaterialCircle
            key={m.name}
            material={m}
            ref={(el) => {
              refs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-center gap-4 mt-14 text-[10px] font-mono uppercase tracking-widest text-foreground/40">
        <span style={{ color: T_WARM }}>Warm · slow</span>
        <div
          className="w-24 h-px"
          style={{ background: `linear-gradient(to right, ${T_WARM}, ${T_COLD})` }}
        />
        <span style={{ color: T_COLD }}>Cold · fast</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export function HapticsTest() {
  const { isDark } = useOutletContext<OutletContextType>();
  void isDark;

  const [active, setActive] = useState<number | null>(null);
  const [gripY, setGripY] = useState(0); // click height within the active cylinder

  const activeW = active === null ? 0 : normOf(WEIGHTS[active]);

  // Lift physics — pointer commands `lift`, the object trails via a damped spring.
  // Lower stiffness / more mass for heavy → it lags further, so the deformation
  // (driven by that lag) is bigger and slower to settle.
  const lift = useMotionValue(0);
  const objLift = useSpring(lift, {
    stiffness: 210 - activeW * 120,
    damping: 24 + activeW * 14,
    mass: 0.6 + activeW * 2.6,
  });
  const cylinderY = useTransform(objLift, (v) => -v);

  // Live lag between the finger and the trailing object — this IS the motion.
  // Positive while lifting (object trails); ~0 when settled; negative on rebound.
  const lag = useTransform([lift, objLift], ([l, o]: number[]) => l - o);

  // Vertical squash & stretch, driven by the lag → deforms during the lift,
  // relaxes when it settles. Heavier lags more, so it stretches more.
  const padScaleY = useTransform(lag, (g) => {
    const t = clamp(g / LAG_REF, -0.6, STRETCH_CAP);
    return 1 + t * MAX_STRETCH;
  });
  // Horizontal: volume preservation + a steady grip squeeze from the weight.
  const padScaleX = useTransform(padScaleY, (sy) => {
    const vol = sy >= 1 ? 1 - (sy - 1) * 0.5 : 1 + (1 - sy) * 0.4;
    return vol * (1 - activeW * GRIP_SQUEEZE);
  });

  /* ---- drag interaction ---- */
  const dragging = useRef(false);
  const startY = useRef(0);

  const onDown = (e: React.PointerEvent, i: number) => {
    if (active !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setGripY(e.clientY - rect.top);
    setActive(i);
    dragging.current = true;
    startY.current = e.clientY;
    lift.set(0);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const d = startY.current - e.clientY; // up = positive
    lift.set(clamp(d, 0, TRAVEL));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // Decelerate into a soft landing (easeOut), then let the fingers fade out.
    animate(lift, 0, {
      duration: 0.45 + activeW * 0.4,
      ease: [0.33, 1, 0.68, 1],
    }).then(() => setActive(null));
  };

  const gripTop = clamp(gripY - FINGER_H / 2, 3, CYL_H - FINGER_H - 3);

  /* ---- scripted preview: lift each weight in turn, light → heavy ---- */
  const previewing = useRef(false);
  const preview = async () => {
    if (previewing.current || dragging.current) return;
    previewing.current = true;
    for (let i = 0; i < WEIGHTS.length; i++) {
      const wl = normOf(WEIGHTS[i]);
      setActive(i);
      setGripY(CYL_H * 0.42);
      lift.set(0);
      await new Promise((r) => setTimeout(r, 90)); // let the spring config update
      await animate(lift, TRAVEL, {
        duration: 0.6 + wl * 0.7,
        ease: [0.22, 0.7, 0.3, 1],
      });
      await new Promise((r) => setTimeout(r, 550)); // hold
      await animate(lift, 0, {
        duration: 0.5 + wl * 0.4,
        ease: [0.33, 1, 0.68, 1],
      });
      await new Promise((r) => setTimeout(r, 300)); // beat between weights
    }
    setActive(null);
    previewing.current = false;
  };

  return (
    <section className="min-h-screen relative w-full pt-[140px] pb-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* --- META BAR --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 border-b border-foreground/10 pb-6 mb-16 items-start">
          <div className="col-span-1 md:col-span-4 pl-2 md:pl-3">
            <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 tracking-widest leading-none">
              Series
            </span>
            <span className="text-xs font-bold uppercase tracking-wider leading-none">
              Haptic Studies
            </span>
          </div>
          <div className="hidden md:block md:col-start-5 md:col-span-4 pl-2 md:pl-3">
            <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 tracking-widest leading-none">
              Property
            </span>
            <span className="text-xs font-bold uppercase tracking-wider leading-none">
              Weight
            </span>
          </div>
          <div className="col-span-1 md:col-start-9 md:col-span-4 pl-2 md:pl-3 flex flex-col items-end md:items-start">
            <span className="block text-[10px] font-mono uppercase text-foreground/40 mb-2 tracking-widest leading-none">
              Index
            </span>
            <span className="text-xs font-bold uppercase tracking-wider leading-none">
              01 / 05
            </span>
          </div>
        </div>

        {/* --- HEADING --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16">
          <div className="col-span-12 md:col-span-5 pl-2 md:pl-3">
            <span className="inline-block text-xs font-mono uppercase text-foreground/40 mb-3 tracking-widest leading-none">
              Property 01
            </span>
            <div className="h-px bg-foreground/10 w-full mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-[-0.02em] leading-[0.95] mb-6">
              Weight
            </h1>
            <button
              onClick={preview}
              className="px-5 py-2 rounded-full bg-foreground text-background text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Preview
            </button>
          </div>
          <div className="col-span-12 md:col-start-7 md:col-span-6 pl-2 md:pl-3 flex md:items-end">
            <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
              Every weight is the same size — only the motion differs. Grab one
              and drag it up, or hit Preview to watch each lift in turn — the
              heavier it is, the more it lags and stretches under the load.
            </p>
          </div>
        </div>

        {/* --- STAGE: the row of identical weights --- */}
        <div className="relative">
          <div
            className="flex items-end justify-center gap-6 md:gap-10"
            style={{ height: CYL_H + TRAVEL }}
          >
            {WEIGHTS.map((g, i) => {
              const isActive = active === i;
              return (
                <motion.div
                  key={g}
                  className={`relative shrink-0 transition-opacity duration-300 ${
                    active === null ? "cursor-grab active:cursor-grabbing" : ""
                  } ${active !== null && !isActive ? "opacity-40" : "opacity-100"}`}
                  style={{
                    width: CYL_W,
                    height: CYL_H,
                    y: isActive ? cylinderY : 0,
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => onDown(e, i)}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  whileHover={active === null ? { scale: 1.04 } : undefined}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <Cylinder />
                  </div>

                  <AnimatePresence>
                    {isActive && [
                      <Fingerpad
                        key="left"
                        side={-1}
                        gripTop={gripTop}
                        scaleX={padScaleX}
                        scaleY={padScaleY}
                      />,
                      <Fingerpad
                        key="right"
                        side={1}
                        gripTop={gripTop}
                        scaleX={padScaleX}
                        scaleY={padScaleY}
                      />,
                    ]}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ground line */}
          <div className="h-px bg-foreground/15 w-full" />

          {/* labels */}
          <div className="flex justify-center gap-6 md:gap-10 mt-3">
            {WEIGHTS.map((g, i) => (
              <div
                key={g}
                className="shrink-0 text-center"
                style={{ width: CYL_W }}
              >
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${
                    active === i ? "text-foreground/80" : "text-foreground/35"
                  }`}
                >
                  {g >= 1000 ? "1 kg" : `${g} g`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
