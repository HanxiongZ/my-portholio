import svgPaths from "./svg-qzervamtxm";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute flex h-[200px] items-center justify-center left-[16px] top-[233px] w-[538px]">
        <div className="flex-none rotate-[180deg]">
          <div className="h-[200px] relative w-[538px]">
            <div className="absolute inset-[-0.5%_-0.19%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 540 202">
                <path d={svgPaths.p355b1c70} id="Line 1" stroke="var(--stroke-0, black)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[21px] left-[196px] top-[233px] w-[177.5px]">
        <div className="absolute inset-[0_-0.56%_-4.76%_-0.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 179.5 22">
            <path d={svgPaths.pc9acc80} id="Vector 27" stroke="var(--stroke-0, black)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_48.14%_51.7%_1.94%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 284.547 213.976">
          <g id="Group 8">
            <path d={svgPaths.p22b68b00} fill="var(--fill-0, black)" id="Vector" />
          </g>
        </svg>
      </div>
      <div className="absolute contents left-[229px] top-[253px]">
        <div className="absolute flex h-[38px] items-center justify-center left-[229px] top-[253px] w-[113px]" style={{ "--transform-inner-width": "4", "--transform-inner-height": "4" } as React.CSSProperties}>
          <div className="flex-none rotate-[270deg]">
            <div className="bg-[#a4a4a4] border-2 border-black border-solid h-[113px] rounded-[2px] w-[38px]" />
          </div>
        </div>
      </div>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[normal] left-[239px] text-[12px] text-black text-nowrap top-[233px]">Pressure sensor</p>
      <p className="absolute font-['Manrope:Medium',sans-serif] font-medium leading-[normal] left-[242px] text-[12px] text-black text-nowrap top-[263px]">Haptic actuator</p>
    </div>
  );
}