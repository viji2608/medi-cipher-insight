import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { PerformanceMetric } from "@/types/medical";
import { format } from "date-fns";

interface LatencyChartProps {
  metrics: PerformanceMetric[];
}

export function LatencyChart({ metrics }: LatencyChartProps) {
  const chartData = metrics.map((m, i) => ({
    time: format(m.timestamp, 'HH:mm:ss'),
    latency: m.queryLatency,
    overhead: m.encryptionOverhead,
    index: i,
  }));

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-medical-accent" />
          Query Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pr-4 pb-4">
        {chartData.length < 2 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p className="text-xs">Make queries to see performance data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--medical-primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--medical-primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="overheadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--medical-accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--medical-accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                width={35}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="hsl(var(--medical-primary))"
                fill="url(#latencyGradient)"
                strokeWidth={2}
                name="Query Latency"
              />
              <Area
                type="monotone"
                dataKey="overhead"
                stroke="hsl(var(--medical-accent))"
                fill="url(#overheadGradient)"
                strokeWidth={2}
                name="Encryption Overhead"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
