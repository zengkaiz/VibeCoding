"use client";

import { NFTMint } from "@/components/NFTMint";
import { NFTGallery } from "@/components/NFTGallery";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
              <p className="text-sm text-gray-600">Create and collect unique digital assets</p>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Mint Section */}
          <section>
            <NFTMint />
          </section>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 px-6 text-sm font-medium text-gray-500">
                Your Collection
              </span>
            </div>
          </div>

          {/* Gallery Section */}
          <section>
            <NFTGallery />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by{" "}
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Web3
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
