"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONT_OPTIONS, FontCategory } from "@/lib/fonts";
import { useTheme } from "@/context/theme-context";

interface FontPickerProps {
  category: FontCategory;
  label: string;
}

export function FontPicker({ category, label }: FontPickerProps) {
  const { fonts, setFont } = useTheme();
  const options = FONT_OPTIONS[category];
  const currentValue = fonts[category];

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select value={currentValue} onValueChange={(v) => setFont(category, v)}>
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((font) => (
            <SelectItem key={font.value} value={font.value} className="text-xs">
              <span style={{ fontFamily: `"${font.value}", sans-serif` }}>
                {font.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
