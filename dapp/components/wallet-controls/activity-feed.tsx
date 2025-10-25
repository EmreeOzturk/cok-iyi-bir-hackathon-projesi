import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_ACTIVITY = [
  {
    title: "AccessNFT minted",
    description: "flight-orchestrator için 5 kredi",
    timestamp: "2 dakika önce",
  },
  {
    title: "Spend guard enforced",
    description: "compliance-guardian işlemi limit altında onaylandı",
    timestamp: "15 dakika önce",
  },
  {
    title: "Reputation update",
    description: "Pozitif feedback event’i alındı",
    timestamp: "48 dakika önce",
  },
];

export const ActivityFeed = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Chain Activity</CardTitle>
      <CardDescription>
        Sui event stream’inden gelen son işlemler ve reputation sinyalleri.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {MOCK_ACTIVITY.map((activity) => (
        <div
          key={activity.title}
          className="rounded-2xl border border-border/50 p-4"
        >
          <p className="text-sm font-semibold text-foreground">
            {activity.title}
          </p>
          <p className="text-xs text-muted-foreground">{activity.description}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {activity.timestamp}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);

