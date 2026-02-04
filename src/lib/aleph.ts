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
    return data?.themes ?? null;
  } catch {
    // No aggregate found for this address
    return null;
  }
}

export async function pushThemesToAleph(
  themes: ThemeConfig[],
  address: string,
  chainNamespace: "eip155" | "solana",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any,
): Promise<void> {
  const { AuthenticatedAlephHttpClient } = await import("@aleph-sdk/client");

  let account;

  if (chainNamespace === "eip155") {
    const ethers = await import("ethers5");
    const { getAccountFromProvider } = await import("@aleph-sdk/ethereum");
    const web3Provider = new ethers.providers.Web3Provider(provider);
    account = await getAccountFromProvider(web3Provider);
  } else {
    const { getAccountFromProvider } = await import("@aleph-sdk/solana");
    // Reown's Solana provider needs wrapping for Aleph SDK's MessageSigner
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

  const client = new AuthenticatedAlephHttpClient(account);
  await client.createAggregate({
    key: AGGREGATE_KEY,
    content: { themes } satisfies AggregateContent,
    channel: CHANNEL,
  });
}
