"use client";

import { ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CHEF_COUNT } from "@/lib/constants";

interface ChefStationProps {
  activeCount: number;
}

export function ChefStation({ activeCount }: ChefStationProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Chef station</CardTitle>
        <CardDescription>
          {activeCount} of {CHEF_COUNT} chefs currently cooking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: CHEF_COUNT }, (_, i) => {
            const busy = i < activeCount;
            return (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border px-2 py-4 transition-colors",
                  busy
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-muted/30",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    busy ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <ChefHat className="size-5" />
                </div>
                <Badge variant={busy ? "default" : "secondary"}>
                  {busy ? "Cooking" : "Idle"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
