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
  dotColor: string;
}[] = [
  { key: "created", label: "Queued", dotColor: "bg-muted-foreground" },
  { key: "resumed", label: "Resumed", dotColor: "bg-violet-500" },
  { key: "in-progress", label: "Cooking", dotColor: "bg-amber-500" },
  { key: "paused", label: "Paused", dotColor: "bg-sky-500" },
  { key: "completed", label: "Finished", dotColor: "bg-emerald-500" },
  { key: "cancelled", label: "Cancelled", dotColor: "bg-destructive" },
];

export const CHEF_COUNT = 3;

export const POLL_INTERVAL_MS = 1000;
