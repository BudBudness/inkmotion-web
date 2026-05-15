"use client";

import { Button } from "@/components/ui/Button";
import type { ExportFormat, GenerationOutput } from "@/types";

interface ExportControlsProps {
  output: GenerationOutput | null;
  onExport: (format: ExportFormat) => void;
  exporting: ExportFormat | null;
}

const FORMATS: { id: ExportFormat; label: string; description: string }[] = [
  { id: "svg", label: "SVG", description: "Vector — scalable" },
  { id: "png", label: "PNG", description: "Raster — print ready" },
  { id: "json", label: "JSON", description: "Stroke data — animation ready" },
];

export function ExportControls({
  output,
  onExport,
  exporting,
}: ExportControlsProps) {
  const disabled = !output;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Export
      </h3>
      <div className="flex gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            disabled={disabled || exporting !== null}
            onClick={() => onExport(fmt.id)}
            className={[
              "flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 transition-all",
              disabled
                ? "cursor-not-allowed border-zinc-800 opacity-40"
                : exporting === fmt.id
                ? "border-violet-500 bg-violet-500/10"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-600",
            ].join(" ")}
          >
            {exporting === fmt.id ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-400" />
            ) : (
              <ExportIcon format={fmt.id} />
            )}
            <span className="text-xs font-semibold text-zinc-200">
              {fmt.label}
            </span>
            <span className="text-[10px] text-zinc-500">{fmt.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExportIcon({ format }: { format: ExportFormat }) {
  if (format === "svg") {
    return (
      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (format === "png") {
    return (
      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}
