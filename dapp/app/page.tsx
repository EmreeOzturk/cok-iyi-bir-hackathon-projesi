"use client";

import Link from "next/link";
import { ArrowRightIcon, WalletIcon, ShieldCheckIcon, ZapIcon, GlobeIcon, BarChart3Icon, LockIcon, SparklesIcon } from "lucide-react";
import { useWalletStore } from "@/stores/use-wallet-store";
import { WalletConnection } from "@/components/wallet-connection";

export default function Home() {
  const { connectedAccount } = useWalletStore();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Enhanced Design */}
      <section className="relative min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left Content - Enhanced */}
            <div className="space-y-12">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
                <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                <span className="text-xs text-amber-400 font-semibold tracking-widest">LIVE ON SUI</span>
              </div>

              {/* Enhanced Typography */}
              <div className="space-y-6">
                <h1 className="text-7xl lg:text-8xl font-black leading-none tracking-tight">
                  SUIPAY
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AGENT</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="h-px w-20 bg-gradient-to-r from-amber-500 to-transparent" />
                  <div className="h-px w-12 bg-amber-500" />
                  <div className="h-px w-20 bg-gradient-to-l from-amber-500 to-transparent" />
                </div>
                <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                  Autonomous agents trading through 
                  <span className="text-amber-500 font-semibold"> AccessNFTs</span> on the 
                  <span className="text-amber-500 font-semibold"> Sui blockchain</span>
                </p>
              </div>

              {/* Enhanced Wallet Status */}
              <div className="flex items-center gap-6">
                {connectedAccount ? (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
                    <span className="text-sm text-green-400 font-mono font-semibold">
                      {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-700 bg-gray-900/50">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <span className="text-sm text-gray-400 font-medium">CONNECT WALLET</span>
                  </div>
                )}
              </div>

              {/* Enhanced Buttons */}
              <div className="flex flex-col gap-4">
                {connectedAccount ? (
                  <>
                    <Link
                      href="/service-marketplace"
                      className="group inline-flex items-center justify-between px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20"
                    >
                      <span>ENTER MARKETPLACE</span>
                      <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/agent-dashboard"
                      className="group inline-flex items-center justify-between px-8 py-5 border border-gray-700 bg-gray-900/50 text-white font-bold rounded-xl"
                    >
                      <span>DASHBOARD</span>
                      <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="group inline-flex items-center justify-between px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20">
                      <WalletIcon className="w-5 h-5" />
                      <WalletConnection />
                    </div>
                    <Link
                      href="/service-marketplace"
                      className="group inline-flex items-center justify-between px-8 py-5 border border-gray-700 bg-gray-900/50 text-white font-bold rounded-xl"
                    >
                      <span>VIEW DEMO</span>
                      <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Content - Enhanced Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 rounded-3xl border border-amber-500/20 p-8 shadow-2xl shadow-amber-500/10">
                <div className="grid grid-cols-2 gap-6 h-full">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border border-amber-500/10 rounded-xl p-6 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-xl mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-amber-500 rounded" />
                      </div>
                      <div className="text-xs text-gray-400 font-medium">AGENT {item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 border-y border-gray-900 bg-gradient-to-b from-transparent to-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { value: "1,200+", label: "ACTIVE AGENTS" },
              { value: "45K+", label: "TRANSACTIONS" },
              { value: "$8.5M+", label: "TOTAL VOLUME" },
              { value: "99.9%", label: "PLATFORM UPTIME" }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="text-4xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-gray-400 tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-8 tracking-tight">HOW IT WORKS</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-amber-500 to-transparent" />
              <div className="h-px w-8 bg-amber-500" />
              <div className="h-px w-16 bg-gradient-to-l from-amber-500 to-transparent" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "CONNECT",
                description: "Link your Sui wallet to access the decentralized marketplace",
                icon: WalletIcon
              },
              {
                step: "02", 
                title: "DISCOVER",
                description: "Browse autonomous agents and their specialized services",
                icon: GlobeIcon
              },
              {
                step: "03",
                title: "TRADE",
                description: "Purchase AccessNFTs for instant service access",
                icon: ZapIcon
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-8">
                <div className="text-6xl font-black text-gray-900 tracking-tight">{item.step}</div>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                  <item.icon className="w-10 h-10 text-amber-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-32 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-8 tracking-tight">PLATFORM FEATURES</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-amber-500 to-transparent" />
              <div className="h-px w-8 bg-amber-500" />
              <div className="h-px w-16 bg-gradient-to-l from-amber-500 to-transparent" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "TRUSTLESS REPUTATION",
                description: "On-chain performance tracking ensures complete reliability and transparency"
              },
              {
                icon: LockIcon,
                title: "ZERO-TRUST SECURITY",
                description: "Advanced smart contract architecture with maximum protection"
              },
              {
                icon: ZapIcon,
                title: "INSTANT EXECUTION",
                description: "Lightning-fast service access with sub-second finality"
              },
              {
                icon: GlobeIcon,
                title: "GLOBAL MARKETPLACE",
                description: "Borderless trading without geographic restrictions"
              },
              {
                icon: BarChart3Icon,
                title: "REAL-TIME ANALYTICS",
                description: "Comprehensive performance metrics and usage statistics"
              },
              {
                icon: SparklesIcon,
                title: "GAS OPTIMIZATION",
                description: "Efficient transaction bundling minimizes costs significantly"
              }
            ].map((feature, index) => (
              <div key={index} className="group border border-gray-800 rounded-2xl p-8 bg-gradient-to-b from-gray-900 to-black hover:border-amber-500/30 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:from-amber-500/20 group-hover:to-amber-500/10 transition-colors">
                  <feature.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-black mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-3xl" />
            <div className="relative border border-gray-800 rounded-3xl p-20 bg-black/50 backdrop-blur-sm">
              <h2 className="text-5xl font-black mb-8 tracking-tight">READY TO START?</h2>
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-16 bg-gradient-to-r from-amber-500 to-transparent" />
                <div className="h-px w-8 bg-amber-500" />
                <div className="h-px w-16 bg-gradient-to-l from-amber-500 to-transparent" />
              </div>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join the decentralized economy of autonomous agents. Connect your wallet and explore the future of service commerce.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {connectedAccount ? (
                  <Link
                    href="/service-marketplace"
                    className="group inline-flex items-center justify-between px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20"
                  >
                    <span>LAUNCH MARKETPLACE</span>
                    <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <div className="group inline-flex items-center justify-between px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20">
                    <WalletIcon className="w-5 h-5" />
                    <WalletConnection />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}