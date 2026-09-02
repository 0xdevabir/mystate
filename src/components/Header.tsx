import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
            <Github className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-white">MyState</span>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Built for developers
        </a>
      </div>
    </header>
  );
}
