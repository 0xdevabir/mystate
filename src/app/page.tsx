"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { TemplateGallery } from "@/components/TemplateGallery";
import { EmbedCode } from "@/components/EmbedCode";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { DEFAULT_TEMPLATE } from "@/lib/templates";
import { DEFAULT_THEME } from "@/lib/themes";

export default function Home() {
  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch user");
      }
      setActiveUsername(trimmed);
      document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setActiveUsername("");
    } finally {
      setIsLoading(false);
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
          isLoading={isLoading}
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

        <TemplateGallery
          templates={TEMPLATE_LIST}
          username={activeUsername}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          onSelectTemplate={setSelectedTemplate}
          onSelectTheme={setSelectedTheme}
        />

        {activeUsername && (
          <EmbedCode
            username={activeUsername}
            template={selectedTemplate}
            theme={selectedTheme}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

