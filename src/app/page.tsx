"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TemplateGallery } from "@/components/TemplateGallery";
import { EmbedCode } from "@/components/EmbedCode";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { TEMPLATE_LIST, DEFAULT_THEME } from "@/lib/templates";

export default function Home() {
  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
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
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-600/6 blur-[100px]" />
      </div>

      <Header />
      <main className="relative">
        <Hero
          username={username}
          onUsernameChange={setUsername}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <HowItWorks />

        {error && (
          <div className="mx-auto -mt-8 mb-4 max-w-md px-6">
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        <div id="templates">
          <TemplateGallery
            templates={TEMPLATE_LIST}
            username={activeUsername}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        </div>

        {activeUsername && (
          <EmbedCode username={activeUsername} theme={selectedTheme} />
        )}
      </main>
      <Footer />
    </div>
  );
}

