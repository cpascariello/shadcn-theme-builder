"use client";

import { TopBar } from "@/components/top-bar";
import { ColorEditor } from "@/components/color-editor";
import { DashboardPreview } from "@/components/preview/dashboard-preview";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ColorEditor />
        <DashboardPreview />
      </div>
    </div>
  );
}
