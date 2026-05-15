"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PromptInput } from "@/components/PromptInput";
import { StylePresetCard } from "@/components/StylePresetCard";
import { ParameterPanel } from "@/components/ParameterPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { ExportControls } from "@/components/ExportControls";
import { useGeneration } from "@/hooks/useGeneration";
import { useExport } from "@/hooks/useExport";
import { DEFAULT_CONFIG } from "@/lib/constants";
import type { AnimationMode, GenerationConfig, StylePreset } from "@/types";

export default function DashboardPage() {
  const [text, setText] = useState("");
  const [preset, setPreset] = useState<StylePreset>("gloss-black-drip");
  const [params, setParams] = useState({
    dripLevel: DEFAULT_CONFIG.dripLevel,
    shadowDepth: DEFAULT_CONFIG.shadowDepth,
    highlightStrength: DEFAULT_CONFIG.highlightStrength,
    animationMode: DEFAULT_CONFIG.animationMode as AnimationMode,
  });

  const { output, loading, error, generate } = useGeneration();
  const { exporting, exportError, doExport } = useExport();

  function handleGenerate() {
    const config: GenerationConfig = { text, preset, ...params };
    generate(config);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="flex flex-1 overflow-hidden">
        {/* Left sidebar — controls */}
        <aside className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-5">
          <PromptInput
            value={text}
            onChange={setText}
            onGenerate={handleGenerate}
            loading={loading}
          />
          <div className="h-px bg-zinc-800" />
          <StylePresetCard selected={preset} onChange={setPreset} />
          <div className="h-px bg-zinc-800" />
          <ParameterPanel params={params} onChange={setParams} />
          <div className="h-px bg-zinc-800" />
          <ExportControls
            output={output}
            onExport={(fmt) => output && doExport(output, fmt)}
            exporting={exporting}
          />
          {exportError && (
            <p className="text-xs text-red-400">{exportError}</p>
          )}
        </aside>

        {/* Main canvas area */}
        <section className="flex flex-1 flex-col gap-4 overflow-auto bg-zinc-950 p-6">
          <PreviewPanel output={output} loading={loading} error={error} />

          {output && (
            <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <MetaItem label="Text" value={output.config.text} />
              <div className="h-4 w-px bg-zinc-700" />
              <MetaItem label="Preset" value={output.preset} />
              <div className="h-4 w-px bg-zinc-700" />
              <MetaItem label="Strokes" value={String(output.strokes.length)} />
              <div className="h-4 w-px bg-zinc-700" />
              <MetaItem label="ID" value={output.id.slice(0, 8) + "…"} mono />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MetaItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </span>
      <span className={`text-xs text-zinc-300 ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
