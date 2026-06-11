"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  cancelOrder,
  createOrder,
  fetchAnalytics,
  fetchOrdersByStatus,
  pauseOrder,
  resumeOrder,
} from "@/lib/api";
import { POLL_INTERVAL_MS } from "@/lib/constants";
import type { Analytics, OrdersByStatus } from "@/lib/types";
import { AnalyticsSection } from "./analytics-section";
import { ChefStation } from "./ChefStation";
import { ModeToggle } from "./mode-toggle";
import { NewOrderForm } from "./NewOrderForm";
import { OrderBoard } from "./OrderBoard";

export function KitchenDashboard() {
  const [orders, setOrders] = useState<OrdersByStatus>({});
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [connected, setConnected] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [statusData, analyticsData] = await Promise.all([
        fetchOrdersByStatus(),
        fetchAnalytics().catch(() => null),
      ]);
      setOrders(statusData);
      if (analyticsData) setAnalytics(analyticsData);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  async function handleCreate(sushiName: string) {
    try {
      const res = await createOrder(sushiName);
      toast.success(`Order #${res.order.id} created`);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create order",
      );
    }
  }

  async function runAction(
    orderId: number,
    action: () => Promise<{ msg: string }>,
  ) {
    setActionLoading(orderId);
    try {
      const res = await action();
      toast.success(res.msg);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  const inProgressCount = orders["in-progress"]?.length ?? 0;

  return (
    <div className="min-h-full bg-muted/40">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border bg-card">
              <Activity className="size-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight sm:text-lg">
                Sushi Kitchen
              </h1>
              <p className="text-xs text-muted-foreground">
                Order management dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Badge
              variant={connected ? "secondary" : "destructive"}
              className="gap-1.5"
            >
              {connected ? (
                <Wifi className="size-3" />
              ) : (
                <WifiOff className="size-3" />
              )}
              {connected ? "Connected" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="grid shrink-0 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewOrderForm onSubmit={handleCreate} disabled={!connected} />
          </div>
          <ChefStation activeCount={inProgressCount} />
        </div>

        <Separator />

        <OrderBoard
          orders={orders}
          actionLoading={actionLoading}
          onPause={(id) => runAction(id, () => pauseOrder(id))}
          onResume={(id) => runAction(id, () => resumeOrder(id))}
          onCancel={(id) => runAction(id, () => cancelOrder(id))}
        />

        <Separator />

        <AnalyticsSection
          data={analytics}
          orders={orders}
          loading={connected}
        />
      </main>
    </div>
  );
}
