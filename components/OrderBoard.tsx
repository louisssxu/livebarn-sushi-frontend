"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_COLUMNS } from "@/lib/constants";
import type { OrderStatusItem, OrdersByStatus } from "@/lib/types";
import { StatusColumn } from "./StatusColumn";

const ACTIVE_KEYS = new Set(["created", "resumed", "in-progress", "paused"]);
const HISTORY_KEYS = new Set(["completed", "cancelled"]);

function sortOrders(items: OrderStatusItem[]): OrderStatusItem[] {
  return [...items].sort((a, b) => a.orderId - b.orderId);
}

interface OrderBoardProps {
  orders: OrdersByStatus;
  onPause: (orderId: number) => void;
  onResume: (orderId: number) => void;
  onCancel: (orderId: number) => void;
  actionLoading: number | null;
}

export function OrderBoard({
  orders,
  onPause,
  onResume,
  onCancel,
  actionLoading,
}: OrderBoardProps) {
  const { totalOrders, activeCount } = useMemo(() => {
    let total = 0;
    let active = 0;
    for (const col of STATUS_COLUMNS) {
      const count = orders[col.key]?.length ?? 0;
      total += count;
      if (ACTIVE_KEYS.has(col.key)) active += count;
    }
    return { totalOrders: total, activeCount: active };
  }, [orders]);

  const activeColumns = STATUS_COLUMNS.filter((c) => ACTIVE_KEYS.has(c.key));
  const historyColumns = STATUS_COLUMNS.filter((c) => HISTORY_KEYS.has(c.key));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order board</CardTitle>
        <CardDescription>
          {totalOrders} total orders · {activeCount} active in the kitchen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active pipeline
          </p>
          <div className="grid h-[min(52vh,28rem)] grid-cols-2 gap-3 sm:grid-cols-4">
            {activeColumns.map((col) => (
              <StatusColumn
                key={col.key}
                statusKey={col.key}
                label={col.label}
                dotColor={col.dotColor}
                items={sortOrders(orders[col.key] ?? [])}
                compact={col.key === "created" || col.key === "resumed"}
                onPause={onPause}
                onResume={onResume}
                onCancel={onCancel}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            History
          </p>
          <div className="grid h-[min(32vh,18rem)] grid-cols-1 gap-3 sm:grid-cols-2">
            {historyColumns.map((col) => (
              <StatusColumn
                key={col.key}
                statusKey={col.key}
                label={col.label}
                dotColor={col.dotColor}
                items={sortOrders(orders[col.key] ?? [])}
                compact
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
