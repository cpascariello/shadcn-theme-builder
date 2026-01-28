"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/theme-context";
import { ThemeColors } from "@/lib/theme-types";
import { Copy, Check, Download } from "lucide-react";

function generateGlobalsCss(light: ThemeColors, dark: ThemeColors, radius: string): string {
  const formatVars = (colors: ThemeColors, indent: string) => {
    return Object.entries(colors)
      .map(([key, value]) => `${indent}--${key}: ${value};`)
      .join("\n");
  };

  return `@import "tailwindcss";

:root {
  --radius: ${radius};
${formatVars(light, "  ")}
}

.dark {
${formatVars(dark, "  ")}
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
}

export function ExportDialog() {
  const { light, dark, radius } = useTheme();
  const [copied, setCopied] = useState(false);

  const css = generateGlobalsCss(light, dark, radius);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Export globals.css</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[60vh] text-sm font-mono">
            <code>{css}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
