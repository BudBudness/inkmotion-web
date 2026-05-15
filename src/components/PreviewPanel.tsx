"use client";

import type { GenerationOutput } from "@/types";

interface PreviewPanelProps {
  output: GenerationOutput | null;
  loading: boolean;
  error: string | null;
}

export function PreviewPanel({ output, loading, error }: PreviewPanelProps) {
  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-2xl border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          Preview
        </span>
        {output && (
          <span className="text-[10px] text-zinc-600 font-mono">
            {output.width} × {output.height}px
          </span>
        )}
      </div>

      {/* Canvas area */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        {/* Checkerboard background */}
        <div
          className="absolute inset-0 rounded-b-2xl opacity-30"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#333 0% 25%, transparent 0% 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        {loading && (
          <div className="relative flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
            <span className="text-xs text-zinc-500">Generating…</span>
          </div>
        )}

        {error && !loading && (
          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className="text-2xl">⚠</span>
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {!loading && !error && !output && (
          <div className="relative flex flex-col items-center gap-2 text-center">
            <svg
              className="h-10 w-10 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
              />
            </svg>
            <p className="text-sm text-zinc-600">
              Enter text and hit Generate
            </p>
          </div>
        )}

        {!loading && !error && output && (
          <div
            className="relative max-h-full max-w-full"
            dangerouslySetInnerHTML={{ __html: output.svg }}
          />
        )}
      </div>
    </div>
  );
}
