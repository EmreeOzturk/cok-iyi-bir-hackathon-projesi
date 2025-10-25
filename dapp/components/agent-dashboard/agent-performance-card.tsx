import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AgentPerformanceCard = () => {
  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Execution Velocity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Son 7 günde ajanın tamamladığı PTB işlemlerinin günlük dağılımı.
          </p>
        </div>
        <Badge variant="success">+18% WoW</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              Toplam PTB: <span className="text-foreground">142</span>
            </p>
            <p>
              Başarılı PTB: <span className="text-foreground">138</span>
            </p>
            <p>
              Ortalama gaz maliyeti: <span className="text-foreground">0.18 SUI</span>
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-foreground/10 px-4 py-3 text-foreground">
            <ArrowTrendingUpIcon className="h-10 w-10" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em]">SLA</p>
              <p className="text-2xl font-semibold">99.2%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

