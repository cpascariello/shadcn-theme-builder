"use client";

import { useState, useEffect } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { PresetDropdown } from "./preset-dropdown";
import { LightDarkToggle } from "./light-dark-toggle";

export function Toolbar() {
  const { undo, redo, canUndo, canRedo } = useTheme();
  const [mod, setMod] = useState("Ctrl+");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod("⌘");
  }, []);

  return (
    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 border-b bg-background/80 backdrop-blur-sm flex-shrink-0">
      <PresetDropdown />
      <LightDarkToggle />
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={undo}
        disabled={!canUndo}
        title={`Undo (${mod}Z)`}
      >
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={redo}
        disabled={!canRedo}
        title={`Redo (${mod}Shift+Z)`}
      >
        <Redo2 />
      </Button>
    </div>
  );
}
