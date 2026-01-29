"use client";

import { useTheme } from "@/context/theme-context";
import { ThemeColors, FontConfig, ShadowConfig } from "@/lib/theme-types";
import { getFontStack } from "@/lib/fonts";
import { buildShadowValue } from "@/lib/shadow-presets";
import { StatCards } from "./stat-cards";
import { ChartCard } from "./chart-card";
import { RecentSales } from "./recent-sales";
import { DataTableCard } from "./data-table-card";
import { ComponentShowcase } from "./component-showcase";

function buildCssVariables(
  colors: ThemeColors,
  radius: string,
  fonts: FontConfig,
  shadow: ShadowConfig
): React.CSSProperties {
  const shadowValue = buildShadowValue(shadow);

  const vars: Record<string, string> = {
    "--radius": radius,
    "--font-sans": getFontStack(fonts.sans, "sans"),
    "--font-serif": getFontStack(fonts.serif, "serif"),
    "--font-mono": getFontStack(fonts.mono, "mono"),
    "--shadow": shadowValue,
    "--shadow-sm": shadowValue,
    "--shadow-md": shadowValue,
    "--shadow-lg": shadowValue,
  };

  for (const [key, value] of Object.entries(colors)) {
    vars[`--${key}`] = value;
  }

  return vars as React.CSSProperties;
}

export function DashboardPreview() {
  const { previewMode, light, dark, radius, fonts, shadow } = useTheme();
  const colors = previewMode === "light" ? light : dark;
  const cssVars = buildCssVariables(colors, radius, fonts, shadow);

  return (
    <div
      className={`flex-1 overflow-y-auto ${previewMode === "dark" ? "dark" : ""}`}
      style={{
        ...cssVars,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <ChartCard />
          </div>
          <div className="lg:col-span-3">
            <RecentSales />
          </div>
        </div>
        <DataTableCard />
        <ComponentShowcase />
      </div>
    </div>
  );
}
