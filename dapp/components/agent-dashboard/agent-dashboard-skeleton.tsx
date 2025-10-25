export const AgentDashboardSkeleton = () => (
  <div className="flex min-h-screen flex-col gap-6 bg-background px-8 py-10">
    <div className="h-20 w-full animate-pulse rounded-3xl bg-muted/40" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`dashboard-skeleton-${index.toString()}`}
          className="h-60 animate-pulse rounded-3xl bg-muted/40"
        />
      ))}
    </div>
  </div>
);

