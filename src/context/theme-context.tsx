"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ThemeColors, FontConfig, ShadowConfig, ShadowPreset } from "@/lib/theme-types";
import { presets } from "@/lib/presets";
import { loadGoogleFont } from "@/lib/fonts";
import { SHADOW_PRESETS, getShadowColor, SHADOW_COLOR_LIGHT, SHADOW_COLOR_DARK } from "@/lib/shadow-presets";

interface ThemeContextValue {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  activeMode: "light" | "dark";
  previewMode: "light" | "dark";
  activePreset: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;

  setColor: (mode: "light" | "dark", key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  setPreviewMode: (mode: "light" | "dark") => void;
  loadPreset: (presetName: string) => void;
  setFont: (category: keyof FontConfig, font: string) => void;
  setShadow: (updates: Partial<ShadowConfig>) => void;
  setShadowPreset: (preset: ShadowPreset) => void;
  resetShadow: () => void;
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
  // Tracks which theme was last loaded via loadPreset — survives customization
  const [loadedTheme, setLoadedTheme] = useState(defaultPreset.name);
  const [fonts, setFonts] = useState<FontConfig>(defaultPreset.fonts);
  const [shadow, setShadowState] = useState<ShadowConfig>(defaultPreset.shadow);
  const [shadowPreset, setShadowPresetState] = useState<ShadowPreset>(defaultPreset.shadowPreset);

  // Load Google fonts when fonts change
  useEffect(() => {
    loadGoogleFont(fonts.sans);
    loadGoogleFont(fonts.serif);
    loadGoogleFont(fonts.mono);
  }, [fonts]);

  // Update shadow color when preview mode changes — only if using a default mode color
  // (not a theme-specific or user-customized color)
  useEffect(() => {
    setShadowState((prev) => {
      const isDefaultLight = prev.color === SHADOW_COLOR_LIGHT;
      const isDefaultDark = prev.color === SHADOW_COLOR_DARK;
      if (isDefaultLight || isDefaultDark) {
        return { ...prev, color: getShadowColor(previewMode) };
      }
      return prev;
    });
  }, [previewMode]);

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

  const setFont = useCallback((category: keyof FontConfig, font: string) => {
    setFonts((prev) => ({ ...prev, [category]: font }));
    setActivePreset("custom");
  }, []);

  const setShadow = useCallback((updates: Partial<ShadowConfig>) => {
    setShadowState((prev) => ({ ...prev, ...updates }));
    setShadowPresetState("custom");
    setActivePreset("custom");
  }, []);

  const setShadowPreset = useCallback((preset: ShadowPreset) => {
    setShadowPresetState(preset);
    if (preset !== "custom") {
      const presetConfig = SHADOW_PRESETS[preset];
      // Only change geometry — keep the current shadow color
      setShadowState((prev) => ({
        ...presetConfig,
        color: prev.color,
      }));
    }
    setActivePreset("custom");
  }, []);

  const resetShadow = useCallback(() => {
    const themePreset = presets.find((p) => p.name === loadedTheme) ?? presets[0];
    const shadowColor = themePreset.shadow.color;
    // If the theme uses a default neutral color, adapt it to the current mode
    const isNeutral = shadowColor === SHADOW_COLOR_LIGHT || shadowColor === SHADOW_COLOR_DARK;
    setShadowState({
      ...themePreset.shadow,
      color: isNeutral ? getShadowColor(previewMode) : shadowColor,
    });
    setShadowPresetState(themePreset.shadowPreset);
  }, [loadedTheme, previewMode]);

  const loadPreset = useCallback((presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setLight(preset.light);
      setDark(preset.dark);
      setRadiusState(preset.radius);
      setFonts(preset.fonts);
      setShadowState(preset.shadow);
      setShadowPresetState(preset.shadowPreset);
      setActivePreset(preset.name);
      setLoadedTheme(preset.name);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        light,
        dark,
        radius,
        activeMode,
        previewMode,
        activePreset,
        fonts,
        shadow,
        shadowPreset,
        setColor,
        setRadius,
        setActiveMode,
        setPreviewMode,
        loadPreset,
        setFont,
        setShadow,
        setShadowPreset,
        resetShadow,
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
