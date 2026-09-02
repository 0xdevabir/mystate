"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";

interface HeroProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function Hero({ username, onUsernameChange, onSubmit, isLoading }: HeroProps) {
  const [focused, setFocused] = useState(false);

  return (
    <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Beautiful GitHub stats for your profile
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          Your GitHub story,
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            beautifully told
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-lg text-zinc-400"
        >
          Pick a template, copy one line of code, and add stunning stats to your GitHub README.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mx-auto mt-10 max-w-md"
        >
          <div
            className={`flex items-center gap-2 rounded-2xl border bg-zinc-900/80 p-2 backdrop-blur-sm transition-all duration-300 ${
              focused
                ? "border-violet-500/50 shadow-lg shadow-violet-500/10"
                : "border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2 pl-3 text-zinc-500">
              <GitHubIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter GitHub username"
              className="flex-1 bg-transparent py-3 text-white placeholder:text-zinc-600 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? "Loading..." : "Go"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
