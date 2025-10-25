export const ServiceMarketplaceSkeleton = () => (
  <div className="flex min-h-screen flex-col gap-6 bg-background px-8 py-10">
    <div className="h-16 w-full animate-pulse rounded-3xl bg-muted/40" />
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="h-80 animate-pulse rounded-3xl bg-muted/40" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`service-skeleton-${index.toString()}`}
            className="h-48 animate-pulse rounded-3xl bg-muted/40"
          />
        ))}
      </div>
    </div>
  </div>
);

