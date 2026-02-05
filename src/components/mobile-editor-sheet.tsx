"use client";

import { useState } from "react";
import { Paintbrush } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ColorEditorContent } from "./color-editor-content";

export function MobileEditorSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* Persistent bottom bar — always visible on mobile */}
      <DrawerTrigger asChild>
        <button className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-3 bg-background border-t md:hidden">
          <Paintbrush className="size-4" />
          <span className="text-sm font-medium">Edit Theme</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="!max-h-[50vh] md:hidden" showOverlay={false}>
        <DrawerHeader className="py-2">
          <DrawerTitle className="text-sm">Edit Theme</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-hidden flex-1">
          <ColorEditorContent defaultCollapsed />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
