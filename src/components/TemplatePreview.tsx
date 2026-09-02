"use client";

import { useEffect, useRef, useState } from "react";

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
  const [displaySrc, setDisplaySrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const pendingSrc = useRef<string | null>(null);

  useEffect(() => {
    if (src === displaySrc) return;

    pendingSrc.current = src;
    setIsLoaded(false);

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (pendingSrc.current !== src) return;
      setDisplaySrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      if (pendingSrc.current !== src) return;
      setDisplaySrc(src);
      setIsLoaded(true);
    };
    img.src = src;

    return () => {
      pendingSrc.current = null;
    };
  }, [src, displaySrc]);

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div className="relative w-full" style={aspectRatio ? { aspectRatio } : undefined}>
      <div
        className={`absolute inset-0 rounded-lg bg-dark/8 transition-opacity duration-300 ${
          isLoaded ? "pointer-events-none opacity-0" : "animate-pulse opacity-100"
        }`}
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
