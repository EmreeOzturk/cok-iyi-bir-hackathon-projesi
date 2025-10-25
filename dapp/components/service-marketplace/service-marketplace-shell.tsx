import { ServiceSearchPanel } from "@/components/service-marketplace/service-search-panel";
import { ServiceGrid } from "@/components/service-marketplace/service-grid";
import { MarketplaceHeader } from "@/components/service-marketplace/marketplace-header";

export const ServiceMarketplaceShell = () => (
  <div className="flex min-h-screen flex-col gap-8 bg-background px-8 py-10">
    <MarketplaceHeader />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <ServiceSearchPanel />
      <ServiceGrid />
    </div>
  </div>
);

