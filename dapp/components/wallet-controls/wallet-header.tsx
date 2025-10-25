import { SparklesIcon } from "@heroicons/react/24/outline";

export const WalletHeader = () => (
  <header className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-foreground/10 p-3 text-foreground">
        <SparklesIcon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Mastra Agent Wallet
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Transaction Guard & Budget Ops
        </h1>
      </div>
    </div>
    <p className="max-w-2xl text-sm text-muted-foreground">
      PTB öncesi harcama limitleri, çoklu imza hazırlıkları ve AccessNFT tüketimini tek panelden yönetin.
    </p>
  </header>
);

