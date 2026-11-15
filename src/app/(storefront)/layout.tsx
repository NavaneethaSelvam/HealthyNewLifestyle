import type { ReactNode } from "react";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontProvider } from "@/features/cart/StorefrontProvider";
import { ToastContainer } from "@/components/storefront/ToastContainer";
import { ProductQuickViewModal } from "@/components/storefront/ProductQuickViewModal";

export default function StorefrontLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <StorefrontProvider>
      <StorefrontHeader />
      {children}
      <StorefrontFooter />
      <ProductQuickViewModal />
      <ToastContainer />
    </StorefrontProvider>
  );
}
