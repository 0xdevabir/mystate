"use client";

import { useEffect, useState } from "react";

interface TemplatePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function TemplatePreview({
  src,
  alt,
  width,
  height,
  className = "block h-auto w-full max-w-full rounded-lg",
  priority = false,
}: TemplatePreviewProps) {
  const [readySrc, setReadySrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReadySrc(null);

    const img = new Image();
    img.decoding = "async";
    if (priority) img.loading = "eager";

    const finish = () => {
      if (!cancelled) setReadySrc(src);
    };

    img.onload = finish;
    img.onerror = finish;
    img.src = src;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  const isLoading = readySrc === null;

  return (
    <div className="relative w-full" style={aspectRatio ? { aspectRatio } : undefined}>
      <div
        className={`absolute inset-0 overflow-hidden rounded-lg transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isLoading}
        aria-label={isLoading ? "Loading preview" : undefined}
      >
        <div className="absolute inset-0 bg-dark/6" />
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-dark/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-dark/10 border-t-accent/70" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-dark/35">
            Loading preview
          </span>
        </div>
      </div>

      {readySrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={readySrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={`${className} opacity-100 transition-opacity duration-300`}
        />
      )}
    </div>
  );
}
