"use client";

import { Slider } from "@/components/ui/Slider";
import { ANIMATION_MODES } from "@/lib/constants";
import type { AnimationMode, GenerationConfig, StylePreset } from "@/types";

type Params = Omit<GenerationConfig, "text" | "preset">;

interface ParameterPanelProps {
  params: Params;
  onChange: (params: Params) => void;
}

export function ParameterPanel({ params, onChange }: ParameterPanelProps) {
  function set<K extends keyof Params>(key: K, value: Params[K]) {
    onChange({ ...params, [key]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Parameters
      </h3>

      <Slider
        label="Drip Level"
        value={params.dripLevel}
        onChange={(v) => set("dripLevel", v)}
      />
      <Slider
        label="Shadow Depth"
        value={params.shadowDepth}
        onChange={(v) => set("shadowDepth", v)}
      />
      <Slider
        label="Highlight Strength"
        value={params.highlightStrength}
        onChange={(v) => set("highlightStrength", v)}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
          Animation Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ANIMATION_MODES.map((mode) => {
            const isSelected = params.animationMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => set("animationMode", mode.id as AnimationMode)}
                className={[
                  "rounded-lg border px-3 py-2 text-left transition-all",
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                ].join(" ")}
              >
                <div className="text-xs font-semibold">{mode.label}</div>
                <div className="mt-0.5 text-[10px] text-zinc-500">
                  {mode.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
