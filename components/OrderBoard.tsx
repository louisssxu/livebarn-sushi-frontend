"use client";

import { STATUS_COLUMNS } from "@/lib/constants";
import type { OrdersByStatus, StatusKey } from "@/lib/types";
import { OrderCard } from "./OrderCard";

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
  const totalOrders = STATUS_COLUMNS.reduce(
    (sum, col) => sum + (orders[col.key]?.length ?? 0),
    0,
  );

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400/90">
          Order Board
        </h2>
        <span className="text-xs text-stone-500">{totalOrders} total</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATUS_COLUMNS.map((col) => {
          const items = orders[col.key] ?? [];
          return (
            <div
              key={col.key}
              className={`flex min-h-[200px] flex-col rounded-xl border ${col.border} bg-stone-900/60`}
            >
              <header
                className={`flex items-center justify-between rounded-t-xl border-b px-3 py-2.5 ${col.color} ${col.border}`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold tabular-nums">
                  {items.length}
                </span>
              </header>
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 max-h-[420px]">
                {items.length === 0 ? (
                  <p className="py-6 text-center text-xs text-stone-600">Empty</p>
                ) : (
                  items.map((order) => (
                    <OrderCard
                      key={`${col.key}-${order.orderId}`}
                      order={order}
                      status={col.key as StatusKey}
                      onPause={col.key === "in-progress" ? onPause : undefined}
                      onResume={col.key === "paused" ? onResume : undefined}
                      onCancel={
                        ["created", "in-progress", "paused", "resumed"].includes(
                          col.key,
                        )
                          ? onCancel
                          : undefined
                      }
                      actionLoading={actionLoading}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
