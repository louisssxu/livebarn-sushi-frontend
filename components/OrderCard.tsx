"use client";

import { Loader2, Pause, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderStatusItem, StatusKey } from "@/lib/types";

interface OrderCardProps {
  order: OrderStatusItem;
  status: StatusKey;
  compact?: boolean;
  onPause?: (orderId: number) => void;
  onResume?: (orderId: number) => void;
  onCancel?: (orderId: number) => void;
  actionLoading?: number | null;
}

export function OrderCard({
  order,
  status,
  compact = false,
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

  const timeLabel =
    status === "created" || status === "resumed" ? "wait" : "cook time";

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2 text-sm",
          status === "in-progress" && "border-primary/20",
        )}
      >
        <span className="shrink-0 font-mono text-xs font-medium">
          #{order.orderId}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground tabular-nums">
          {order.timeSpent}s {timeLabel}
        </span>
        {status === "in-progress" && (
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-amber-500" />
        )}
        {(canPause || canResume || canCancel) && (
          <div className="flex shrink-0 gap-0.5">
            {canPause && (
              <IconAction
                label="Pause"
                loading={isLoading}
                onClick={() => onPause(order.orderId)}
              >
                <Pause />
              </IconAction>
            )}
            {canResume && (
              <IconAction
                label="Resume"
                loading={isLoading}
                onClick={() => onResume(order.orderId)}
              >
                <Play />
              </IconAction>
            )}
            {canCancel && (
              <IconAction
                label="Cancel"
                variant="destructive"
                loading={isLoading}
                onClick={() => onCancel(order.orderId)}
              >
                <X />
              </IconAction>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "shrink-0 rounded-lg border bg-card p-3",
        status === "in-progress" && "border-primary/20 ring-1 ring-primary/10",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-sm font-medium">Order #{order.orderId}</p>
          <p className="text-xs text-muted-foreground">
            {timeLabel}:{" "}
            <span className="font-medium text-foreground tabular-nums">
              {order.timeSpent}s
            </span>
          </p>
        </div>
        {status === "in-progress" && (
          <Badge variant="outline" className="shrink-0 gap-1">
            <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
            Active
          </Badge>
        )}
      </div>

      {(canPause || canResume || canCancel) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {canPause && (
            <Button
              variant="outline"
              size="xs"
              disabled={isLoading}
              onClick={() => onPause(order.orderId)}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Pause data-icon="inline-start" />
              )}
              Pause
            </Button>
          )}
          {canResume && (
            <Button
              size="xs"
              disabled={isLoading}
              onClick={() => onResume(order.orderId)}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Play data-icon="inline-start" />
              )}
              Resume
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              size="xs"
              disabled={isLoading}
              onClick={() => onCancel(order.orderId)}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <X data-icon="inline-start" />
              )}
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function IconAction({
  label,
  variant = "outline",
  loading,
  onClick,
  children,
}: {
  label: string;
  variant?: "outline" | "destructive";
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon-xs"
      title={label}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
