interface BadgeProps {
  children: React.ReactNode;
  color?: "violet" | "green" | "yellow" | "red" | "zinc";
}

const colorClasses = {
  violet: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  red: "bg-red-500/10 text-red-400 ring-red-500/20",
  zinc: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
};

export function Badge({ children, color = "zinc" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}
