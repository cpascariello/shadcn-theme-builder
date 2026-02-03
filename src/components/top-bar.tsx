"use client";

import { useState } from "react";
import { Sun, Moon, Save, ChevronDown, Trash2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSavedThemes } from "@/hooks/use-saved-themes";
import { presets } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportDialog } from "@/components/export-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function TopBar() {
  const { activePreset, loadPreset, loadThemeConfig, getThemeConfig, previewMode, setPreviewMode } = useTheme();
  const { savedThemes, save, remove, exists } = useSavedThemes();
  const [presetOpen, setPresetOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeLabel =
    presets.find((p) => p.name === activePreset)?.label
    ?? savedThemes.find((t) => t.name === activePreset)?.label
    ?? "Custom";

  const handleSave = () => {
    const trimmed = saveName.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (exists(slug) && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    const config = getThemeConfig(slug, trimmed);
    save(config);
    loadThemeConfig(config);
    setSaveName("");
    setConfirmOverwrite(false);
    setSaveOpen(false);
  };

  const handleSaveOpenChange = (open: boolean) => {
    setSaveOpen(open);
    if (!open) {
      setSaveName("");
      setConfirmOverwrite(false);
    }
  };

  return (
    <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
      <span className="font-semibold">ShadCN Theme Builder</span>

      <div className="flex items-center gap-2">
        {/* Preset dropdown */}
        <Popover open={presetOpen} onOpenChange={(open) => { setPresetOpen(open); if (!open) setConfirmDelete(null); }}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-36 justify-between">
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
          </PopoverContent>
        </Popover>

        {/* Save theme */}
        <Popover open={saveOpen} onOpenChange={handleSaveOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Save theme">
              <Save className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme name</label>
              <Input
                placeholder="My Theme"
                value={saveName}
                onChange={(e) => {
                  setSaveName(e.target.value);
                  setConfirmOverwrite(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                autoFocus
              />
              {confirmOverwrite && (
                <p className="text-xs text-destructive">
                  A theme with this name already exists. Click Save again to replace it.
                </p>
              )}
              <Button size="sm" className="w-full" onClick={handleSave} disabled={!saveName.trim()}>
                {confirmOverwrite ? "Replace" : "Save"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Light/dark toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setPreviewMode(previewMode === "light" ? "dark" : "light")
          }
        >
          {previewMode === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <ExportDialog />
      </div>
    </div>
  );
}
