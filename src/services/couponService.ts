import { Coupon } from "@/types/storefront";

export const SAMPLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 499,
    description: "10% off on your first order above ₹499 (Max ₹150)",
    maxDiscount: 150,
  },
  {
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 399,
    description: "Flat ₹50 off on orders above ₹399",
  },
  {
    code: "ORGANIC100",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 999,
    description: "Flat ₹100 off on healthy orders above ₹999",
  },
  {
    code: "FREESHIP",
    discountType: "free_shipping",
    discountValue: 60,
    minOrderAmount: 299,
    description: "Free standard delivery across Tamil Nadu & India",
  },
  {
    code: "FESTIVE15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 799,
    description: "15% festive discount for traditional grains & sweets (Max ₹200)",
    maxDiscount: 200,
  },
];

export function getAvailableCoupons(): Coupon[] {
  return SAMPLE_COUPONS;
}

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; coupon?: Coupon; error?: string; discountAmount: number } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, error: "Please enter a coupon code", discountAmount: 0 };
  }

  const coupon = SAMPLE_COUPONS.find((c) => c.code === normalized);
  if (!coupon) {
    return {
      valid: false,
      error: `Coupon "${normalized}" is invalid or expired. Try WELCOME10 or SAVE50.`,
      discountAmount: 0,
    };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      coupon,
      error: `Cart total must be at least ₹${coupon.minOrderAmount} to use "${coupon.code}". (Current: ₹${subtotal})`,
      discountAmount: 0,
    };
  }

  const discountAmount = calculateCouponDiscount(coupon, subtotal);
  return { valid: true, coupon, discountAmount };
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.discountType === "fixed") {
    return Math.min(coupon.discountValue, subtotal);
  }
  if (coupon.discountType === "percentage") {
    const raw = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && raw > coupon.maxDiscount) {
      return coupon.maxDiscount;
    }
    return Math.round(raw);
  }
  if (coupon.discountType === "free_shipping") {
    return coupon.discountValue; // ₹60 standard shipping fee waived
  }
  return 0;
}
