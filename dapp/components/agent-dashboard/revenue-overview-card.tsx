import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REVENUE_SEGMENTS = [
  {
    label: "AccessNFT satışları",
    value: "12.4k USDC",
    trend: "+24%",
  },
  {
    label: "Abonelik gelirleri",
    value: "3.6k USDC",
    trend: "+12%",
  },
  {
    label: "Mastra aracılık",
    value: "1.1k USDC",
    trend: "+8%",
  },
];

export const RevenueOverviewCard = () => (
  <Card className="col-span-1">
    <CardHeader>
      <CardTitle>Revenue Orbits</CardTitle>
      <p className="text-sm text-muted-foreground">
        Son 30 günde ajanın kaynaklara göre gelir dağılımı.
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      {REVENUE_SEGMENTS.map((segment) => (
        <div
          key={segment.label}
          className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/40 px-4 py-3"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {segment.label}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {segment.value}
            </p>
          </div>
          <span className="text-sm font-medium text-emerald-500">
            {segment.trend}
          </span>
        </div>
      ))}
    </CardContent>
  </Card>
);

