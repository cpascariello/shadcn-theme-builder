"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Trash2, Cloud, Loader2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSavedThemes } from "@/hooks/use-saved-themes";
import { useAlephSync } from "@/hooks/use-aleph-sync";
import { presets } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PresetDropdown() {
  const { activePreset, loadPreset, loadThemeConfig } = useTheme();
  const { savedThemes, remove } = useSavedThemes();
  const { isSyncing, remoteThemes, deleteFromAleph } = useAlephSync();
  const [presetOpen, setPresetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmCloudDelete, setConfirmCloudDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cloudOnly = useMemo(() => {
    if (!remoteThemes) return [];
    return remoteThemes.filter(
      (r) => !savedThemes.some((l) => l.name === r.name),
    );
  }, [remoteThemes, savedThemes]);

  const activeLabel =
    presets.find((p) => p.name === activePreset)?.label
    ?? savedThemes.find((t) => t.name === activePreset)?.label
    ?? cloudOnly.find((t) => t.name === activePreset)?.label
    ?? "Custom";

  return (
    <Popover open={presetOpen} onOpenChange={(open) => { setPresetOpen(open); if (!open) { setConfirmDelete(null); setConfirmCloudDelete(null); } }}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-28 md:min-w-36 justify-between text-sm">
          {activeLabel}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="end">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              loadPreset(preset.name);
              setPresetOpen(false);
            }}
            className={`flex items-center w-full px-3 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
              activePreset === preset.name ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            {preset.label}
          </button>
        ))}
        {activePreset === "custom" && (
          <button
            disabled
            className="flex items-center w-full px-3 py-1.5 text-sm rounded-sm text-muted-foreground"
          >
            Custom
          </button>
        )}
        {savedThemes.length > 0 && (
          <>
            <div className="my-1 border-t border-border" />
            <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              My Themes
            </div>
            {savedThemes.map((theme) => (
              <div
                key={theme.name}
                className={`flex items-center group rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  activePreset === theme.name ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <button
                  onClick={() => {
                    loadThemeConfig(theme);
                    setPresetOpen(false);
                  }}
                  className="flex-1 text-left px-3 py-1.5 text-sm"
                >
                  {theme.label}
                </button>
                {confirmDelete === theme.name ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(theme.name);
                      setConfirmDelete(null);
                    }}
                    className="px-2 py-1.5 rounded-sm text-xs text-destructive font-medium bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    Delete?
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(theme.name);
                    }}
                    className="px-2 py-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </>
        )}
        {cloudOnly.length > 0 && (
          <>
            <div className="my-1 border-t border-border" />
            <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Cloud Themes
            </div>
            {cloudOnly.map((theme) => (
              <div
                key={theme.name}
                className={`flex items-center group rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  activePreset === theme.name ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <button
                  onClick={() => {
                    loadThemeConfig(theme);
                    setPresetOpen(false);
                  }}
                  className="flex-1 flex items-center text-left px-3 py-1.5 text-sm"
                >
                  <Cloud className="h-3.5 w-3.5 mr-2 opacity-50 shrink-0" />
                  {theme.label}
                </button>
                {confirmCloudDelete === theme.name ? (
                  <button
                    disabled={deleting}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setDeleting(true);
                      try {
                        await deleteFromAleph(theme.name);
                      } catch { /* error surfaced via hook */ }
                      setDeleting(false);
                      setConfirmCloudDelete(null);
                    }}
                    className="px-2 py-1.5 rounded-sm text-xs text-destructive font-medium bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete?"}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmCloudDelete(theme.name);
                    }}
                    className="px-2 py-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </>
        )}
        {isSyncing && (
          <>
            <div className="my-1 border-t border-border" />
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading cloud themes…
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
