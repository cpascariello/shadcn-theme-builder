import type { ThemeConfig } from "@/lib/theme-types";

const AGGREGATE_KEY = "shadcn-theme-builder-themes";
const CHANNEL = "shadcn-theme-builder";

interface AggregateContent {
  themes: ThemeConfig[];
}

export async function fetchThemesFromAleph(
  address: string,
): Promise<ThemeConfig[] | null> {
  const { AlephHttpClient } = await import("@aleph-sdk/client");
  const client = new AlephHttpClient();
  try {
    const data = await client.fetchAggregate<AggregateContent>(
      address,
      AGGREGATE_KEY,
    );
    if (!data) return null;
    const record = data as unknown as Record<string, unknown>;
    // Collect from all sources, dedup by name (themes array wins over per-key)
    const map = new Map<string, ThemeConfig>();
    // Per-key entries (intermediate format) — add first so themes array overwrites
    for (const [key, value] of Object.entries(record)) {
      if (key === "themes") continue;
      if (value && typeof value === "object" && "name" in value) {
        const t = value as ThemeConfig;
        map.set(t.name, t);
      }
    }
    // themes array (primary format) — overwrites per-key on conflict
    if (Array.isArray(record.themes)) {
      for (const t of record.themes as ThemeConfig[]) {
        map.set(t.name, t);
      }
    }
    return map.size > 0 ? Array.from(map.values()) : null;
  } catch {
    // No aggregate found for this address
    return null;
  }
}

type ChainNamespace = "eip155" | "solana";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAlephClient(chainNamespace: ChainNamespace, provider: any) {
  const { AuthenticatedAlephHttpClient } = await import("@aleph-sdk/client");

  let account;

  if (chainNamespace === "eip155") {
    const ethers = await import("ethers5");
    const { getAccountFromProvider } = await import("@aleph-sdk/ethereum");
    const web3Provider = new ethers.providers.Web3Provider(provider);
    account = await getAccountFromProvider(web3Provider);
  } else {
    const { getAccountFromProvider } = await import("@aleph-sdk/solana");
    const solanaProvider = {
      publicKey: provider.publicKey,
      connected: true,
      connect: async () => {},
      signMessage: async (message: Uint8Array) => {
        return provider.signMessage(message);
      },
    };
    account = await getAccountFromProvider(solanaProvider);
  }

  return new AuthenticatedAlephHttpClient(account);
}

async function pushAggregate(
  themes: ThemeConfig[],
  chainNamespace: ChainNamespace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any,
) {
  const client = await getAlephClient(chainNamespace, provider);
  await client.createAggregate({
    key: AGGREGATE_KEY,
    content: { themes } satisfies AggregateContent,
    channel: CHANNEL,
  });
}

export async function pushThemesToAleph(
  themes: ThemeConfig[],
  address: string,
  chainNamespace: ChainNamespace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any,
): Promise<void> {
  await pushAggregate(themes, chainNamespace, provider);
}

export async function deleteThemeFromAleph(
  themeName: string,
  address: string,
  chainNamespace: ChainNamespace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any,
): Promise<ThemeConfig[]> {
  // Fetch current snapshot, remove the theme, push the full new snapshot
  const current = await fetchThemesFromAleph(address) ?? [];
  const next = current.filter((t) => t.name !== themeName);
  await pushAggregate(next, chainNamespace, provider);
  return next;
}
