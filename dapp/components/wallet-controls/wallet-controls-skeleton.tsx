export const WalletControlsSkeleton = () => (
  <div className="flex min-h-screen flex-col gap-6 bg-background px-8 py-10">
    <div className="h-20 w-full animate-pulse rounded-3xl bg-muted/40" />
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[400px_minmax(0,1fr)]">
      <div className="h-96 animate-pulse rounded-3xl bg-muted/40" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl bg-muted/40" />
        <div className="h-72 animate-pulse rounded-3xl bg-muted/40" />
      </div>
    </div>
  </div>
);

