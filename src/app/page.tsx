"use client";

import { useTheme } from "@/context/theme-context";
import { ThemeColors, FontConfig, ShadowConfig } from "@/lib/theme-types";
import { getFontStack } from "@/lib/fonts";
import { buildShadowValue } from "@/lib/shadow-presets";
import { TopBar } from "@/components/top-bar";
import { ColorEditor } from "@/components/color-editor";
import { DashboardPreview } from "@/components/preview/dashboard-preview";

function buildCssVariables(
  colors: ThemeColors,
  radius: string,
  fonts: FontConfig,
  shadow: ShadowConfig
): React.CSSProperties {
  const vars: Record<string, string> = {
    "--radius": radius,
    "--font-sans": getFontStack(fonts.sans, "sans"),
    "--font-serif": getFontStack(fonts.serif, "serif"),
    "--font-mono": getFontStack(fonts.mono, "mono"),
  };

  for (const [key, value] of Object.entries(colors)) {
    vars[`--${key}`] = value;
  }

  return vars as React.CSSProperties;
}

function buildGlobalCssOverride(
  colors: ThemeColors,
  radius: string,
  fonts: FontConfig,
): string {
  let css = ":root {\n";
  css += `  --radius: ${radius};\n`;
  css += `  --font-sans: ${getFontStack(fonts.sans, "sans")};\n`;
  css += `  --font-serif: ${getFontStack(fonts.serif, "serif")};\n`;
  css += `  --font-mono: ${getFontStack(fonts.mono, "mono")};\n`;
  for (const [key, value] of Object.entries(colors)) {
    css += `  --${key}: ${value};\n`;
  }
  css += "}";
  return css;
}

export default function Home() {
  const { previewMode, light, dark, radius, fonts, shadow } = useTheme();
  const colors = previewMode === "light" ? light : dark;
  const cssVars = buildCssVariables(colors, radius, fonts, shadow);
  const shadowValue = buildShadowValue(shadow);

  return (
    <div
      className={`flex flex-col h-screen ${previewMode === "dark" ? "dark" : ""}`}
      style={{
        ...cssVars,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Apply theme variables to :root so portaled content (dropdowns, dialogs) inherits them */}
      <style>{buildGlobalCssOverride(colors, radius, fonts)}</style>
      {/* Global shadow override */}
      <style>{`
        .themed-shadow {
          box-shadow: ${shadowValue} !important;
        }
      `}</style>

      {/* Fixed header */}
      <div className="flex-shrink-0">
        <TopBar />
      </div>

      {/* Main content - two independently scrollable panes */}
      <div className="flex flex-1 min-h-0">
        <ColorEditor />
        <DashboardPreview shadowValue={shadowValue} />
      </div>
    </div>
  );
}
