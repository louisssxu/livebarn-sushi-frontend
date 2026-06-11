export interface ApiResponse {
  code: number;
  msg: string;
}

export interface OrderRecord {
  id: number;
  statusId: number;
  sushiId: number;
  createdAt: number;
}

export interface CreateOrderResponse extends ApiResponse {
  order: OrderRecord;
}

export interface OrderStatusItem {
  orderId: number;
  timeSpent: number;
}

export type StatusKey =
  | "created"
  | "in-progress"
  | "paused"
  | "resumed"
  | "completed"
  | "cancelled";

export type OrdersByStatus = Partial<Record<StatusKey, OrderStatusItem[]>>;

export interface Analytics extends ApiResponse {
  averageWaitTime: number;
  averageMakeTime: number;
  chefUtilization: number;
  mostPopularSushi: string;
  ordersByHour: Record<string, number>;
}
