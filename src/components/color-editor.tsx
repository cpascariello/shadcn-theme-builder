"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { COLOR_GROUPS } from "@/lib/theme-types";
import { ColorRow } from "./color-row";
import { useTheme } from "@/context/theme-context";

export function ColorEditor() {
  const { activeMode, setActiveMode, radius, setRadius } = useTheme();

  return (
    <div className="w-80 border-r flex flex-col h-full bg-background">
      {/* Mode tabs at top */}
      <div className="p-3 border-b">
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "light" | "dark")}>
          <TabsList className="w-full">
            <TabsTrigger value="light" className="flex-1">Light</TabsTrigger>
            <TabsTrigger value="dark" className="flex-1">Dark</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable color groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {COLOR_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-medium mb-2">{group.label}</h3>
            <Separator className="mb-2" />
            {group.variables.map((varKey) => (
              <ColorRow key={varKey} variableKey={varKey} mode={activeMode} />
            ))}
          </div>
        ))}

        {/* Radius section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Radius</h3>
          <Separator className="mb-2" />
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
        </div>
      </div>
    </div>
  );
}
