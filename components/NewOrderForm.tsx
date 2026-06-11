"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Card>
      <CardHeader>
        <CardTitle>New order</CardTitle>
        <CardDescription>Select a roll and submit to the kitchen queue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="sushi-select" className="text-sm font-medium">
              Menu item
            </label>
            <Select
              value={sushiName}
              onValueChange={(value) => setSushiName(value as string)}
              disabled={disabled || submitting}
            >
              <SelectTrigger id="sushi-select" className="w-full">
                <SelectValue placeholder="Select sushi" />
              </SelectTrigger>
              <SelectContent>
                {SUSHI_MENU.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name} · {item.timeToMake}s prep
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={disabled || submitting}
            className="sm:min-w-32"
          >
            <Plus data-icon="inline-start" />
            {submitting ? "Placing…" : "Place order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
