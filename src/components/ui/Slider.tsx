"use client";

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
          {label}
        </label>
        <span className="text-xs font-mono text-zinc-300">{value}</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
