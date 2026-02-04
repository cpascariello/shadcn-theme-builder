"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { fetchThemesFromAleph, pushThemesToAleph } from "@/lib/aleph";
import type { ThemeConfig } from "@/lib/theme-types";

type ChainNamespace = "eip155" | "solana";

function detectChain(caipAddress: string | undefined): ChainNamespace | null {
  if (!caipAddress) return null;
  if (caipAddress.startsWith("eip155:")) return "eip155";
  if (caipAddress.startsWith("solana:")) return "solana";
  return null;
}

export function useAlephSync() {
  const { address, isConnected, caipAddress } = useAppKitAccount();
  const chain = detectChain(caipAddress);

  const { walletProvider: eip155Provider } = useAppKitProvider("eip155");
  const { walletProvider: solanaProvider } = useAppKitProvider("solana");

  const [remoteThemes, setRemoteThemes] = useState<ThemeConfig[] | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const lastPulledAddress = useRef<string | null>(null);

  const pullFromAleph = useCallback(async (): Promise<ThemeConfig[] | null> => {
    if (!address) return null;
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      const themes = await fetchThemesFromAleph(address);
      setRemoteThemes(themes);
      return themes;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch themes";
      setLastSyncError(msg);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [address]);

  const pushToAleph = useCallback(
    async (themes: ThemeConfig[]): Promise<void> => {
      if (!address || !chain) {
        throw new Error("Wallet not connected");
      }
      const provider = chain === "eip155" ? eip155Provider : solanaProvider;
      if (!provider) {
        throw new Error("No wallet provider available");
      }
      setIsSyncing(true);
      setLastSyncError(null);
      try {
        await pushThemesToAleph(themes, address, chain, provider);
        setRemoteThemes(themes);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to push themes";
        setLastSyncError(msg);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [address, chain, eip155Provider, solanaProvider],
  );

  // Auto-pull on wallet connect
  useEffect(() => {
    if (isConnected && address && address !== lastPulledAddress.current) {
      lastPulledAddress.current = address;
      pullFromAleph();
    }
    if (!isConnected) {
      lastPulledAddress.current = null;
      setRemoteThemes(null);
      setLastSyncError(null);
    }
  }, [isConnected, address, pullFromAleph]);

  return {
    isConnected,
    address,
    isSyncing,
    lastSyncError,
    remoteThemes,
    pushToAleph,
    pullFromAleph,
  };
}
