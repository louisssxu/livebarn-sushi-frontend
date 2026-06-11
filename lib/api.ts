import { API_BASE } from "./constants";
import type {
  Analytics,
  ApiResponse,
  CreateOrderResponse,
  OrdersByStatus,
} from "./types";

class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T extends ApiResponse>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = (await res.json()) as T;

  if (!res.ok || data.code !== 0) {
    throw new ApiError(data.msg ?? `Request failed (${res.status})`, data.code);
  }

  return data;
}

export async function createOrder(sushiName: string): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({ sushi_name: sushiName }),
  });
}

export async function cancelOrder(orderId: number): Promise<ApiResponse> {
  return request<ApiResponse>(`/orders/${orderId}`, { method: "DELETE" });
}

export async function pauseOrder(orderId: number): Promise<ApiResponse> {
  return request<ApiResponse>(`/orders/${orderId}/pause`, { method: "PUT" });
}

export async function resumeOrder(orderId: number): Promise<ApiResponse> {
  return request<ApiResponse>(`/orders/${orderId}/resume`, { method: "PUT" });
}

export async function fetchOrdersByStatus(): Promise<OrdersByStatus> {
  const res = await fetch(`${API_BASE}/orders/status`);
  if (!res.ok) {
    throw new ApiError(`Failed to fetch orders (${res.status})`, res.status);
  }
  return (await res.json()) as OrdersByStatus;
}

export async function fetchAnalytics(): Promise<Analytics> {
  return request<Analytics>("/orders/analytics");
}

export { ApiError };
