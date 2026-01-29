"use client";

import { StatCards } from "./stat-cards";
import { ChartCard } from "./chart-card";
import { RecentSales } from "./recent-sales";
import { DataTableCard } from "./data-table-card";
import { ComponentShowcase } from "./component-showcase";

interface DashboardPreviewProps {
  shadowValue: string;
}

export function DashboardPreview({ shadowValue }: DashboardPreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Override shadow classes within preview scope */}
      <style>{`
        .preview-scope [class*="shadow"] {
          box-shadow: ${shadowValue} !important;
        }
        .preview-scope .shadow-none {
          box-shadow: none !important;
        }
      `}</style>
      <div className="preview-scope p-6 max-w-5xl mx-auto space-y-6">
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
