import { Address, Order, OrderItem, OrderTrackingStep } from "@/types/storefront";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./storage";

const LEGACY_SAMPLE_ORDER_NUMBERS = new Set(["HNL-2026-8492", "HNL-2026-9214"]);

export function getOrders(): Order[] {
  const stored = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  if (!Array.isArray(stored)) return [];

  const orders = stored.filter(
    (order) => !LEGACY_SAMPLE_ORDER_NUMBERS.has(order.orderNumber),
  );
  if (orders.length !== stored.length) {
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  }
  return orders;
}

export function getOrderByNumber(orderNumber: string): Order | null {
  const orders = getOrders();
  const normalized = orderNumber.trim().toUpperCase();
  return orders.find((order) => order.orderNumber.toUpperCase() === normalized) ?? null;
}

export interface CreateOrderParams {
  customer: {
    fullName: string;
    email: string;
    mobile: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    couponDiscount: number;
    shippingFee: number;
    total: number;
  };
  couponCode?: string;
  paymentMethod: "Cash on Delivery" | "UPI" | "Credit / Debit Card";
}

export function createOrder(params: CreateOrderParams): Order {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const orderNumber = `HNL-${now.getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;
  const trackingSteps: OrderTrackingStep[] = [
    {
      status: "Preview Only",
      label: "Preview saved in this browser",
      description:
        "No order was submitted to the business or to a delivery service.",
      timestamp: formattedDate,
      completed: true,
    },
  ];

  const order: Order = {
    orderNumber,
    createdAt: now.toISOString(),
    customer: params.customer,
    shippingAddress: params.shippingAddress,
    items: params.items,
    pricing: params.pricing,
    couponCode: params.couponCode,
    paymentMethod: params.paymentMethod,
    paymentStatus: "Not processed in preview",
    currentStatus: "Preview Only",
    trackingSteps,
    estimatedDelivery: "Unavailable in preview",
  };

  setStorageItem(STORAGE_KEYS.ORDERS, [order, ...getOrders()]);
  const savedOrder = getOrders().find(
    (storedOrder) =>
      storedOrder.orderNumber === order.orderNumber &&
      storedOrder.createdAt === order.createdAt,
  );
  if (!savedOrder) {
    throw new Error("The checkout preview could not be saved in this browser.");
  }

  return order;
}
