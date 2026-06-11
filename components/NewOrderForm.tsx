"use client";

import { useState } from "react";
import { SUSHI_MENU } from "@/lib/constants";

interface NewOrderFormProps {
  onSubmit: (sushiName: string) => Promise<void>;
  disabled?: boolean;
}

export function NewOrderForm({ onSubmit, disabled }: NewOrderFormProps) {
  const [sushiName, setSushiName] = useState<string>(SUSHI_MENU[0].name);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(sushiName);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-700/60 bg-stone-900/80 p-5"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-400/90">
        New Order
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs text-stone-400">Sushi</span>
          <select
            value={sushiName}
            onChange={(e) => setSushiName(e.target.value)}
            disabled={disabled || submitting}
            className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50"
          >
            {SUSHI_MENU.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.timeToMake}s)
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={disabled || submitting}
          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing…" : "Place Order"}
        </button>
      </div>
    </form>
  );
}
