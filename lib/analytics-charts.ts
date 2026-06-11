import { STATUS_COLUMNS } from "@/lib/constants";
import type { Analytics, OrdersByStatus } from "@/lib/types";

export function buildOrdersByHourData(analytics: Analytics) {
  return Object.entries(analytics.ordersByHour)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([hour, count]) => ({
      hour: `${hour.padStart(2, "0")}:00`,
      orders: count,
    }));
}

export function buildStatusDistribution(orders: OrdersByStatus) {
  return STATUS_COLUMNS.map((col) => ({
    status: col.key,
    label: col.label,
    count: orders[col.key]?.length ?? 0,
  })).filter((item) => item.count > 0);
}

export function buildTimingData(analytics: Analytics) {
  return [
    { metric: "Avg wait", seconds: analytics.averageWaitTime },
    { metric: "Avg make", seconds: analytics.averageMakeTime },
  ];
}

export function buildUtilizationData(analytics: Analytics) {
  const busy = Math.round(analytics.chefUtilization * 100);
  return [
    { name: "busy", value: busy, fill: "var(--color-busy)" },
    { name: "idle", value: 100 - busy, fill: "var(--color-idle)" },
  ];
}

export function totalOrderCount(orders: OrdersByStatus) {
  return STATUS_COLUMNS.reduce(
    (sum, col) => sum + (orders[col.key]?.length ?? 0),
    0,
  );
}
