
export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  IN_TRANSIT = 'IN_TRANSIT'
}


export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
  OrderStatus.REJECTED,
  OrderStatus.APPROVED,
  OrderStatus.IN_TRANSIT,
] as const;
