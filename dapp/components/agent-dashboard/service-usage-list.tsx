import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SERVICE_USAGE = [
  {
    name: "flight-orchestrator",
    credits: 42,
    tier: "premium",
    serviceId: "0x8a...d4f2",
  },
  {
    name: "research-insight",
    credits: 27,
    tier: "standard",
    serviceId: "0x55...f9ac",
  },
  {
    name: "event-curator",
    credits: 14,
    tier: "trial",
    serviceId: "0xaa...18c1",
  },
];

export const ServiceUsageList = () => (
  <Card className="col-span-1 xl:col-span-2">
    <CardHeader>
      <CardTitle>AccessNFT Utilisation</CardTitle>
      <p className="text-sm text-muted-foreground">
        Ajansız kullanım senaryosunda hangi L2 ajanların kiralandığını takip edin.
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      {SERVICE_USAGE.map((service) => (
        <div
          key={service.name}
          className="flex items-center justify-between rounded-2xl border border-border/50 px-5 py-4"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {service.name}
            </p>
            <p className="text-xs text-muted-foreground">{service.serviceId}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Tier: {service.tier}</Badge>
            <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
              {service.credits} credits
            </span>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

