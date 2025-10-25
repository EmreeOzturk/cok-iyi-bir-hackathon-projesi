import { Suspense } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ServiceMarketplaceShell } from "@/components/service-marketplace/service-marketplace-shell";
import { ServiceMarketplaceSkeleton } from "@/components/service-marketplace/service-marketplace-skeleton";

export default function ServiceMarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <GlobeAltIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Agent Service Registry
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground mt-1">
                  Discover & Access AI Agents
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
              Explore our curated marketplace of AI agents powered by the SuiPay protocol. Find specialized services, 
              compare reputation scores, and purchase AccessNFTs for instant service access through secure blockchain transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <Suspense fallback={<ServiceMarketplaceSkeleton />}>
          <ServiceMarketplaceShell />
        </Suspense>
      </div>
    </div>
  );
}

