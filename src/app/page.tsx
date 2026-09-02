"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { TemplateGallery } from "@/components/TemplateGallery";
import { TemplateGallerySkeleton } from "@/components/TemplateGallerySkeleton";
import { EmbedCode } from "@/components/EmbedCode";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { DEFAULT_TEMPLATE } from "@/lib/templates";
import { DEFAULT_THEME, DEFAULT_CUSTOM_COLORS } from "@/lib/themes";
import type { CustomThemeColors } from "@/types";

function scrollToTemplates() {
  window.requestAnimationFrame(() => {
    document.getElementById("templates")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME);
  const [customColors, setCustomColors] = useState<CustomThemeColors>(DEFAULT_CUSTOM_COLORS);
  const [isValidating, setIsValidating] = useState(false);
  const [previewsLoading, setPreviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showSkeleton = isValidating || previewsLoading;
  const showGallery = Boolean(activeUsername) && !showSkeleton;

  const handlePreviewsReady = useCallback(() => {
    setPreviewsLoading(false);
  }, []);

  useEffect(() => {
    if (!showSkeleton) return;
    const timer = window.setTimeout(scrollToTemplates, 80);
    return () => window.clearTimeout(timer);
  }, [showSkeleton]);

  const handleSubmit = useCallback(async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsValidating(true);
    setPreviewsLoading(true);
    setError(null);
    setActiveUsername("");

    try {
      const res = await fetch(`/api/user/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch user");
      }
      setActiveUsername(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setActiveUsername("");
      setPreviewsLoading(false);
    } finally {
      setIsValidating(false);
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <Hero
          username={username}
          onUsernameChange={setUsername}
          onSubmit={handleSubmit}
          isLoading={isValidating}
        />

        {error && (
          <div className="mx-auto -mt-6 mb-2 max-w-lg px-6">
            <p className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-center text-[14px] text-red-600">
              {error}
            </p>
          </div>
        )}

        <Marquee />
        <HowItWorks />

        {showSkeleton && <TemplateGallerySkeleton />}

        {activeUsername && (
          <div className={showGallery ? undefined : "sr-only"} aria-hidden={!showGallery}>
            <TemplateGallery
              username={activeUsername}
              draftUsername={username}
              selectedTemplate={selectedTemplate}
              selectedTheme={selectedTheme}
              customColors={customColors}
              onSelectTemplate={setSelectedTemplate}
              onSelectTheme={setSelectedTheme}
              onCustomColorsChange={setCustomColors}
              onPreviewsReady={handlePreviewsReady}
            />
          </div>
        )}

        {showGallery && (
          <EmbedCode
            username={activeUsername}
            template={selectedTemplate}
            theme={selectedTheme}
            customColors={customColors}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
