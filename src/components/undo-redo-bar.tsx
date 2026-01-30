"use client";

import { useMemo } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

export function UndoRedoBar() {
  const { undo, redo, canUndo, canRedo } = useTheme();
  const mod = useMemo(
    () => (typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl+"),
    [],
  );

  return (
    <div className="flex items-center gap-1 p-3 border-b bg-background/80 backdrop-blur-sm flex-shrink-0">
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
