"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 pb-16 pt-28 md:pt-32">
      <div className="mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 28 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="leading-none"
        >
          <h1 className="text-[56px] font-black sm:text-[88px] md:text-[120px] lg:text-[140px]">
            <span className="text-dark">my</span>
            <span className="text-accent">state</span>
          </h1>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:gap-x-6">
            {["Pick.", "Preview.", "Paste.", "Done."].map((word, i) => (
              <motion.p
                key={word}
                initial={{ opacity: 0, filter: "blur(4px)", y: 16 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className={`text-[16px] font-black sm:text-[22px] md:text-[30px] ${
                  i % 2 === 1 ? "text-accent" : "text-dark"
                }`}
              >
                {word}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-dark/55"
        >
          Beautiful GitHub stats for your profile README. Enter your username, choose a
          template, copy one line of code.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mx-auto mt-10 max-w-lg"
        >
          <div
            className={`flex items-center gap-2 rounded-full border bg-light/80 p-2 transition-all duration-300 ${
              focused ? "border-accent shadow-[0_8px_30px_#a8bca130]" : "border-dark/10"
            }`}
          >
            <div className="flex items-center pl-4 text-dark/40">
              <GitHubIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="github username"
              className="flex-1 bg-transparent py-3.5 text-[15px] text-dark placeholder:text-dark/30 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="group relative overflow-hidden rounded-full bg-dark px-6 py-3.5 text-[13px] font-bold text-bg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <span className="absolute inset-0 -translate-x-full rounded-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0 group-disabled:translate-x-0" />
              <span className="relative z-10 transition-colors group-hover:text-dark">
                {isLoading ? "Loading..." : "Generate"}
              </span>
              {!isLoading && (
                <span className="relative z-10 ml-1 transition-all group-hover:translate-x-0.5 group-hover:text-dark">
                  →
                </span>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
