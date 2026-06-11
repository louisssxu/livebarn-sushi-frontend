"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Clock,
  Flame,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import {
  buildOrdersByHourData,
  buildStatusDistribution,
  buildTimingData,
  buildUtilizationData,
  totalOrderCount,
} from "@/lib/analytics-charts";
import type { Analytics, OrdersByStatus } from "@/lib/types";

const hourlyChartConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig;

const timingChartConfig = {
  seconds: { label: "Seconds", color: "var(--chart-2)" },
} satisfies ChartConfig;

const statusChartConfig = {
  created: { label: "Queued", color: "var(--chart-3)" },
  resumed: { label: "Resumed", color: "var(--chart-4)" },
  "in-progress": { label: "Cooking", color: "var(--chart-1)" },
  paused: { label: "Paused", color: "var(--chart-5)" },
  completed: { label: "Finished", color: "var(--chart-2)" },
  cancelled: { label: "Cancelled", color: "var(--chart-4)" },
} satisfies ChartConfig;

const utilizationChartConfig = {
  busy: { label: "Busy", color: "var(--chart-1)" },
  idle: { label: "Idle", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface AnalyticsSectionProps {
  data: Analytics | null;
  orders: OrdersByStatus;
  loading: boolean;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed bg-muted/20">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function AnalyticsSection({
  data,
  orders,
  loading,
}: AnalyticsSectionProps) {
  const hourlyData = useMemo(
    () => (data ? buildOrdersByHourData(data) : []),
    [data],
  );
  const statusData = useMemo(() => buildStatusDistribution(orders), [orders]);
  const timingData = useMemo(
    () => (data ? buildTimingData(data) : []),
    [data],
  );
  const utilizationData = useMemo(
    () => (data ? buildUtilizationData(data) : []),
    [data],
  );
  const orderTotal = useMemo(() => totalOrderCount(orders), [orders]);

  const utilizationPct = data
    ? `${(data.chefUtilization * 100).toFixed(1)}%`
    : "—";

  return (
    <section className="space-y-6" aria-labelledby="analytics-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="analytics-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kitchen performance, throughput, and live order distribution.
          </p>
        </div>
        {loading && (
          <Badge variant="outline" className="gap-1.5 animate-pulse">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </Badge>
        )}
      </div>

      {!data ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Analytics unavailable. Ensure the backend is running on port 9000.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={Clock}
              label="Avg wait time"
              value={`${data.averageWaitTime.toFixed(1)}s`}
              hint="Created → in-progress"
            />
            <MetricCard
              icon={Flame}
              label="Avg make time"
              value={`${data.averageMakeTime.toFixed(1)}s`}
              hint="In-progress → finished"
            />
            <MetricCard
              icon={Users}
              label="Chef utilization"
              value={utilizationPct}
              hint="Since server start"
            />
            <MetricCard
              icon={TrendingUp}
              label="Top seller"
              value={data.mostPopularSushi}
              hint={`${orderTotal} orders tracked`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="size-4 text-muted-foreground" />
                  Orders by hour
                </CardTitle>
                <CardDescription>
                  Order volume grouped by hour of day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hourlyData.length === 0 ? (
                  <ChartEmpty message="No hourly data yet — place orders to populate this chart." />
                ) : (
                  <ChartContainer
                    config={hourlyChartConfig}
                    className="aspect-auto h-[260px] w-full"
                  >
                    <BarChart data={hourlyData} margin={{ left: 0, right: 8 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="hour"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={24}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        width={32}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="orders"
                        fill="var(--color-orders)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Live order status</CardTitle>
                <CardDescription>
                  Current breakdown across all pipeline stages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statusData.length === 0 ? (
                  <ChartEmpty message="No active orders in the system." />
                ) : (
                  <ChartContainer
                    config={statusChartConfig}
                    className="mx-auto aspect-square h-[260px] max-h-[260px]"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={60}
                        outerRadius={95}
                        strokeWidth={2}
                      >
                        {statusData.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={`var(--color-${entry.status})`}
                          />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {orderTotal}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy ?? 0) + 18}
                                    className="fill-muted-foreground text-xs"
                                  >
                                    orders
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Kitchen timing</CardTitle>
                <CardDescription>
                  Average seconds in queue vs on the pass.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={timingChartConfig}
                  className="aspect-auto h-[240px] w-full"
                >
                  <BarChart
                    data={timingData}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="metric"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={72}
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      unit="s"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="seconds"
                      fill="var(--color-seconds)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chef capacity</CardTitle>
                <CardDescription>
                  Share of time all chefs are busy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={utilizationChartConfig}
                  className="mx-auto aspect-square h-[240px] max-h-[240px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={utilizationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={88}
                      strokeWidth={2}
                    >
                      {utilizationData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.fill}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-2xl font-bold"
                                >
                                  {utilizationPct}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 18}
                                  className="fill-muted-foreground text-xs"
                                >
                                  utilized
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <Separator className="my-4" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[var(--color-busy)]" />
                    Busy
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[var(--color-idle)]" />
                    Idle
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
