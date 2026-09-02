"use client";

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
        {THEME_LIST.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-200 ${
              selected === theme.id
                ? "border-dark bg-dark text-bg"
                : "border-dark/15 bg-light/60 text-dark/60 hover:border-dark/30 hover:text-dark"
            }`}
          >
            <span className="flex gap-1">
              <span
                className="h-3.5 w-3.5 rounded-full border border-dark/10"
                style={{ background: theme.bg }}
              />
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: theme.accent }}
              />
            </span>
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
