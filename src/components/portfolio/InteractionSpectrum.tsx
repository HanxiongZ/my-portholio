import { AnalogButton } from "./AnalogButton";
import { DigitalButton } from "./DigitalButton";
import { AugmentedButton } from "./AugmentedButton";

export function InteractionSpectrum() {
  return (
    <div className="w-full">
      {/* Black Panel */}
      <div
        className="
          w-full
          bg-transparent
          text-white
          overflow-hidden
          rounded-none
        "
      >
        {/* Content Width */}
        <div
          className="
            mx-auto
            w-full
            max-w-[900px]
            
            pt-4
            sm:pt-6
            pb-8
            sm:pb-10
          "
        >
          {/* Buttons Row */}
          <div
            className="
              w-full
              flex
              items-center
              justify-between
              gap-3
              sm:gap-10
              h-[150px]
              sm:h-[220px]
            "
          >
            {/* Digital */}
            <div className="w-1/3 min-w-0 flex justify-center items-center">
              <div className="scale-[0.9] sm:scale-100 origin-center">
                <DigitalButton />
              </div>
            </div>

            {/* Augmented */}
            <div className="w-1/3 min-w-0 flex justify-center items-center relative">
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-40 pointer-events-none" />
              <div className="scale-[1.0] sm:scale-110 origin-center">
                <AugmentedButton />
              </div>
            </div>

            {/* Analog */}
            <div className="w-1/3 min-w-0 flex justify-center items-center">
              <div className="scale-[0.8] sm:scale-90 origin-center translate-y-1 sm:translate-y-2">
                <AnalogButton />
              </div>
            </div>
          </div>

          {/* Axis */}
          <div className="relative w-full h-[18px] sm:h-[20px] flex items-center">
            {/* Main Line — 缩进 6px，刚好避开箭头宽度 */}
            <div className="absolute left-[6px] right-[6px] top-1/2 -translate-y-1/2 h-px bg-neutral-500" />

            {/* Left Arrow — 不要再 translate-x */}
            <div className="absolute left-0 top-1/2 translate-x-1 -translate-y-1/2 z-20 text-neutral-500">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                className="block"
              >
                <path
                  d="M5 1L1 5L5 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                />
              </svg>
            </div>

            {/* Right Arrow — 不要再 translate-x */}
            <div className="absolute right-0 top-1/2 -translate-x-1 -translate-y-1/2 z-20 text-neutral-500">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                className="block"
              >
                <path
                  d="M1 1L5 5L1 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                />
              </svg>
            </div>

            {/* Dots positions */}
            <div className="w-1/3 min-w-0 flex justify-center relative z-10 -translate-x-3">
              <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] bg-[#111111] border border-white/90 rounded-full" />
            </div>
            <div className="w-1/3 min-w-0 flex justify-center relative z-10">
              <div className="w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] bg-black border border-white/90 rounded-full shadow-[0_0_10px_white]" />
            </div>
            <div className="w-1/3 min-w-0 flex justify-center relative z-10 translate-x-3">
              <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] bg-[#111111] border border-white/90 rounded-full" />
            </div>
          </div>

          {/* Labels */}
          <div className="w-full flex justify-between items-start mt-6 sm:mt-8 gap-3 sm:gap-10">
            <div className="w-1/3 min-w-0 flex flex-col items-center text-center">
              <span
                className="text-[12px] sm:text-sm font-semibold tracking-widest uppercase
                     text-foreground"
              >
                Digital
              </span>
              <span
                className="text-[11px] sm:text-xs font-light
                     text-foreground/60"
              >
                Visual only
              </span>
            </div>

            <div className="w-1/3 min-w-0 flex flex-col items-center text-center">
              <span
                className="text-[12px] sm:text-sm font-semibold tracking-widest uppercase
                     text-foreground"
              >
                Augmented
              </span>
              <span
                className="text-[11px] sm:text-xs font-light
                     text-foreground/60"
              >
                Haptic + Visual
              </span>
            </div>

            <div className="w-1/3 min-w-0 flex flex-col items-center text-center">
              <span
                className="text-[12px] sm:text-sm font-semibold tracking-widest uppercase
                     text-foreground"
              >
                Analog
              </span>
              <span
                className="text-[11px] sm:text-xs font-light
                     text-foreground/60"
              >
                Mechanical
              </span>
            </div>
          </div>

          {/* (可选) 如果你觉得黑块底部还是太多：把这里的 mt 改小/删掉 */}
          <div className="h-2 sm:h-4" />
        </div>
      </div>
    </div>
  );
}