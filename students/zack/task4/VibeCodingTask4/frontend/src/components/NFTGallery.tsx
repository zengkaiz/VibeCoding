"use client";

import { useAccount, useReadContract } from "wagmi";
import { MyNFTABI, NFT_CONTRACT_ADDRESS } from "@/contracts/MyNFT";
import { useEffect, useState } from "react";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
}

export function NFTGallery() {
  const { address, isConnected } = useAccount();
  const [nftMetadata, setNftMetadata] = useState<Record<string, NFTMetadata>>({});

  // 获取用户拥有的NFT ID列表
  const { data: tokenIds, isLoading: isLoadingTokens } = useReadContract({
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: MyNFTABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
  }) as { data: readonly bigint[] | undefined; isLoading: boolean };

  // 获取NFT元数据
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenIds || tokenIds.length === 0) return;

      for (const tokenId of tokenIds) {
        try {
          // 这里我们需要先获取tokenURI
          // 由于useReadContract只能在组件顶层使用，我们使用fetch来获取
          const response = await fetch("/api/nft-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokenId: tokenId.toString() }),
          });

          if (response.ok) {
            const metadata = await response.json();
            setNftMetadata((prev) => ({
              ...prev,
              [tokenId.toString()]: metadata,
            }));
          }
        } catch (error) {
          console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
        }
      }
    };

    fetchMetadata();
  }, [tokenIds]);

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl">
        <p className="text-gray-600">Connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (isLoadingTokens) {
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Loading your NFTs...</p>
      </div>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No NFTs Yet</h3>
        <p className="text-gray-600">You don't own any NFTs from this collection yet.</p>
        <p className="text-gray-600 mt-1">Mint your first NFT to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Your NFT Collection ({tokenIds.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokenIds.map((tokenId) => {
          const metadata = nftMetadata[tokenId.toString()];
          return (
            <div
              key={tokenId.toString()}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                {metadata?.image ? (
                  <img
                    src={metadata.image}
                    alt={metadata.name || `NFT #${tokenId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <svg
                      className="mx-auto h-20 w-20 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">No preview</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg text-gray-800 mb-1">
                  {metadata?.name || `NFT #${tokenId}`}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Token ID: {tokenId.toString()}
                </p>
                {metadata?.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {metadata.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
