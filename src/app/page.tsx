"use client";

import { TopBar } from "@/components/top-bar";
import { ColorEditor } from "@/components/color-editor";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ColorEditor />
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-muted-foreground">Preview will go here</p>
        </div>
      </div>
    </div>
  );
}
