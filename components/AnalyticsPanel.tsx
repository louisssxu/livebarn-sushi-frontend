"use client";

import type { Analytics } from "@/lib/types";

interface AnalyticsPanelProps {
  data: Analytics | null;
  loading: boolean;
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-stone-700/50 bg-stone-800/50 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-stone-100">
        {value}
        {suffix && (
          <span className="ml-0.5 text-sm font-normal text-stone-400">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

export function AnalyticsPanel({ data, loading }: AnalyticsPanelProps) {
  const utilization = data
    ? `${(data.chefUtilization * 100).toFixed(1)}%`
    : "—";

  const hours = data
    ? Object.entries(data.ordersByHour).sort(
        ([a], [b]) => Number(a) - Number(b),
      )
    : [];

  return (
    <section className="rounded-xl border border-stone-700/60 bg-stone-900/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400/90">
          Kitchen Analytics
        </h2>
        {loading && (
          <span className="text-xs text-stone-500 animate-pulse">Updating…</span>
        )}
      </div>

      {!data ? (
        <p className="text-sm text-stone-500">
          Analytics unavailable — ensure the backend is running.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard
              label="Avg Wait"
              value={data.averageWaitTime.toFixed(1)}
              suffix="s"
            />
            <StatCard
              label="Avg Make"
              value={data.averageMakeTime.toFixed(1)}
              suffix="s"
            />
            <StatCard label="Chef Util." value={utilization} />
            <StatCard label="Top Seller" value={data.mostPopularSushi} />
          </div>

          {hours.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Orders by Hour
              </p>
              <div className="flex flex-wrap gap-2">
                {hours.map(([hour, count]) => (
                  <span
                    key={hour}
                    className="rounded-md border border-stone-600/50 bg-stone-800 px-2.5 py-1 text-xs tabular-nums text-stone-300"
                  >
                    {hour.padStart(2, "0")}:00 → {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
