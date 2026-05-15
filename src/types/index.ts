// Core domain types for InkMotion

export type StylePreset =
  | "gloss-black-drip"
  | "marker-bubble"
  | "club-red-yellow"
  | "clean-sticker";

export type AnimationMode = "none" | "draw-on" | "pulse" | "drip-fall";

export type ExportFormat = "svg" | "png" | "json";

export interface GenerationConfig {
  text: string;
  preset: StylePreset;
  dripLevel: number;       // 0–100
  shadowDepth: number;     // 0–100
  highlightStrength: number; // 0–100
  animationMode: AnimationMode;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface StrokePath {
  id: string;
  points: StrokePoint[];
  color: string;
  width: number;
  layer: "base" | "shadow" | "highlight" | "drip" | "outline";
}

export interface GenerationOutput {
  id: string;
  svg: string;
  strokes: StrokePath[];
  width: number;
  height: number;
  preset: StylePreset;
  config: GenerationConfig;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  text: string;
  preset: StylePreset;
  configJson: GenerationConfig;
  outputJson: GenerationOutput | null;
  createdAt: string;
}

export interface ExportRecord {
  id: string;
  projectId: string;
  type: ExportFormat;
  url: string;
  createdAt: string;
}

export interface ApiError {
  detail: string;
  status: number;
}

export interface GenerateRequest {
  text: string;
  preset: StylePreset;
  config: Omit<GenerationConfig, "text" | "preset">;
}

export interface GenerateResponse {
  success: boolean;
  data: GenerationOutput;
}

export interface ExportResponse {
  success: boolean;
  format: ExportFormat;
  data: string; // base64 for PNG, raw string for SVG/JSON
  filename: string;
}
