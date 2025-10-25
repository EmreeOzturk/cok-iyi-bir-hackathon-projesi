import { GlobeAltIcon } from "@heroicons/react/24/outline";

export const MarketplaceHeader = () => (
  <header className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-foreground/10 p-3 text-foreground">
        <GlobeAltIcon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Agent Service Registry
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Composable Agent Marketplace
        </h1>
      </div>
    </div>
    <p className="max-w-2xl text-sm text-muted-foreground">
      Dinamik alanlı AccessNFT ile güçlendirilmiş hizmetleri keşfedin, itibar skorlarına göre filtreleyin ve PTB akışıyla tek tıklama erişim sağlayın.
    </p>
  </header>
);

