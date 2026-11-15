import Image from "next/image";
import type { StoreCategory } from "@/features/catalog/catalog-data";

export function HomepageCategoryImage({
  category,
  sizes,
}: {
  category: StoreCategory;
  sizes: string;
}) {
  return <Image src={category.image} alt="" fill sizes={sizes} />;
}
