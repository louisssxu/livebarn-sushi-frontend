"use client";

import { CHEF_COUNT } from "@/lib/constants";

interface ChefStationProps {
  activeCount: number;
}

export function ChefStation({ activeCount }: ChefStationProps) {
  return (
    <section className="rounded-xl border border-stone-700/60 bg-stone-900/80 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-400/90">
        Chef Station
      </h2>
      <p className="mb-3 text-xs text-stone-400">
        {activeCount} of {CHEF_COUNT} chefs busy
      </p>
      <div className="flex gap-3">
        {Array.from({ length: CHEF_COUNT }, (_, i) => {
          const busy = i < activeCount;
          return (
            <div
              key={i}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border px-3 py-4 transition-colors ${
                busy
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-stone-600/40 bg-stone-800/40"
              }`}
            >
              <span className="text-2xl" role="img" aria-label="chef">
                {busy ? "👨‍🍳" : "🧑‍🍳"}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  busy ? "text-amber-400" : "text-stone-500"
                }`}
              >
                {busy ? "Cooking" : "Idle"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
