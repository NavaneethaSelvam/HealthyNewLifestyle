export type StoreCategory = {
  slug: string;
  name: string;
  image: string;
};

const categoryNames = [
  "Traditional Rice",
  "Millets",
  "Flakes / Aval Varieties",
  "Pulses & Dal",
  "Spices & Seeds",
  "Spice Powder",
  "Dried Herbs / Leaves",
  "Dry Fruits and Nuts",
  "Natural Sweeteners",
  "Home Made Vadagam / Appalam",
  "Pickle / Jam / Spread",
  "Home Made / Value Added Flour",
  "Health Mix",
  "Ghee & Wood Press Oil",
  "Bath and Body Care",
  "Home Cleaners",
  "Pooja Items",
  "Traditional Wheat",
  "Ready Mix Powder",
  "Salts",
  "Home Made Cosmetics",
];

const categoryImages = [
  "/images/categories/traditional-rice.jpg",
  "/images/categories/millets.jpg",
  "/images/categories/flakes-aval..jpg",
  "/images/categories/pulses-dal.png",
  "/images/categories/spices-seeds.png",
  "/images/categories/spice-powder.png",
  "/images/categories/dried-herbs-leaves.png",
  "/images/categories/dry-fruits-nuts.jpg",
  "/images/categories/natural-sweeteners.jpg",
  "/images/categories/vadagam-appalam.png",
  "/images/categories/pickle-jam-spread.png",
  "/images/categories/homemade-flour.jpg",
  "/images/categories/health-mix.jpg",
  "/images/categories/ghee-wood-press-oil.jpg",
  "/images/categories/bath-body-care.jpg",
  "/images/categories/home-cleaners.jpg",
  "/images/categories/pooja-items.jpg",
  "/images/categories/traditional-wheat.jpg",
  "/images/categories/ready-mix-powder.jpg",
  "/images/categories/salts.jpg",
  "/images/categories/homemade-cosmetics.jpg",
];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const categories: StoreCategory[] = categoryNames.map((name, index) => ({
  slug: toSlug(name),
  name,
  image: categoryImages[index],
}));

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
