import { GitHubIcon } from "./GitHubIcon";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full bg-bg/50 px-5 backdrop-blur-sm sm:h-[72px] sm:px-7">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark">
            <GitHubIcon className="h-4 w-4 text-bg" />
          </div>
          <span className="text-[15px] font-bold text-dark">
            my<span className="text-accent">state</span>
          </span>
        </a>

        <a
          href="https://www.devabir.me"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hidden items-center gap-1.5 overflow-hidden rounded-full bg-dark px-5 py-2 text-[13px] font-bold text-bg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 sm:flex"
        >
          <span className="absolute inset-0 -translate-x-full rounded-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative z-10 transition-colors duration-200 group-hover:text-dark">
            by devabir
          </span>
          <span className="relative z-10 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-dark">
            →
          </span>
        </a>
      </div>
    </header>
  );
}
