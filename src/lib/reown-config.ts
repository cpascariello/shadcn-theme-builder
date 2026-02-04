import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { mainnet, solana } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, solana];

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
});

const solanaAdapter = new SolanaAdapter();

const metadata = {
  name: "ShadCN Theme Builder",
  description: "Build and export custom shadcn/ui themes",
  url: typeof window !== "undefined" ? window.location.origin : "https://localhost:3000",
  icons: [],
};

export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
  },
});
