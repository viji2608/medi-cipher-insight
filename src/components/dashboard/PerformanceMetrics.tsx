import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Database, Shield } from "lucide-react";
import { PerformanceMetric } from "@/types/medical";

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
  activeQueries: number;
  averageLatency: number;
  averageOverhead: number;
  totalRecordsSearched: number;
}

export function PerformanceMetrics({
  metrics,
  activeQueries,
  averageLatency,
  averageOverhead,
  totalRecordsSearched,
}: PerformanceMetricsProps) {
  const latestMetric = metrics[metrics.length - 1];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-medical-accent" />
            Query Latency
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold text-foreground">
            {latestMetric?.queryLatency || averageLatency || 0}
            <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Avg: {averageLatency}ms
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-medical-success" />
            Encryption Overhead
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold text-foreground">
            {latestMetric?.encryptionOverhead || averageOverhead || 0}
            <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Avg: {averageOverhead}ms
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-medical-warning" />
            Active Queries
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold text-foreground">
            {activeQueries}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Processing now
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-medical-primary" />
            Records Searched
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold text-foreground">
            {totalRecordsSearched}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Encrypted records
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
