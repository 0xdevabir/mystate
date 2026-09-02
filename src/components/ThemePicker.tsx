"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { THEME_LIST } from "@/lib/themes";
import { CUSTOM_THEME_ID, normalizeHex } from "@/lib/themes/custom";
import type { CustomThemeColors } from "@/types";

interface ThemePickerProps {
  selected: string;
  onSelect: (id: string) => void;
  customColors: CustomThemeColors;
  onCustomColorsChange: (colors: CustomThemeColors) => void;
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const safe = normalizeHex(value) || value;

  return (
    <label className="flex items-center gap-3">
      <span className="w-20 text-[11px] font-bold uppercase tracking-widest text-dark/50">
        {label}
      </span>
      <span className="relative flex items-center gap-2 rounded-full border border-dark/10 bg-light/80 px-2 py-1.5 transition-all duration-300 focus-within:border-dark/25 focus-within:shadow-sm">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-dark/10"
          aria-label={`${label} color`}
        />
        <input
          type="text"
          value={safe.replace("#", "")}
          onChange={(e) => {
            const next = normalizeHex(e.target.value);
            if (next) onChange(next);
          }}
          className="w-[4.5rem] bg-transparent font-mono text-[11px] font-semibold uppercase tracking-wide text-dark/70 outline-none"
          maxLength={6}
          spellCheck={false}
        />
      </span>
    </label>
  );
}

export function ThemePicker({
  selected,
  onSelect,
  customColors,
  onCustomColorsChange,
}: ThemePickerProps) {
  const isCustom = selected === CUSTOM_THEME_ID;

  function updateCustom(patch: Partial<CustomThemeColors>) {
    onCustomColorsChange({ ...customColors, ...patch });
    if (!isCustom) onSelect(CUSTOM_THEME_ID);
  }

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

        <motion.button
          type="button"
          onClick={() => onSelect(CUSTOM_THEME_ID)}
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-500 ease-out ${
            isCustom
              ? "border-dark bg-dark text-bg shadow-sm"
              : "border-dark/15 bg-light/60 text-dark/60 hover:border-dark/30 hover:bg-light hover:text-dark"
          }`}
        >
          <span
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
            style={{
              background: `linear-gradient(135deg, ${customColors.accent}, ${customColors.highlight})`,
            }}
          >
            <Palette className="h-2.5 w-2.5 text-white/90" strokeWidth={2.5} />
          </span>
          Custom
        </motion.button>
      </div>

      <AnimatePresence>
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-dark/10 bg-light/50 px-5 py-4">
              <ColorField
                label="Background"
                value={customColors.bg}
                onChange={(bg) => updateCustom({ bg })}
              />
              <ColorField
                label="Accent"
                value={customColors.accent}
                onChange={(accent) => updateCustom({ accent })}
              />
              <ColorField
                label="Highlight"
                value={customColors.highlight}
                onChange={(highlight) => updateCustom({ highlight })}
              />
              <p className="text-[11px] text-dark/40">
                Card colors are derived automatically from your picks.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
