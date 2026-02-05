"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

export function LightDarkToggle() {
  const { previewMode, setPreviewMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setPreviewMode(previewMode === "light" ? "dark" : "light")}
    >
      {previewMode === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
