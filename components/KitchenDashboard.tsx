"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { AnalyticsPanel } from "./AnalyticsPanel";
import { ChefStation } from "./ChefStation";
import { NewOrderForm } from "./NewOrderForm";
import { OrderBoard } from "./OrderBoard";
import { ToastStack, type ToastMessage } from "./Toast";

export function KitchenDashboard() {
  const [orders, setOrders] = useState<OrdersByStatus>({});
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [connected, setConnected] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);

  const addToast = useCallback((text: string, type: ToastMessage["type"]) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
      addToast(`Order #${res.order.id} created`, "success");
      await refresh();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to create order", "error");
    }
  }

  async function runAction(
    orderId: number,
    action: () => Promise<{ msg: string }>,
  ) {
    setActionLoading(orderId);
    try {
      const res = await action();
      addToast(res.msg, "success");
      await refresh();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  }

  const inProgressCount = orders["in-progress"]?.length ?? 0;

  return (
    <div className="min-h-full bg-[#0c0a09] text-stone-100">
      <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              🍣
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-amber-50 sm:text-xl">
                Sushi Kitchen
              </h1>
              <p className="text-xs text-stone-500">Live order dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                connected ? "bg-emerald-400" : "bg-rose-500 animate-pulse"
              }`}
            />
            <span className="text-xs text-stone-400">
              {connected ? "Backend connected" : "Backend unreachable"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewOrderForm onSubmit={handleCreate} disabled={!connected} />
          </div>
          <ChefStation activeCount={inProgressCount} />
        </div>

        <OrderBoard
          orders={orders}
          actionLoading={actionLoading}
          onPause={(id) => runAction(id, () => pauseOrder(id))}
          onResume={(id) => runAction(id, () => resumeOrder(id))}
          onCancel={(id) => runAction(id, () => cancelOrder(id))}
        />

        <AnalyticsPanel data={analytics} loading={connected} />
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
