import type { StatusKey } from "./types";

export const API_BASE = "/api";

export const SUSHI_MENU = [
  { name: "California Roll", timeToMake: 30 },
  { name: "Kamikaze Roll", timeToMake: 40 },
  { name: "Dragon Eye", timeToMake: 50 },
] as const;

export const STATUS_COLUMNS: {
  key: StatusKey;
  label: string;
  color: string;
  border: string;
}[] = [
  {
    key: "created",
    label: "Queued",
    color: "bg-slate-500/15 text-slate-300",
    border: "border-slate-500/40",
  },
  {
    key: "resumed",
    label: "Resumed",
    color: "bg-violet-500/15 text-violet-300",
    border: "border-violet-500/40",
  },
  {
    key: "in-progress",
    label: "Cooking",
    color: "bg-amber-500/15 text-amber-300",
    border: "border-amber-500/40",
  },
  {
    key: "paused",
    label: "Paused",
    color: "bg-sky-500/15 text-sky-300",
    border: "border-sky-500/40",
  },
  {
    key: "completed",
    label: "Finished",
    color: "bg-emerald-500/15 text-emerald-300",
    border: "border-emerald-500/40",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "bg-rose-500/15 text-rose-300",
    border: "border-rose-500/40",
  },
];

export const CHEF_COUNT = 3;

export const POLL_INTERVAL_MS = 1000;
