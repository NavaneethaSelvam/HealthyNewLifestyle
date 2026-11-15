export interface ProductVariant {
  name: string;
  weight: string;
  price: number;
  originalPrice: number;
  sku: string;
  inStock: boolean;
}

export interface ProductNutrition {
  servingSize: string;
  energy: string;
  protein: string;
  carbohydrates: string;
  dietaryFiber: string;
  fat: string;
  iron?: string;
  calcium?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tamilName?: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  availabilityConfirmed?: boolean;
  badge?: "Bestseller" | "Heritage" | "Cold Pressed" | "Native Grain" | "Sprouted" | "Organic" | "Festive Special";
  sku: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  origin: string;
  storage: string;
  nutrition?: ProductNutrition;
  variants: ProductVariant[];
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  variantName: string;
  quantity: number;
  price: number;
  originalPrice: number;
  product: Product;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  type?: "Home" | "Work" | "Other";
}

export type OrderStatus =
  | "Preview Only"
  | "Order Placed"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
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
  paymentStatus: "Paid (Demo)" | "Pending on Delivery" | "Not processed in preview";
  currentStatus: OrderStatus;
  trackingSteps: OrderTrackingStep[];
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minOrderAmount: number;
  description: string;
  maxDiscount?: number;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  joinedDate: string;
  preferredLanguage?: "English" | "Tamil";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
}
