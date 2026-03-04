import svgPaths from "./svg-blbo3fno2n";

export default function Group() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 82.96 117.933">
        <g clipPath="url(#clip0_1_90)" id="Group 2">
          <g filter="url(#filter0_n_1_90)" id="Rectangle 21">
            <path d={svgPaths.p33f19df0} fill="var(--fill-0, white)" fillOpacity="0.5" />
          </g>
          <path d={svgPaths.pbca6800} id="Rectangle 22" stroke="var(--stroke-0, white)" />
          <path d={svgPaths.p25729440} id="Ellipse 5" stroke="var(--stroke-0, white)" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="107.295" id="filter0_n_1_90" width="69.9466" x="13.0133" y="8.82696">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feTurbulence baseFrequency="2 2" numOctaves="3" result="noise" seed="8499" stitchTiles="stitch" type="fractalNoise" />
            <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA type="discrete" />
            </feComponentTransfer>
            <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
            <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
            <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
            <feMerge result="effect1_noise_1_90">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
          <clipPath id="clip0_1_90">
            <rect fill="white" height="117.933" width="82.96" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}