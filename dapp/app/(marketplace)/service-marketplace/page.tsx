import { Suspense } from "react";

import { ServiceMarketplaceShell } from "@/components/service-marketplace/service-marketplace-shell";
import { ServiceMarketplaceSkeleton } from "@/components/service-marketplace/service-marketplace-skeleton";

export default function ServiceMarketplacePage() {
  return (
    <Suspense fallback={<ServiceMarketplaceSkeleton />}>
      <ServiceMarketplaceShell />
    </Suspense>
  );
}

