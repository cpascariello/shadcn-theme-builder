"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full text-left text-sm font-medium mb-2 hover:text-primary transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {title}
      </button>
      {isOpen && (
        <>
          <Separator className="mb-3" />
          {children}
        </>
      )}
    </div>
  );
}

export function ColorEditor() {
  const { activeMode, setActiveMode, radius, setRadius } = useTheme();

  return (
    <div className="w-96 flex-shrink-0 border-r flex flex-col overflow-hidden bg-background">
      {/* Mode tabs at top */}
      <div className="p-3 border-b">
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "light" | "dark")}>
          <TabsList className="w-full">
            <TabsTrigger value="light" className="flex-1">Light</TabsTrigger>
            <TabsTrigger value="dark" className="flex-1">Dark</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Colors section (inside tabs - mode-specific) */}
        <CollapsibleSection title="Colors">
          <div className="space-y-4">
            {COLOR_GROUPS.map((group) => (
              <div key={group.label}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">{group.label}</h4>
                {group.variables.map((varKey) => (
                  <ColorRow key={varKey} variableKey={varKey} mode={activeMode} />
                ))}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Fonts section (shared across modes) */}
        <CollapsibleSection title="Fonts">
          <div className="space-y-3">
            <FontPicker category="sans" label="Sans" />
            <FontPicker category="serif" label="Serif" />
            <FontPicker category="mono" label="Mono" />
          </div>
        </CollapsibleSection>

        {/* Radius section (shared) */}
        <CollapsibleSection title="Radius">
          <div className="flex items-center gap-3">
            <Slider
              value={[parseFloat(radius)]}
              onValueChange={([v]) => setRadius(`${v}rem`)}
              min={0}
              max={1}
              step={0.025}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-14 text-right font-mono">
              {radius}
            </span>
          </div>
        </CollapsibleSection>

        {/* Shadows section (shared) */}
        <CollapsibleSection title="Shadows">
          <ShadowControls />
        </CollapsibleSection>
      </div>
    </div>
  );
}
