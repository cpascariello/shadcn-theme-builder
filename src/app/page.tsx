"use client";

import { TopBar } from "@/components/top-bar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="p-4">Color editor will go here</div>
        <div className="flex-1 p-4">Preview will go here</div>
      </div>
    </div>
  );
}
