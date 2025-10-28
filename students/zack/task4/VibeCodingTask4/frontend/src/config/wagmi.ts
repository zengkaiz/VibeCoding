"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId: "YOUR_PROJECT_ID", // 从 WalletConnect Cloud 获取
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
  ssr: true,
});
