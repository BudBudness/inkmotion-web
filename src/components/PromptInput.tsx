"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

const MAX_CHARS = 80;

export function PromptInput({
  value,
  onChange,
  onGenerate,
  loading,
}: PromptInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading && value.trim()) {
      onGenerate();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Text
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            maxLength={MAX_CHARS}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your text…"
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600">
            {value.length}/{MAX_CHARS}
          </span>
        </div>
        <Button
          onClick={onGenerate}
          loading={loading}
          disabled={!value.trim() || loading}
          size="lg"
          className="shrink-0"
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
