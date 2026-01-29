export const FONT_OPTIONS = {
  sans: [
    { name: "Inter", value: "Inter" },
    { name: "Poppins", value: "Poppins" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Nunito", value: "Nunito" },
    { name: "Work Sans", value: "Work Sans" },
    { name: "DM Sans", value: "DM Sans" },
  ],
  serif: [
    { name: "Lora", value: "Lora" },
    { name: "Merriweather", value: "Merriweather" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Source Serif Pro", value: "Source Serif 4" },
    { name: "Crimson Text", value: "Crimson Text" },
    { name: "Libre Baskerville", value: "Libre Baskerville" },
  ],
  mono: [
    { name: "JetBrains Mono", value: "JetBrains Mono" },
    { name: "Fira Code", value: "Fira Code" },
    { name: "Source Code Pro", value: "Source Code Pro" },
    { name: "IBM Plex Mono", value: "IBM Plex Mono" },
    { name: "Roboto Mono", value: "Roboto Mono" },
  ],
} as const;

export type FontCategory = keyof typeof FONT_OPTIONS;

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): void {
  if (loadedFonts.has(fontName) || typeof document === "undefined") return;

  const linkId = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontName);
    return;
  }

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontName);
}

export function getFontStack(fontName: string, category: FontCategory): string {
  const fallbacks = {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  };
  return `"${fontName}", ${fallbacks[category]}`;
}
