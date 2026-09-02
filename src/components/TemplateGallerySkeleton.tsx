"use client";

import { motion } from "framer-motion";

export function TemplateGallerySkeleton() {
  return (
    <motion.section
      id="templates"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28 bg-bg px-6 py-24 md:py-28"
      aria-busy="true"
      aria-label="Loading templates"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 animate-pulse md:mb-16">
          <div className="mb-4 h-3 w-20 rounded-full bg-dark/10" />
          <div className="mb-6 h-10 w-64 max-w-full rounded-lg bg-dark/10" />
          <div className="mb-8 h-4 w-96 max-w-full rounded bg-dark/8" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-16 rounded-full bg-dark/10" />
            ))}
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-dark/10" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-px bg-dark/10 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-bg p-6 sm:p-8">
              <div className="mb-4 flex justify-between">
                <div className="h-3 w-8 animate-pulse rounded bg-dark/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-dark/10" />
              </div>
              <div className="relative mb-5 aspect-[860/560] overflow-hidden rounded-lg bg-dark/6">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-dark/5 via-dark/12 to-dark/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark/10 border-t-accent/70" />
                </div>
              </div>
              <div className="mb-2 h-6 w-40 animate-pulse rounded bg-dark/10" />
              <div className="h-4 w-full max-w-sm animate-pulse rounded bg-dark/8" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
