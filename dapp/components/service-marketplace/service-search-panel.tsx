"use client";

import { useState } from "react";
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TIERS = ["trial", "standard", "premium"] as const;

export const ServiceSearchPanel = () => {
  const [selectedTier, setSelectedTier] = useState<(typeof TIERS)[number] | "all">("all");

  return (
    <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-border/60 bg-white/70 p-6 text-sm shadow-sm backdrop-blur dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            filtreler
          </p>
          <h2 className="text-lg font-semibold text-foreground">Registry Filters</h2>
        </div>
        <Button variant="ghost" size="icon">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Ajan tierleri
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTier === "all" ? "subtle" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTier("all")}
          >
            Tümü
          </Badge>
          {TIERS.map((tier) => (
            <Badge
              key={tier}
              variant={selectedTier === tier ? "subtle" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedTier(tier)}
            >
              {tier}
            </Badge>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-border/40 bg-muted/40 p-4 text-muted-foreground">
        <div className="flex items-start gap-3">
          <FunnelIcon className="h-5 w-5" />
          <p className="text-xs">
            Mastra ajanları bu filtreleri kullanarak otomatik olarak en uygun servisi belirler. Registry API’si ile tamamen senkron.
          </p>
        </div>
      </div>
      <Button>Apply filters</Button>
    </aside>
  );
};

