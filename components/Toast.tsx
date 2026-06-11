"use client";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex min-w-[260px] items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-100"
              : "border-rose-500/30 bg-rose-950/90 text-rose-100"
          }`}
        >
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
