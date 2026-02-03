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
import { ThemeColors, FontConfig, ShadowConfig } from "@/lib/theme-types";
import { buildShadowTiers } from "@/lib/shadow-presets";
import { getFontStack } from "@/lib/fonts";
import { Copy, Check, Download } from "lucide-react";

function generateGlobalsCss(
  light: ThemeColors,
  dark: ThemeColors,
  radius: string,
  spacing: string,
  letterSpacing: string,
  fonts: FontConfig,
  shadow: ShadowConfig,
): string {
  const formatColorVars = (colors: ThemeColors, indent: string) => {
    return Object.entries(colors)
      .map(([key, value]) => `${indent}--${key}: ${value};`)
      .join("\n");
  };

  const formatShadowVars = (s: ShadowConfig, mode: "light" | "dark", indent: string) => {
    const color = mode === "light" ? s.lightColor : s.darkColor;
    const tiers = buildShadowTiers(s, mode);

    const lines = [
      `${indent}--shadow-x: ${s.offsetX}px;`,
      `${indent}--shadow-y: ${s.offsetY}px;`,
      `${indent}--shadow-blur: ${s.blur}px;`,
      `${indent}--shadow-spread: ${s.spread}px;`,
      `${indent}--shadow-opacity: ${s.opacity.toFixed(1)};`,
      `${indent}--shadow-color: ${color};`,
      `${indent}--tracking-normal: ${letterSpacing};`,
      ...Object.entries(tiers).map(([key, value]) => `${indent}${key}: ${value};`),
    ];

    return lines.join("\n");
  };

  const sansFontStack = getFontStack(fonts.sans, "sans");
  const serifFontStack = getFontStack(fonts.serif, "serif");
  const monoFontStack = getFontStack(fonts.mono, "mono");

  const formatSharedVars = (indent: string) => [
    `${indent}--radius: ${radius};`,
    `${indent}--spacing: ${spacing};`,
    `${indent}--letter-spacing: ${letterSpacing};`,
    `${indent}--font-sans: ${sansFontStack};`,
    `${indent}--font-mono: ${monoFontStack};`,
    `${indent}--font-serif: ${serifFontStack};`,
  ].join("\n");

  return `:root {
${formatColorVars(light, "  ")}
${formatSharedVars("  ")}
${formatShadowVars(shadow, "light", "  ")}
}

.dark {
${formatColorVars(dark, "  ")}
${formatSharedVars("  ")}
${formatShadowVars(shadow, "dark", "  ")}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
`;
}

export function ExportDialog() {
  const { light, dark, radius, spacing, letterSpacing, fonts, shadow } = useTheme();
  const [copied, setCopied] = useState(false);

  const css = generateGlobalsCss(light, dark, radius, spacing, letterSpacing, fonts, shadow);

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
      <DialogContent className="sm:max-w-3xl max-h-[80vh]">
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
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[60vh] text-sm font-mono whitespace-pre-wrap break-all">
            <code>{css}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
