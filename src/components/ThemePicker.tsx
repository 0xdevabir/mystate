"use client";

import { motion } from "framer-motion";
import { THEME_LIST } from "@/lib/themes";

interface ThemePickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  return (
    <div className="mt-8">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-accent">
        Color Theme
      </p>
      <div className="flex flex-wrap gap-2">
        {THEME_LIST.map((theme) => {
          const isActive = selected === theme.id;
          return (
            <motion.button
              key={theme.id}
              type="button"
              onClick={() => onSelect(theme.id)}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-500 ease-out ${
                isActive
                  ? "border-dark bg-dark text-bg shadow-sm"
                  : "border-dark/15 bg-light/60 text-dark/60 hover:border-dark/30 hover:bg-light hover:text-dark"
              }`}
            >
              <span className="flex gap-1">
                <motion.span
                  className="h-3.5 w-3.5 rounded-full border border-dark/10"
                  style={{ background: theme.bg }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.35 }}
                />
                <motion.span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ background: theme.accent }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.35 }}
                />
              </span>
              {theme.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
