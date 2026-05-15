import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-6">
      <div className="flex items-center gap-3">
        {/* Wordmark */}
        <span className="text-lg font-black tracking-tight text-white">
          Ink<span className="text-violet-400">Motion</span>
        </span>
        <Badge color="violet">MVP</Badge>
      </div>

      <nav className="flex items-center gap-4">
        <a
          href="#"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          Projects
        </a>
        <a
          href="#"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          Docs
        </a>
        {/* Placeholder avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          U
        </div>
      </nav>
    </header>
  );
}
