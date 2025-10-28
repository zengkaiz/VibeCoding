"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MyNFTABI, NFT_CONTRACT_ADDRESS } from "@/contracts/MyNFT";

export function NFTMint() {
  const { address, isConnected } = useAccount();
  const [tokenURI, setTokenURI] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 读取铸造价格
  const { data: mintPrice } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: MyNFTABI,
    functionName: "mintPrice",
  });

  // 读取总供应量
  const { data: totalSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: MyNFTABI,
    functionName: "totalSupply",
  });

  // 读取最大供应量
  const { data: maxSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: MyNFTABI,
    functionName: "maxSupply",
  });

  // 写入合约（铸造）
  const { writeContract, data: hash, error } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    if (!address || !tokenURI) return;

    try {
      setIsLoading(true);
      writeContract({
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: MyNFTABI,
        functionName: "mint",
        args: [address, tokenURI],
        value: mintPrice as bigint,
      });
    } catch (err) {
      console.error("Mint error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please connect your wallet to mint NFTs
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mint Your NFT
        </h2>
        <p className="text-gray-600">Create your unique digital collectible</p>
      </div>

      {/* 合约信息 */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-sm text-gray-500">Mint Price</p>
          <p className="text-lg font-bold text-purple-600">
            {mintPrice ? formatEther(mintPrice) : "..."} ETH
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Minted</p>
          <p className="text-lg font-bold text-blue-600">
            {totalSupply?.toString() || "0"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Max Supply</p>
          <p className="text-lg font-bold text-gray-600">
            {maxSupply?.toString() === "0" ? "Unlimited" : maxSupply?.toString() || "..."}
          </p>
        </div>
      </div>

      {/* 铸造表单 */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token URI (Metadata URL)
          </label>
          <input
            type="text"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            placeholder="ipfs://... or https://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter the URI pointing to your NFT metadata (JSON file)
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={!tokenURI || isLoading || isConfirming}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isConfirming
            ? "Confirming..."
            : isLoading
            ? "Processing..."
            : `Mint NFT for ${mintPrice ? formatEther(mintPrice) : "..."} ETH`}
        </button>

        {/* 交易状态 */}
        {hash && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">Transaction Hash:</p>
            <p className="text-xs text-blue-600 break-all font-mono">{hash}</p>
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">
              NFT minted successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
