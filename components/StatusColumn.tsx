"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { OrderStatusItem, StatusKey } from "@/lib/types";
import { OrderCard } from "./OrderCard";

interface StatusColumnProps {
  statusKey: StatusKey;
  label: string;
  dotColor: string;
  items: OrderStatusItem[];
  compact?: boolean;
  onPause?: (orderId: number) => void;
  onResume?: (orderId: number) => void;
  onCancel?: (orderId: number) => void;
  actionLoading: number | null;
}

export function StatusColumn({
  statusKey,
  label,
  dotColor,
  items,
  compact = false,
  onPause,
  onResume,
  onCancel,
  actionLoading,
}: StatusColumnProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </div>
        <Badge
          variant={items.length >= 10 ? "default" : "secondary"}
          className="tabular-nums"
        >
          {items.length}
        </Badge>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full max-h-full">
          <div
            className={cn(
              "flex flex-col p-2",
              compact ? "gap-1" : "gap-2",
            )}
          >
            {items.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">
                No orders
              </p>
            ) : (
              items.map((order) => (
                <OrderCard
                  key={`${statusKey}-${order.orderId}`}
                  order={order}
                  status={statusKey}
                  compact={compact}
                  onPause={statusKey === "in-progress" ? onPause : undefined}
                  onResume={statusKey === "paused" ? onResume : undefined}
                  onCancel={
                    ["created", "in-progress", "paused", "resumed"].includes(
                      statusKey,
                    )
                      ? onCancel
                      : undefined
                  }
                  actionLoading={actionLoading}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
