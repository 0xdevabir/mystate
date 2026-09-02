export function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-bg px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="text-[15px] font-bold text-dark">
            my<span className="text-accent">state</span>
          </p>
          <p className="mt-1 text-[13px] text-dark/45">
            GitHub stats, beautifully told.
          </p>
        </div>

        <div className="flex items-center gap-6 text-[13px]">
          <a
            href="https://www.devabir.me"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-dark/50 transition-colors hover:text-dark"
          >
            devabir.me
          </a>
          <a
            href="https://www.webnest.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-dark/50 transition-colors hover:text-dark"
          >
            webnest.app
          </a>
          <span className="text-dark/30">mystate.devabir.me</span>
        </div>
      </div>
    </footer>
  );
}
