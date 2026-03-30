/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  PROJECT IMAGE REGISTRY                                      ║
 * ║                                                              ║
 * ║  All project images in one place, organized by project.      ║
 * ║  Thumbnails (homepage) and content images (detail pages)     ║
 * ║  are INDEPENDENT — changing one won't affect the other.      ║
 * ║                                                              ║
 * ║  HOW TO REPLACE:                                             ║
 * ║  1. Find the project section below                           ║
 * ║  2. Replace the URL string with your uploaded image URL      ║
 * ║  3. For Figma assets: import and assign like project 1 & 2  ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── Figma asset imports (projects 1 & 2) ───────────────────────
import image_Thesis_TN from "figma:asset/4ead9f2c0d38f2409fbfa5938ab918c3abfd6ecf.png";
import image_BeyondClicks_TN_sm from "figma:asset/50fe6443ca11a0c1a8a16fd06fffcd8f48e20844.png";
import image_Coact_TN from "figma:asset/9b5361a5bb51f315ff390d2a3a392efc986f156f.png";
import image_coact_Hero from "figma:asset/667dd29c6938bb7bf6fc70283db47ce7fe648940.png";

// ─── Local asset imports ─────────────────────────────────────────
import image_HoloAudio_TN from "../../assets/holoaudio_tn.jpg";
import image_Obfuscation_TN from "../../assets/obfuscation_tn.jpg";
import image_Inside_TN from "../../assets/inside_tn.png";
import image_Inside_Hero from "../../assets/inside_hero_2x.jpg";
import image_Ethno_1 from "../../assets/fig_ethnography_1.jpg";
import image_Ethno_2 from "../../assets/fig_ethnography_2.jpg";
import image_Ethno_3 from "../../assets/fig_ethnography_3.jpg";

// ─────────────────────────────────────────────────────────────────
// TYPE
// ─────────────────────────────────────────────────────────────────

export interface ProjectImages {
  /** Shown on homepage Selected Works / Playground cards */
  thumbnail: string;
  /** Animated GIF shown on Playground hover (desktop) */
  playgroundPreview?: string;
  /** Video shown on Playground hover (desktop) — takes priority over playgroundPreview */
  playgroundVideo?: string;
  /** Video embedded in the project detail page */
  contentVideo?: string;
  /** Used inside the project detail page — each key is a named slot */
  content: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────

const registry: Record<number, ProjectImages> = {
  // ══════════════════════════════════════════════════════════════
  // PROJECT 1 — From Novelty to Normality (Master Thesis)
  // ═══════════════════════════════════════════════════════════════
  1: {
    thumbnail: image_Thesis_TN,
    content: {
      hero: "REPLACE_P1_HERO",
      fig01: "REPLACE_P1_FIG01",
      fig02: "REPLACE_P1_FIG02",
      fig03: "REPLACE_P1_FIG03",
      fig04: "REPLACE_P1_FIG04",
      fig05: "REPLACE_P1_FIG05",
      fig06: "REPLACE_P1_FIG06",
      fig07: "REPLACE_P1_FIG07",
      fig08: "REPLACE_P1_FIG08",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 2 — Beyond the Clicks (Volvo Internship)
  // ═══════════════════════════════════════════════════════════════
  2: {
    thumbnail: image_BeyondClicks_TN_sm,
    content: {
      hero: "REPLACE_P2_HERO",
      fig01: "REPLACE_P2_FIG01",
      fig02: "REPLACE_P2_FIG02",
      fig03: "REPLACE_P2_FIG03",
      fig04: "REPLACE_P2_FIG04",
      fig05: "REPLACE_P2_FIG05",
      fig06: "REPLACE_P2_FIG06",
      fig07: "REPLACE_P2_FIG07",
      fig08: "REPLACE_P2_FIG08",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 3 — Digital Entropy
  // ═══════════════════════════════════════════════════════════════
  3: {
    thumbnail: image_Coact_TN,
    content: {
      hero: image_coact_Hero,
      fig01: "REPLACE_P3_FIG01",
      fig02: "REPLACE_P3_FIG02",
      fig03: "REPLACE_P3_FIG03",
      fig_navigate: "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/navigate.mp4",
      fig_inspection: "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/Inspection.mp4",
      video_ethnography: "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/Oil%20leak.mp4",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 4 — Chronos
  // ═══════════════════════════════════════════════════════════════
  4: {
    thumbnail: image_Inside_TN,
    content: {
      hero: image_Inside_Hero,
      fig_ethnography_1: image_Ethno_1,
      fig_ethnography_2: image_Ethno_2,
      fig_ethnography_3: image_Ethno_3,
      fig_synthesis_1: "REPLACE_P4_SYNTHESIS_1",
      fig_synthesis_2: "REPLACE_P4_SYNTHESIS_2",
      fig_synthesis_3: "REPLACE_P4_SYNTHESIS_3",
      fig_synthesis_4: "REPLACE_P4_SYNTHESIS_4",
      fig01: "REPLACE_P4_FIG01",
      fig02: "REPLACE_P4_FIG02",
      fig03: "REPLACE_P4_FIG03",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 5 — Silent Form
  // ═══════════════════════════════════════════════════════════════
  5: {
    thumbnail: image_HoloAudio_TN,
    content: {
      hero: "REPLACE_P5_HERO",
      fig01: "REPLACE_P5_FIG01",
      fig02: "REPLACE_P5_FIG02",
      fig03: "REPLACE_P5_FIG03",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 6 — Glyph Studies
  // ═══════════════════════════════════════════════════════════════
  6: {
    thumbnail: image_Obfuscation_TN,
    content: {
      hero: "REPLACE_P6_HERO",
      fig01: "REPLACE_P6_FIG01",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 7 — Flora Generative
  // ═══════════════════════════════════════════════════════════════
  7: {
    thumbnail: "REPLACE_P7_THUMBNAIL",
    playgroundPreview: "REPLACE_P7_PREVIEW_GIF",
    content: {
      hero: "REPLACE_P7_HERO",
      fig01: "REPLACE_P7_FIG01",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 8 — Echo Chamber
  // ═══════════════════════════════════════════════════════════════
  8: {
    thumbnail: "REPLACE_P8_THUMBNAIL",
    playgroundPreview: "REPLACE_P8_PREVIEW_GIF",
    content: {
      hero: "REPLACE_P8_HERO",
      fig01: "REPLACE_P8_FIG01",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT 9 — Raw Material
  // ═══════════════════════════════════════════════════════════════
  9: {
    thumbnail: "REPLACE_P9_THUMBNAIL",
    // Video preview for hover — replace with your own .mp4 URL
    playgroundVideo:
      "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/Poster_video.mp4",
    // Video embedded in detail page — replace with your own .mp4 URL
    contentVideo:
      "https://hs67ubfgy9ypqo06.public.blob.vercel-storage.com/Poster_video.mp4",
    content: {
      hero: "REPLACE_P9_HERO",
      fig01: "REPLACE_P9_FIG01",
    },
  },
};

// ─────────────────────────────────────────────────────────────────
// ACCESSORS  (use these in components)
// ─────────────────────────────────────────────────────────────────

/** Get the homepage thumbnail for a project */
export function getThumbnail(projectId: number): string {
  return registry[projectId]?.thumbnail ?? "";
}

/** Get a named content image for a project detail page */
export function getContentImage(
  projectId: number,
  key: string,
): string {
  return registry[projectId]?.content[key] ?? "";
}

/** Get all content images for a project (for galleries etc.) */
export function getAllContentImages(
  projectId: number,
): Record<string, string> {
  return registry[projectId]?.content ?? {};
}

/** Get the Playground hover GIF for a project (falls back to thumbnail) */
export function getPlaygroundPreview(
  projectId: number,
): string {
  return (
    registry[projectId]?.playgroundPreview ||
    registry[projectId]?.thumbnail ||
    ""
  );
}

/** Get the Playground hover video for a project (returns empty string if none) */
export function getPlaygroundVideo(projectId: number): string {
  return registry[projectId]?.playgroundVideo || "";
}

/** Get the detail-page video for a project (returns empty string if none) */
export function getContentVideo(projectId: number): string {
  return registry[projectId]?.contentVideo || "";
}

export default registry;