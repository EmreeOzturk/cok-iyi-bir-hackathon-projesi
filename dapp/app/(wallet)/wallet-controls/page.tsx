import { Suspense } from "react";

import { WalletControlsShell } from "@/components/wallet-controls/wallet-controls-shell";
import { WalletControlsSkeleton } from "@/components/wallet-controls/wallet-controls-skeleton";

export default function WalletControlsPage() {
  return (
    <Suspense fallback={<WalletControlsSkeleton />}>
      <WalletControlsShell />
    </Suspense>
  );
}

