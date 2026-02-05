"use client";

import { ColorEditorContent } from "./color-editor-content";

export function ColorEditor() {
  return (
    <div className="w-96 flex-shrink-0 border-r hidden md:flex flex-col overflow-hidden bg-background">
      <ColorEditorContent />
    </div>
  );
}
