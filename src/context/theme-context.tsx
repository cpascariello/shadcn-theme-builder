"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { ThemeColors, FontConfig, ShadowConfig, ShadowPreset } from "@/lib/theme-types";
import { presets } from "@/lib/presets";
import { loadGoogleFont } from "@/lib/fonts";
import { SHADOW_PRESETS } from "@/lib/shadow-presets";

interface ThemeSnapshot {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  letterSpacing: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;
  activePreset: string;
}

interface ThemeContextValue {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  letterSpacing: string;
  previewMode: "light" | "dark";
  activePreset: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;

  setColor: (mode: "light" | "dark", key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: string) => void;
  setLetterSpacing: (value: string) => void;
  setPreviewMode: (mode: "light" | "dark") => void;
  loadPreset: (presetName: string) => void;
  setFont: (category: keyof FontConfig, font: string) => void;
  setShadow: (updates: Partial<ShadowConfig>) => void;
  setShadowPreset: (preset: ShadowPreset) => void;
  resetShadow: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HISTORY_MAX = 50;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultPreset = presets[0];
  const [light, setLight] = useState<ThemeColors>(defaultPreset.light);
  const [dark, setDark] = useState<ThemeColors>(defaultPreset.dark);
  const [radius, setRadiusState] = useState(defaultPreset.radius);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [activePreset, setActivePreset] = useState(defaultPreset.name);
  // Tracks which theme was last loaded via loadPreset — survives customization
  const [loadedTheme, setLoadedTheme] = useState(defaultPreset.name);
  const [fonts, setFonts] = useState<FontConfig>(defaultPreset.fonts);
  const [letterSpacing, setLetterSpacingState] = useState(defaultPreset.letterSpacing);
  const [shadow, setShadowState] = useState<ShadowConfig>(defaultPreset.shadow);
  const [shadowPreset, setShadowPresetState] = useState<ShadowPreset>(defaultPreset.shadowPreset);

  // --- History state ---
  const initialSnapshot: ThemeSnapshot = {
    light: defaultPreset.light,
    dark: defaultPreset.dark,
    radius: defaultPreset.radius,
    letterSpacing: defaultPreset.letterSpacing,
    fonts: defaultPreset.fonts,
    shadow: defaultPreset.shadow,
    shadowPreset: defaultPreset.shadowPreset,
    activePreset: defaultPreset.name,
  };
  const [history, setHistory] = useState<ThemeSnapshot[]>([initialSnapshot]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);
  const isRestoringRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

  // Snapshot ref always reflects current undoable state
  const currentSnapshotRef = useRef<ThemeSnapshot>(initialSnapshot);
  useEffect(() => {
    currentSnapshotRef.current = {
      light, dark, radius, letterSpacing, fonts, shadow, shadowPreset, activePreset,
    };
  }, [light, dark, radius, letterSpacing, fonts, shadow, shadowPreset, activePreset]);

  // Debounced push: captures post-mutation state after 300ms settle
  const pushHistory = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      const snapshot = currentSnapshotRef.current;
      const h = historyRef.current;
      const idx = historyIndexRef.current;

      // Truncate any redo future
      const truncated = h.slice(0, idx + 1);
      const next = [...truncated, snapshot];
      // Cap at max entries
      if (next.length > HISTORY_MAX) {
        next.shift();
        setHistory(next);
        setHistoryIndex(next.length - 1);
      } else {
        setHistory(next);
        setHistoryIndex(next.length - 1);
      }
    }, 300);
  }, []);

  const applySnapshot = useCallback((snapshot: ThemeSnapshot) => {
    isRestoringRef.current = true;
    setLight(snapshot.light);
    setDark(snapshot.dark);
    setRadiusState(snapshot.radius);
    setLetterSpacingState(snapshot.letterSpacing);
    setFonts(snapshot.fonts);
    setShadowState(snapshot.shadow);
    setShadowPresetState(snapshot.shadowPreset);
    setActivePreset(snapshot.activePreset);
    // Reset flag after React processes the batch
    requestAnimationFrame(() => {
      isRestoringRef.current = false;
    });
  }, []);

  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx > 0) {
      // Flush any pending debounced push so it doesn't fire after undo
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const newIdx = idx - 1;
      setHistoryIndex(newIdx);
      applySnapshot(historyRef.current[newIdx]);
    }
  }, [applySnapshot]);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    const h = historyRef.current;
    if (idx < h.length - 1) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const newIdx = idx + 1;
      setHistoryIndex(newIdx);
      applySnapshot(h[newIdx]);
    }
  }, [applySnapshot]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (mod && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Load Google fonts when fonts change
  useEffect(() => {
    loadGoogleFont(fonts.sans);
    loadGoogleFont(fonts.serif);
    loadGoogleFont(fonts.mono);
  }, [fonts]);

  const setColor = useCallback(
    (mode: "light" | "dark", key: keyof ThemeColors, value: string) => {
      if (!isRestoringRef.current) pushHistory();
      if (mode === "light") {
        setLight((prev) => ({ ...prev, [key]: value }));
      } else {
        setDark((prev) => ({ ...prev, [key]: value }));
      }
      setActivePreset("custom");
    },
    [pushHistory]
  );

  const setRadius = useCallback((r: string) => {
    if (!isRestoringRef.current) pushHistory();
    setRadiusState(r);
    setActivePreset("custom");
  }, [pushHistory]);

  const setLetterSpacing = useCallback((value: string) => {
    if (!isRestoringRef.current) pushHistory();
    setLetterSpacingState(value);
    setActivePreset("custom");
  }, [pushHistory]);

  const setFont = useCallback((category: keyof FontConfig, font: string) => {
    if (!isRestoringRef.current) pushHistory();
    setFonts((prev) => ({ ...prev, [category]: font }));
    setActivePreset("custom");
  }, [pushHistory]);

  const setShadow = useCallback((updates: Partial<ShadowConfig>) => {
    if (!isRestoringRef.current) pushHistory();
    setShadowState((prev) => ({ ...prev, ...updates }));
    setShadowPresetState("custom");
    setActivePreset("custom");
  }, [pushHistory]);

  const setShadowPreset = useCallback((preset: ShadowPreset) => {
    if (!isRestoringRef.current) pushHistory();
    setShadowPresetState(preset);
    if (preset !== "custom") {
      const presetConfig = SHADOW_PRESETS[preset];
      setShadowState((prev) => ({
        ...presetConfig,
        lightColor: prev.lightColor,
        darkColor: prev.darkColor,
      }));
    }
    setActivePreset("custom");
  }, [pushHistory]);

  const resetShadow = useCallback(() => {
    if (!isRestoringRef.current) pushHistory();
    const themePreset = presets.find((p) => p.name === loadedTheme) ?? presets[0];
    setShadowState(themePreset.shadow);
    setShadowPresetState(themePreset.shadowPreset);
  }, [loadedTheme, pushHistory]);

  const loadPreset = useCallback((presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      isRestoringRef.current = true;
      setLight(preset.light);
      setDark(preset.dark);
      setRadiusState(preset.radius);
      setLetterSpacingState(preset.letterSpacing);
      setFonts(preset.fonts);
      setShadowState(preset.shadow);
      setShadowPresetState(preset.shadowPreset);
      setActivePreset(preset.name);
      setLoadedTheme(preset.name);

      // Reset history to single entry with the new preset
      const snapshot: ThemeSnapshot = {
        light: preset.light,
        dark: preset.dark,
        radius: preset.radius,
        letterSpacing: preset.letterSpacing,
        fonts: preset.fonts,
        shadow: preset.shadow,
        shadowPreset: preset.shadowPreset,
        activePreset: preset.name,
      };
      // Flush any pending debounced push
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setHistory([snapshot]);
      setHistoryIndex(0);

      requestAnimationFrame(() => {
        isRestoringRef.current = false;
      });
    }
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <ThemeContext.Provider
      value={{
        light,
        dark,
        radius,
        letterSpacing,
        previewMode,
        activePreset,
        fonts,
        shadow,
        shadowPreset,
        setColor,
        setRadius,
        setLetterSpacing,
        setPreviewMode,
        loadPreset,
        setFont,
        setShadow,
        setShadowPreset,
        resetShadow,
        undo,
        redo,
        canUndo,
        canRedo,
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
