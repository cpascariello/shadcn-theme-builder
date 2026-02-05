"use client";

import { useState, useMemo } from "react";
import { Save, CloudUpload, Loader2, Wallet, Menu, Download } from "lucide-react";
import { appKit } from "@/lib/reown-config";
import { useTheme } from "@/context/theme-context";
import { useSavedThemes } from "@/hooks/use-saved-themes";
import { useAlephSync } from "@/hooks/use-aleph-sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportDialog } from "@/components/export-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppBar() {
  const { loadThemeConfig, getThemeConfig } = useTheme();
  const { savedThemes, save, clear, exists } = useSavedThemes();
  const { isConnected, address, remoteThemes, pushToAleph } = useAlephSync();
  const [pushing, setPushing] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // True when local themes differ from what's on the cloud
  const hasUnpushedChanges = useMemo(() => {
    if (savedThemes.length === 0) return false;
    if (!remoteThemes) return true; // never pushed
    if (savedThemes.length !== remoteThemes.length) return true;
    return savedThemes.some(
      (local) => !remoteThemes.some((remote) => remote.name === local.name),
    );
  }, [savedThemes, remoteThemes]);

  const handlePush = async () => {
    if (savedThemes.length === 0) return;
    setPushing(true);
    try {
      await pushToAleph(savedThemes);
      clear();
    } catch {
      // error is surfaced via lastSyncError in the hook
    } finally {
      setPushing(false);
    }
  };

  const handleSave = () => {
    const trimmed = saveName.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (exists(slug) && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    const config = getThemeConfig(slug, trimmed);
    save(config);
    loadThemeConfig(config);
    setSaveName("");
    setConfirmOverwrite(false);
    setSaveOpen(false);
  };

  const handleSaveOpenChange = (open: boolean) => {
    setSaveOpen(open);
    if (!open) {
      setSaveName("");
      setConfirmOverwrite(false);
    }
  };

  // Shared save form content (used in both Popover for desktop and Dialog for mobile)
  const saveFormContent = (
    <div className="space-y-2">
      <label className="text-sm font-medium">Theme name</label>
      <Input
        placeholder="My Theme"
        value={saveName}
        onChange={(e) => {
          setSaveName(e.target.value);
          setConfirmOverwrite(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
        }}
        autoFocus
      />
      {confirmOverwrite && (
        <p className="text-xs text-destructive">
          A theme with this name already exists. Click Save again to replace it.
        </p>
      )}
      <Button size="sm" className="w-full" onClick={handleSave} disabled={!saveName.trim()}>
        {confirmOverwrite ? "Replace" : "Save"}
      </Button>
    </div>
  );

  return (
    <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
      {/* Desktop: Title */}
      <span className="font-semibold hidden md:inline">ShadCN Theme Builder</span>

      {/* Mobile: Hamburger menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>ShadCN Theme Builder</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSaveOpen(true)}>
            <Save className="size-4 mr-2" />
            Save Theme
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handlePush}
            disabled={!isConnected || !hasUnpushedChanges || pushing}
          >
            <CloudUpload className="size-4 mr-2" />
            Push to Cloud
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setExportOpen(true)}>
            <Download className="size-4 mr-2" />
            Export CSS
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => appKit.open()}>
            <Wallet className="size-4 mr-2" />
            {isConnected && address
              ? `${address.slice(0, 6)}…${address.slice(-4)}`
              : "Connect Wallet"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile: Save dialog (triggered from hamburger menu) */}
      <Dialog open={saveOpen} onOpenChange={handleSaveOpenChange}>
        <DialogContent className="w-80 md:hidden">
          <DialogHeader>
            <DialogTitle>Save Theme</DialogTitle>
          </DialogHeader>
          {saveFormContent}
        </DialogContent>
      </Dialog>

      {/* Mobile: Export dialog (triggered from hamburger menu) */}
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

      {/* Desktop: Action buttons */}
      <div className="hidden md:flex items-center gap-2">
        {/* Save theme */}
        <Popover open={saveOpen} onOpenChange={handleSaveOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Save theme">
              <Save className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            {saveFormContent}
          </PopoverContent>
        </Popover>

        {/* Push to Aleph */}
        <span title={!isConnected || !hasUnpushedChanges ? "First save a theme then push to Aleph Cloud" : "Push saved themes to Aleph Cloud"}>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePush}
            disabled={!isConnected || !hasUnpushedChanges || pushing}
          >
            {pushing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CloudUpload className="size-4" />
            )}
          </Button>
        </span>

        <ExportDialog />

        {/* Wallet connect */}
        <Button
          variant="outline"
          size={isConnected ? "default" : "icon"}
          title={isConnected ? address : "Connect wallet"}
          onClick={() => appKit.open()}
        >
          <Wallet className="size-4" />
          {isConnected && address && (
            <span className="text-xs font-mono">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
