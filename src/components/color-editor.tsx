"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { COLOR_GROUPS } from "@/lib/theme-types";
import { ColorRow } from "./color-row";
import { FontPicker } from "./font-picker";
import { ShadowControls } from "./shadow-controls";
import { useTheme } from "@/context/theme-context";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-muted/50 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export function ColorEditor() {
  const { previewMode, radius, setRadius, letterSpacing, setLetterSpacing, hueShift, setHueShift, lightnessShift, setLightnessShift } = useTheme();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filteredGroups = useMemo(() => {
    if (!isSearching) return COLOR_GROUPS;
    return COLOR_GROUPS
      .map((group) => ({
        ...group,
        variables: group.label.toLowerCase().includes(q)
          ? group.variables
          : group.variables.filter((v) => v.toLowerCase().includes(q)),
      }))
      .filter((group) => group.variables.length > 0 || group.label.toLowerCase().includes(q));
  }, [q, isSearching]);

  const sectionMatches = (title: string) => !isSearching || title.toLowerCase().includes(q);

  return (
    <div className="w-96 flex-shrink-0 border-r flex flex-col overflow-hidden bg-background">
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Color Shifts */}
        {sectionMatches("Color Shifts") && (
          <CollapsibleSection title="Color Shifts" defaultOpen={false}>
            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground font-medium w-14 shrink-0">Hue</label>
                <Slider
                  value={[hueShift]}
                  onValueChange={([v]) => setHueShift(v)}
                  min={-180}
                  max={180}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right font-mono tabular-nums">
                  {hueShift}&deg;
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground font-medium w-14 shrink-0">Lightness</label>
                <Slider
                  value={[lightnessShift]}
                  onValueChange={([v]) => setLightnessShift(v)}
                  min={-0.15}
                  max={0.15}
                  step={0.005}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right font-mono tabular-nums">
                  {lightnessShift > 0 ? "+" : ""}{lightnessShift}
                </span>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Color groups — each is its own collapsible section */}
        {filteredGroups.map((group) => (
          <CollapsibleSection key={group.label} title={group.label} defaultOpen={isSearching || true}>
            <div className="space-y-1">
              {group.variables.map((varKey) => (
                <ColorRow key={varKey} variableKey={varKey} mode={previewMode} />
              ))}
            </div>
          </CollapsibleSection>
        ))}

        {sectionMatches("Fonts") && (
          <CollapsibleSection title="Fonts" defaultOpen>
            <div className="space-y-3">
              <FontPicker category="sans" label="Sans" />
              <FontPicker category="serif" label="Serif" />
              <FontPicker category="mono" label="Mono" />
            </div>
          </CollapsibleSection>
        )}

        {sectionMatches("Border Radius") && (
          <CollapsibleSection title="Border Radius" defaultOpen>
            <div className="flex items-center gap-3">
              <Slider
                value={[parseFloat(radius)]}
                onValueChange={([v]) => setRadius(`${v}rem`)}
                min={0}
                max={3}
                step={0.125}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-14 text-right font-mono">
                {radius}
              </span>
            </div>
          </CollapsibleSection>
        )}

        {sectionMatches("Shadows") && (
          <CollapsibleSection title="Shadows" defaultOpen>
            <ShadowControls />
          </CollapsibleSection>
        )}

        {sectionMatches("Letter Spacing") && (
          <CollapsibleSection title="Letter Spacing" defaultOpen>
            <div className="flex items-center gap-3">
              <Slider
                value={[parseFloat(letterSpacing)]}
                onValueChange={([v]) => setLetterSpacing(`${v}em`)}
                min={-1}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-14 text-right font-mono">
                {letterSpacing}
              </span>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
