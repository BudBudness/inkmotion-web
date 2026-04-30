import type { StylePreset, AnimationMode } from "@/types";

export const STYLE_PRESETS: {
  id: StylePreset;
  label: string;
  description: string;
  colors: string[];
}[] = [
  {
    id: "gloss-black-drip",
    label: "Gloss Black Drip",
    description: "High-contrast black with glossy highlights and paint drips",
    colors: ["#0a0a0a", "#1a1a1a", "#ffffff", "#333333"],
  },
  {
    id: "marker-bubble",
    label: "Marker Bubble",
    description: "Fat rounded letters with marker-style fill and thick outline",
    colors: ["#ff6b35", "#f7c59f", "#efefd0", "#004e89"],
  },
  {
    id: "club-red-yellow",
    label: "Club Red Yellow",
    description: "Bold red and yellow with chrome-style depth",
    colors: ["#d62828", "#f7b731", "#ffffff", "#1a1a1a"],
  },
  {
    id: "clean-sticker",
    label: "Clean Sticker",
    description: "Flat color with white border — sticker-ready output",
    colors: ["#6c63ff", "#ffffff", "#f0f0f0", "#2d2d2d"],
  },
];

export const ANIMATION_MODES: {
  id: AnimationMode;
  label: string;
  description: string;
}[] = [
  { id: "none", label: "Static", description: "No animation" },
  { id: "draw-on", label: "Draw On", description: "Strokes animate in sequentially" },
  { id: "pulse", label: "Pulse", description: "Subtle breathing glow effect" },
  { id: "drip-fall", label: "Drip Fall", description: "Drips animate downward" },
];

export const DEFAULT_CONFIG = {
  dripLevel: 40,
  shadowDepth: 50,
  highlightStrength: 60,
  animationMode: "none" as AnimationMode,
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
