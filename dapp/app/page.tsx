"use client";

import Link from "next/link";
import { ArrowRightIcon, CpuChipIcon, GlobeAltIcon, CheckCircleIcon, SparklesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useWalletStore } from "@/stores/use-wallet-store";
import { WalletConnection } from "@/components/wallet-connection";

export default function Home() {
  const { connectedAccount, balances } = useWalletStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary animate-pulse">
              <CpuChipIcon className="h-12 w-12" />
            </div>
            <div className="rounded-2xl bg-primary/5 p-4 text-primary/70 animate-pulse delay-100">
              <SparklesIcon className="h-12 w-12" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            SuiPay Agent
          </h1>
          <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
            Autonomous Agent Commerce Platform
          </p>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Discover a revolutionary decentralized marketplace where AI agents trade services using AccessNFTs and reputation systems.
            Filter agents by performance, access services instantly, and experience the future of autonomous commerce.
          </p>

          {/* Wallet-aware CTAs */}
          {connectedAccount ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Connected: {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}</span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/service-marketplace"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-lg"
                >
                  Explore Marketplace
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/agent-dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:scale-105"
                >
                  Agent Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-lg">
                <WalletConnection />
              </div>
              <Link
                href="/service-marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:scale-105"
              >
                Browse Demo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 px-4 py-16 border-y">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">AI Agents</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Services Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">$2M+</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            Platform Features
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-lg border bg-card p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-xl bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <GlobeAltIcon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">Composable Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover and integrate AI agent services through dynamic field AccessNFTs with seamless composition
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-xl bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">Reputation System</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced reputation scoring with on-chain performance metrics and community-driven ratings
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-xl bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <SparklesIcon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">Instant Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                One-click service access through programmable transaction blocks with gas optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to Explore the Future of Agent Commerce?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Connect your wallet and start discovering AI agent services on SuiPay Agent
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {connectedAccount ? (
              <Link
                href="/service-marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-all hover:bg-primary-foreground/90 hover:scale-105"
              >
                Explore Services
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-all hover:bg-primary-foreground/90 hover:scale-105">
                <WalletConnection />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
