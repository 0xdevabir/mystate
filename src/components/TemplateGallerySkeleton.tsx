export function TemplateGallerySkeleton() {
  return (
    <section className="bg-bg px-6 py-24 md:py-28" aria-busy="true" aria-label="Loading templates">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-4 h-3 w-20 rounded-full bg-dark/10" />
        <div className="mb-6 h-10 w-64 max-w-full rounded-lg bg-dark/10" />
        <div className="mb-10 h-4 w-96 max-w-full rounded bg-dark/8" />

        <div className="mb-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 rounded-full bg-dark/10" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-px bg-dark/10 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-bg p-6 sm:p-8">
              <div className="mb-4 flex justify-between">
                <div className="h-3 w-8 rounded bg-dark/10" />
                <div className="h-3 w-16 rounded bg-dark/10" />
              </div>
              <div className="mb-5 aspect-[820/520] overflow-hidden rounded-lg bg-dark/8">
                <div className="h-full w-full animate-pulse bg-gradient-to-br from-dark/5 via-dark/10 to-dark/5" />
              </div>
              <div className="mb-2 h-6 w-40 rounded bg-dark/10" />
              <div className="h-4 w-full max-w-sm rounded bg-dark/8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
