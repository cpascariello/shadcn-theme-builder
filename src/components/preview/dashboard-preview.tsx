"use client";

import { useTheme } from "@/context/theme-context";
import { ThemeColors } from "@/lib/theme-types";
import { StatCards } from "./stat-cards";
import { ChartCard } from "./chart-card";
import { RecentSales } from "./recent-sales";
import { DataTableCard } from "./data-table-card";

function buildCssVariables(colors: ThemeColors, radius: string): React.CSSProperties {
  const vars: Record<string, string> = { "--radius": radius };
  for (const [key, value] of Object.entries(colors)) {
    vars[`--${key}`] = value;
  }
  return vars as React.CSSProperties;
}

export function DashboardPreview() {
  const { previewMode, light, dark, radius } = useTheme();
  const colors = previewMode === "light" ? light : dark;
  const cssVars = buildCssVariables(colors, radius);

  return (
    <div
      className={`flex-1 overflow-y-auto ${previewMode === "dark" ? "dark" : ""}`}
      style={{
        ...cssVars,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
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
      </div>
    </div>
  );
}
