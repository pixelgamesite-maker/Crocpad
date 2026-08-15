import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  zerionWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defineChain } from "viem";

// Robinhood Chain mainnet, per official docs.
export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
  testnet: false,
});

// Robinhood Chain testnet.
export const robinhoodChainTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.testnet.chain.robinhood.com" },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "CrocPad",
  // Get a free project ID at https://cloud.walletconnect.com
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [robinhoodChain, robinhoodChainTestnet],
  ssr: false,
  wallets: [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, zerionWallet, rainbowWallet, coinbaseWallet, trustWallet, walletConnectWallet],
    },
    {
      // Catches any other injected wallet extension (Rabby, Brave Wallet,
      // etc.) that isn't explicitly listed above.
      groupName: "Other",
      wallets: [injectedWallet],
    },
  ],
});
