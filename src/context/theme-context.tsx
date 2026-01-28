"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ThemeColors } from "@/lib/theme-types";
import { presets } from "@/lib/presets";

interface ThemeContextValue {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  activeMode: "light" | "dark";
  previewMode: "light" | "dark";
  activePreset: string;

  setColor: (mode: "light" | "dark", key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  setPreviewMode: (mode: "light" | "dark") => void;
  loadPreset: (presetName: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultPreset = presets[0];
  const [light, setLight] = useState<ThemeColors>(defaultPreset.light);
  const [dark, setDark] = useState<ThemeColors>(defaultPreset.dark);
  const [radius, setRadiusState] = useState(defaultPreset.radius);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [activePreset, setActivePreset] = useState(defaultPreset.name);

  const setColor = useCallback(
    (mode: "light" | "dark", key: keyof ThemeColors, value: string) => {
      if (mode === "light") {
        setLight((prev) => ({ ...prev, [key]: value }));
      } else {
        setDark((prev) => ({ ...prev, [key]: value }));
      }
      setActivePreset("custom");
    },
    []
  );

  const setRadius = useCallback((r: string) => {
    setRadiusState(r);
    setActivePreset("custom");
  }, []);

  const loadPreset = useCallback((presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setLight(preset.light);
      setDark(preset.dark);
      setRadiusState(preset.radius);
      setActivePreset(preset.name);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        light, dark, radius, activeMode, previewMode, activePreset,
        setColor, setRadius, setActiveMode, setPreviewMode, loadPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
