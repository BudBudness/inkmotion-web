"use client";

import type { StylePreset } from "@/types";
import { STYLE_PRESETS } from "@/lib/constants";

interface StylePresetCardProps {
  selected: StylePreset;
  onChange: (preset: StylePreset) => void;
}

export function StylePresetCard({ selected, onChange }: StylePresetCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Style Preset
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = selected === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onChange(preset.id)}
              className={[
                "flex flex-col gap-2 rounded-xl border p-3 text-left transition-all",
                isSelected
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600",
              ].join(" ")}
            >
              {/* Color swatches */}
              <div className="flex gap-1">
                {preset.colors.map((color, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full ring-1 ring-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span
                className={`text-xs font-semibold leading-tight ${
                  isSelected ? "text-violet-300" : "text-zinc-200"
                }`}
              >
                {preset.label}
              </span>
              <span className="text-[10px] leading-tight text-zinc-500">
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
