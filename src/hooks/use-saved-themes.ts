"use client";

import { useState, useEffect, useCallback } from "react";
import type { ThemeConfig } from "@/lib/theme-types";

const STORAGE_KEY = "shadcn-theme-builder-saved";

function readFromStorage(): ThemeConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(themes: ThemeConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export function useSavedThemes() {
  const [savedThemes, setSavedThemes] = useState<ThemeConfig[]>([]);

  useEffect(() => {
    setSavedThemes(readFromStorage());
  }, []);

  const save = useCallback((theme: ThemeConfig): boolean => {
    const current = readFromStorage();
    const existingIndex = current.findIndex((t) => t.name === theme.name);
    let next: ThemeConfig[];
    if (existingIndex >= 0) {
      next = [...current];
      next[existingIndex] = theme;
    } else {
      next = [...current, theme];
    }
    writeToStorage(next);
    setSavedThemes(next);
    return existingIndex >= 0;
  }, []);

  const remove = useCallback((name: string) => {
    const current = readFromStorage();
    const next = current.filter((t) => t.name !== name);
    writeToStorage(next);
    setSavedThemes(next);
  }, []);

  const exists = useCallback((name: string): boolean => {
    return readFromStorage().some((t) => t.name === name);
  }, []);

  const saveAll = useCallback((themes: ThemeConfig[]) => {
    const current = readFromStorage();
    let next = [...current];
    for (const theme of themes) {
      const idx = next.findIndex((t) => t.name === theme.name);
      if (idx >= 0) {
        next[idx] = theme;
      } else {
        next = [...next, theme];
      }
    }
    writeToStorage(next);
    setSavedThemes(next);
  }, []);

  return { savedThemes, save, saveAll, remove, exists };
}
