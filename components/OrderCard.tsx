"use client";

import type { OrderStatusItem, StatusKey } from "@/lib/types";

interface OrderCardProps {
  order: OrderStatusItem;
  status: StatusKey;
  onPause?: (orderId: number) => void;
  onResume?: (orderId: number) => void;
  onCancel?: (orderId: number) => void;
  actionLoading?: number | null;
}

export function OrderCard({
  order,
  status,
  onPause,
  onResume,
  onCancel,
  actionLoading,
}: OrderCardProps) {
  const isLoading = actionLoading === order.orderId;

  const canPause = status === "in-progress" && onPause;
  const canResume = status === "paused" && onResume;
  const canCancel =
    (status === "created" ||
      status === "in-progress" ||
      status === "paused" ||
      status === "resumed") &&
    onCancel;

  return (
    <article className="rounded-lg border border-stone-600/50 bg-stone-800/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-semibold text-stone-100">
            #{order.orderId}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {status === "created" || status === "resumed"
              ? "Waiting"
              : "Time spent"}
            :{" "}
            <span className="tabular-nums text-stone-300">
              {order.timeSpent}s
            </span>
          </p>
        </div>
        {status === "in-progress" && (
          <span className="inline-flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400" />
        )}
      </div>

      {(canPause || canResume || canCancel) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {canPause && (
            <ActionButton
              label="Pause"
              variant="sky"
              loading={isLoading}
              onClick={() => onPause(order.orderId)}
            />
          )}
          {canResume && (
            <ActionButton
              label="Resume"
              variant="violet"
              loading={isLoading}
              onClick={() => onResume(order.orderId)}
            />
          )}
          {canCancel && (
            <ActionButton
              label="Cancel"
              variant="rose"
              loading={isLoading}
              onClick={() => onCancel(order.orderId)}
            />
          )}
        </div>
      )}
    </article>
  );
}

function ActionButton({
  label,
  variant,
  loading,
  onClick,
}: {
  label: string;
  variant: "sky" | "violet" | "rose";
  loading: boolean;
  onClick: () => void;
}) {
  const colors = {
    sky: "border-sky-600/50 text-sky-300 hover:bg-sky-500/15",
    violet: "border-violet-600/50 text-violet-300 hover:bg-violet-500/15",
    rose: "border-rose-600/50 text-rose-300 hover:bg-rose-500/15",
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`rounded border px-2 py-1 text-[11px] font-medium transition disabled:opacity-50 ${colors[variant]}`}
    >
      {loading ? "…" : label}
    </button>
  );
}
