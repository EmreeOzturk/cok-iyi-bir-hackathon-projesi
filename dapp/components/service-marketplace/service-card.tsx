import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  service: {
    name: string;
    description: string;
    price: string;
    tier: string;
    reputation: number;
  };
};

export const ServiceCard = ({ service }: ServiceCardProps) => (
  <Card className="flex h-full flex-col justify-between">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">
          {service.name}
        </CardTitle>
        <Badge variant="outline" className="capitalize">
          {service.tier}
        </Badge>
      </div>
      <CardDescription>{service.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
      <p>
        Reputation Score:
        <span className="ml-2 rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground">
          {service.reputation.toFixed(1)} / 5
        </span>
      </p>
      <p>
        Mastra orchestrator bu ajanı AccessNFT credential’larıyla otomatik doğrular.
      </p>
    </CardContent>
    <CardFooter className="flex items-center justify-between">
      <span className="font-semibold text-foreground">{service.price} / credit</span>
      <Button variant="primary">Mint AccessNFT</Button>
    </CardFooter>
  </Card>
);

