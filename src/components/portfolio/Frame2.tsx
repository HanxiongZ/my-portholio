import svgPaths from "./svg-pieu9xx8xe";

export default function Frame() {
  return (
    <div className="bg-black relative size-full">
      <div className="absolute h-0 left-[138px] top-[292px] w-[1071px]">
        <div className="absolute inset-[-5.52px_-0.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1072.5 11.0459">
            <path d={svgPaths.pa12d580} fill="var(--stroke-0, #E2E2E2)" id="Vector 12" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Volvo_Novum:Regular',sans-serif] leading-[normal] left-[1179px] not-italic text-[20px] text-nowrap text-white top-[324px] tracking-[-0.6px]">Analog</p>
      <p className="absolute font-['Volvo_Novum:Regular',sans-serif] leading-[normal] left-[110px] not-italic text-[20px] text-nowrap text-white top-[324px] tracking-[-0.6px]">Digital</p>
      <div className="absolute h-[107px] left-[1112px] top-[153px] w-[179.686px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 179.686 107">
          <g id="Group 7">
            <path d={svgPaths.pb42b300} fill="var(--fill-0, #626262)" id="Vector 23" />
            <path d={svgPaths.p15d08580} fill="var(--fill-0, white)" id="Ellipse 7" stroke="var(--stroke-0, white)" strokeWidth="0.737931" />
            <path d={svgPaths.p3e527c00} fill="var(--fill-0, #626262)" id="Ellipse 8" stroke="var(--stroke-0, white)" strokeWidth="0.737931" />
            <path d={svgPaths.p2199cf80} fill="var(--fill-0, #626262)" id="Ellipse 6" stroke="var(--stroke-0, white)" strokeWidth="0.737931" />
          </g>
        </svg>
      </div>
      <div className="absolute contents left-[73px] top-[193px]">
        <div className="absolute bg-[#8a8a8a] h-[37px] left-[73px] rounded-[20px] top-[193px] w-[130px]" />
        <p className="absolute font-['Volvo_Novum:Regular',sans-serif] leading-[1.5] left-[calc(50%-601.5px)] not-italic text-[16px] text-nowrap text-white top-[calc(50%-30.5px)] tracking-[-0.176px]">Button</p>
      </div>
    </div>
  );
}