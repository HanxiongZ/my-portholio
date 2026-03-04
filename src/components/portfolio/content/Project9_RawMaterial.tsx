import React, { useRef, useState } from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Project } from "../Projects";
import { getContentImage, getContentVideo } from "../projectImages";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface Props {
  project: Project;
  slugify: (text: string) => string;
}

export function Project9_RawMaterial({ project, slugify }: Props) {
  const img = {
    hero:  getContentImage(9, "hero"),
    fig01: getContentImage(9, "fig01"),
  };

  const videoSrc = getContentVideo(9);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  return (
    <>
      {/* ── VIDEO HERO ─────────────────────────────────────── */}
      {videoSrc ? (
        <div
          className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16 relative group cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Big centre play button — only when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 backdrop-blur-[2px] transition-opacity">
              <div className="w-16 h-16 rounded-full border border-foreground/30 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Play className="w-6 h-6 text-foreground ml-0.5" />
              </div>
            </div>
          )}

          {/* Bottom control bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-background/80 via-background/30 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div
              className="w-full h-1 bg-foreground/20 mb-3 cursor-pointer group/progress"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-foreground/70 transition-[width] duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-foreground/80" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-foreground/80 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-foreground/80" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-foreground/80" />
                  )}
                </button>
                <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                  Raw Material — Video
                </span>
              </div>
              <button
                onClick={handleFullscreen}
                className="p-1.5 hover:bg-foreground/10 transition-colors rounded-sm cursor-pointer"
              >
                <Maximize className="w-3.5 h-3.5 text-foreground/80" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full bg-foreground/5 border border-foreground/10 overflow-hidden mb-16">
          <ImageWithFallback
            src={img.hero}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {project.toc && project.toc.length > 0 ? (
        project.toc.map((section, index) => (
          <div
            key={section}
            className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24"
          >
            {/* Left 4 cols: Section title */}
            <div
              id={slugify(section)}
              className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0 scroll-mt-32"
            >
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
                0{index + 1} — {section}
              </span>
            </div>

            {/* Right 8 cols: Content */}
            <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
              <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
                {index === 0 ? project.content : project.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 mb-16 md:mb-24">
          <div className="col-span-1 md:col-span-4 border-t border-foreground/10 pt-6 mb-4 md:mb-0">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-foreground/40">
              01 — Overview
            </span>
          </div>
          <div className="col-span-1 md:col-span-8 border-t border-foreground/10 pt-6 md:border-t-0 md:pt-6">
            <p className="text-base leading-7 font-light text-foreground/80 text-pretty">
              {project.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}