import type { Product } from "@/types/storefront";
import { categories } from "./catalog-data";

type DemoCategoryCatalog = {
  imageDirectory: string;
  startingPrice: number;
  imageFiles: string[];
};

const demoCategoryCatalog: Record<string, DemoCategoryCatalog> = {
  "traditional-rice": {
    imageDirectory: "traditional-rice",
    startingPrice: 180,
    imageFiles: [
      "iluppai-poo-samba-rice.jpg",
      "kaivara-samba-rice.jpg",
      "kattuyanam-rice.jpg",
      "kichili-samba-rice.jpg",
      "kuzhiadichan-rice.jpg",
      "poongar-rice.jpg",
      "thooyamalli-rice.jpg",
    ],
  },
  "flakes-aval-varieties": {
    imageDirectory: "flakes-aval",
    startingPrice: 120,
    imageFiles: [
      "black-rice-aval.jpg",
      "brown-rice-aval.jpg",
      "jowar-flakes.jpg",
      "kambu-aval.jpg",
      "multi-millet-flakes.jpg",
      "ragi-aval.jpg",
      "samai-aval.jpg",
      "thinai-aval.jpg",
      "white-rice-aval.jpg",
    ],
  },
  "pulses-and-dal": {
    imageDirectory: "pulses-dal",
    startingPrice: 120,
    imageFiles: [
      "black-chickpeas.jpg",
      "black-urad-dal.jpg",
      "chana-dal.jpg",
      "cowpea-karamani.jpg",
      "horse-gram-kollu.jpg",
      "masoor-dal.jpg",
      "urad-dal.jpg",
      "whole-green-moong.jpg",
      "yellow-moong-dal.jpg",
    ],
  },
  "spices-and-seeds": {
    imageDirectory: "pure-spices",
    startingPrice: 150,
    imageFiles: [
      "bay-leaves.jpg",
      "cinnamon-sticks.jpg",
      "cloves.jpg",
      "coriander-seeds.jpg",
      "cumin-seeds.jpg",
      "fenugreek-seeds.jpg",
      "green-cardamom.jpg",
      "mustard-seeds.jpg",
      "star-anise.jpg",
      "whole-black-pepper.jpg",
    ],
  },
  "spice-powder": {
    imageDirectory: "spice-powder",
    startingPrice: 100,
    imageFiles: [
      "biryani-masala-powder.jpg",
      "black-pepper-powder.jpg",
      "chicken-masala-powder.jpg",
      "coriander-powder.jpg",
      "cumin-powder.jpg",
      "kulambu-masala-powder.jpg",
      "rasam-powder.jpg",
      "red-chilli-powder.jpg",
    ],
  },
  "dried-herbs-leaves": {
    imageDirectory: "dried-herbs-leaves",
    startingPrice: 100,
    imageFiles: [
      "dried-curry-leaves.jpg",
      "dried-drumstick-leaves.jpg",
      "dried-hibiscus.jpg",
      "dried-mint-leaves.jpg",
      "dried-moringa-leaves.jpg",
      "dried-neem-leaves.jpg",
      "dried-rose-petals.jpg",
      "dried-tulsi-leaves.jpg",
      "kasuri-methi.jpg",
    ],
  },
  "dry-fruits-and-nuts": {
    imageDirectory: "dry-fruits-nuts",
    startingPrice: 200,
    imageFiles: [
      "almonds.jpg",
      "cashews.jpg",
      "dates.jpg",
      "dried-apricots.jpg",
      "dried-cranberries.jpg",
      "dried-figs.jpg",
      "makhana.jpg",
      "pistachios.jpg",
      "raisins.jpg",
      "walnuts.jpg",
    ],
  },
  "natural-sweeteners": {
    imageDirectory: "natural-sweeteners",
    startingPrice: 130,
    imageFiles: [
      "coconut-sugar.jpg",
      "date-powder.jpg",
      "date-syrup.jpg",
      "forest-honey.jpg",
      "natural-honey.jpg",
      "organic-jaggery.jpg",
      "palm-candy.jpg",
      "palm-sugar.jpg",
    ],
  },
  "home-made-vadagam-appalam": {
    imageDirectory: "home-made-vadagam-appalam",
    startingPrice: 100,
    imageFiles: [
      "arisi-appalam.jpg",
      "jackfruit-appalam.jpg",
      "javvarisi-vadagam.jpg",
      "koozh-vadam.jpg",
      "onion-vadagam.jpg",
      "rice-fryums.jpg",
      "rice-vadagam.jpg",
      "tapioca-vadagam.jpg",
      "tomato-vadagam.jpg",
      "ulundhu-appalam.jpg",
    ],
  },
  "pickle-jam-spread": {
    imageDirectory: "pickle-jam-spread",
    startingPrice: 150,
    imageFiles: [
      "garlic-pickle.jpg",
      "ginger-pickle.jpg",
      "gooseberry-pickle.jpg",
      "guava-jam.jpg",
      "lemon-pickle.jpg",
      "mixed-fruit-jam.jpg",
      "mixed-vegetable-pickle.jpg",
      "peanut-butter.jpg",
      "tomato-pickle.jpg",
    ],
  },
  "home-made-value-added-flour": {
    imageDirectory: "home-made-value-added-flour",
    startingPrice: 100,
    imageFiles: [
      "cholam-flour.jpg",
      "green-gram-flour.jpg",
      "kambu-flour.jpg",
      "kollu-flour.jpg",
      "multigrain-flour.jpg",
      "ragi-flour.jpg",
      "rice-flour.jpg",
      "thinai-flour.jpg",
      "ulundhu-flour.jpg",
      "wheat-flour.jpg",
    ],
  },
  "health-mix": {
    imageDirectory: "health-mix",
    startingPrice: 180,
    imageFiles: [
      "badam-milk-mix.jpg",
      "dry-fruit-health-mix.jpg",
      "kambu-health-mix.jpg",
      "kollu-health-mix.jpg",
      "millet-kanji-mix.jpg",
      "multi-millet-health-mix.jpg",
      "multigrain-porridge-mix.jpg",
      "navadhanyam-mix.jpg",
      "sathu-maavu.jpg",
    ],
  },
  "ghee-and-wood-press-oil": {
    imageDirectory: "ghee-and-wood-press-oil",
    startingPrice: 250,
    imageFiles: [
      "almond-oil.jpg",
      "buffalo-ghee.jpg",
      "castor-oil.jpg",
      "coconut-oil.jpg",
      "herbal-sesame-oil.jpg",
      "mustard-oil.jpg",
      "sunflower-oil.jpg",
    ],
  },
  "bath-and-body-care": {
    imageDirectory: "bath-and-body-care",
    startingPrice: 130,
    imageFiles: [
      "aloe-vera-bath-gel.jpg",
      "coconut-milk-soap.jpg",
      "herbal-hair-wash-powder.jpg",
      "neem-soap.jpg",
      "reetha-powder.jpg",
      "rose-bath-powder.jpg",
      "sandalwood-soap.jpg",
      "shikakai-powder.jpg",
      "turmeric-soap.jpg",
    ],
  },
  "home-cleaners": {
    imageDirectory: "home-cleaners",
    startingPrice: 100,
    imageFiles: [
      "bathroom-cleaner.jpg",
      "cleaning-vinegar.jpg",
      "dishwash-liquid.jpg",
      "dishwash-powder.jpg",
      "glass-cleaner.jpg",
      "herbal-floor-cleaner.jpg",
      "laundry-powder.jpg",
      "multipurpose-cleaner.jpg",
      "soapnut-cleaning-powder.jpg",
      "toilet-cleaner.jpg",
    ],
  },
  "pooja-items": {
    imageDirectory: "pooja-items",
    startingPrice: 70,
    imageFiles: [
      "camphor.jpg",
      "cotton-wicks.jpg",
      "dried-pooja-flowers.jpg",
      "guggul-dhoop.jpg",
      "incense-sticks.jpg",
      "kumkum.jpg",
      "lotus-seeds.jpg",
      "pooja-turmeric.jpg",
      "sambrani-cups.jpg",
      "sandalwood-powder.jpg",
    ],
  },
  "traditional-wheat": {
    imageDirectory: "traditional-wheat",
    startingPrice: 120,
    imageFiles: [
      "black-wheat.jpg",
      "broken-wheat.jpg",
      "durum-wheat.jpg",
      "emmer-wheat.jpg",
      "red-wheat.jpg",
      "samba-wheat.jpg",
      "wheat-bran.jpg",
      "wheat-germ.jpg",
      "wheat-rava.jpg",
      "whole-wheat.jpg",
    ],
  },
  "ready-mix-powder": {
    imageDirectory: "ready-mix-powder",
    startingPrice: 130,
    imageFiles: [
      "adai-mix.jpg",
      "dosa-mix.jpg",
      "idiyappam-mix.jpg",
      "idli-mix.jpg",
      "kozhukattai-mix.jpg",
      "pesarattu-mix.jpg",
      "pongal-mix.jpg",
      "puttu-mix.jpg",
      "ragi-dosa-mix.jpg",
      "upma-mix.jpg",
    ],
  },
  salts: {
    imageDirectory: "salts",
    startingPrice: 80,
    imageFiles: [
      "black-salt.jpg",
      "coarse-pink-salt.jpg",
      "crystal-salt.jpg",
      "fine-natural-salt.jpg",
      "himalayan-pink-salt.jpg",
      "iodized-sea-salt.jpg",
      "natural-rock-salt.jpg",
      "sea-salt.jpg",
      "sendha-namak.jpg",
      "smoked-sea-salt.jpg",
    ],
  },
  "home-made-cosmetics": {
    imageDirectory: "salts/home-made-cosmetics",
    startingPrice: 150,
    imageFiles: [
      "aloe-vera-gel.jpg",
      "coffee-face-scrub.jpg",
      "herbal-face-pack.jpg",
      "herbal-hair-mask.jpg",
      "herbal-hair-oil.jpg",
      "multani-mitti-face-pack.jpg",
      "natural-lip-balm.jpg",
      "rose-water.jpg",
      "sandalwood-face-mask.jpg",
      "turmeric-face-cream.jpg",
    ],
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFromImageName(imageFile: string) {
  return imageFile
    .replace(/\.[^.]+$/, "")
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPackageOptions(categorySlug: string, imageFile: string) {
  if (categorySlug === "pooja-items") {
    return [
      { name: "1 pack", multiplier: 1 },
      { name: "2 pack", multiplier: 2 },
    ];
  }

  if (
    categorySlug === "ghee-and-wood-press-oil" ||
    categorySlug === "home-cleaners" && !/(powder|soapnut)/.test(imageFile) ||
    ["bath-and-body-care", "home-made-cosmetics", "natural-sweeteners"].includes(categorySlug) &&
      /(gel|oil|water|syrup|honey)/.test(imageFile)
  ) {
    return [
      { name: "500 ml", multiplier: 1 },
      { name: "1 L", multiplier: 1.9 },
    ];
  }

  if (categorySlug === "traditional-rice" || categorySlug === "traditional-wheat") {
    return [
      { name: "1 kg", multiplier: 1 },
      { name: "5 kg", multiplier: 4.5 },
    ];
  }

  if (categorySlug === "pulses-and-dal") {
    return [
      { name: "500g", multiplier: 1 },
      { name: "1 kg", multiplier: 1.9 },
    ];
  }

  if (["spices-and-seeds", "spice-powder", "dried-herbs-leaves"].includes(categorySlug)) {
    return [
      { name: "100g", multiplier: 1 },
      { name: "250g", multiplier: 2.3 },
    ];
  }

  if (categorySlug === "pickle-jam-spread") {
    return [
      { name: "300g", multiplier: 1 },
      { name: "500g", multiplier: 1.6 },
    ];
  }

  if (categorySlug === "dry-fruits-and-nuts") {
    return [
      { name: "250g", multiplier: 1 },
      { name: "500g", multiplier: 1.9 },
    ];
  }

  if (
    categorySlug === "bath-and-body-care" ||
    categorySlug === "home-made-cosmetics"
  ) {
    return [
      { name: "100g", multiplier: 1 },
      { name: "250g", multiplier: 2.2 },
    ];
  }

  if (categorySlug === "home-cleaners" && /(powder|soapnut)/.test(imageFile)) {
    return [
      { name: "500g", multiplier: 1 },
      { name: "1 kg", multiplier: 1.9 },
    ];
  }

  return [
    { name: "500g", multiplier: 1 },
    { name: "1 kg", multiplier: 1.9 },
  ];
}

const categoryUseCases: Record<string, string> = {
  "traditional-rice": "everyday meals and traditional recipes",
  "flakes-aval-varieties": "quick breakfasts and light meals",
  "pulses-and-dal": "everyday curries and home cooking",
  "spices-and-seeds": "seasoning and everyday cooking",
  "spice-powder": "seasoning everyday home-cooked meals",
  "dried-herbs-leaves": "cooking and herbal preparations",
  "dry-fruits-and-nuts": "snacking and pantry recipes",
  "natural-sweeteners": "sweetening drinks and recipes",
  "home-made-vadagam-appalam": "traditional meals and snacks",
  "pickle-jam-spread": "serving with everyday meals",
  "home-made-value-added-flour": "traditional cooking and baking",
  "health-mix": "quick, convenient home preparation",
  "ghee-and-wood-press-oil": "everyday cooking",
  "bath-and-body-care": "everyday personal care",
  "home-cleaners": "everyday household cleaning",
  "pooja-items": "daily prayer and home rituals",
  "traditional-wheat": "everyday cooking and baking",
  "ready-mix-powder": "quick, convenient meals",
  salts: "seasoning everyday meals",
  "home-made-cosmetics": "everyday personal care",
};

export function createDemoProducts(existingProducts: Product[]): Product[] {
  const existingCounts = new Map<string, number>();
  for (const product of existingProducts) {
    existingCounts.set(
      product.categorySlug,
      (existingCounts.get(product.categorySlug) ?? 0) + 1,
    );
  }

  return Object.entries(demoCategoryCatalog).flatMap(([categorySlug, catalog]) => {
    const category = categories.find((item) => item.slug === categorySlug);
    if (!category) {
      throw new Error(`Unknown demo product category: ${categorySlug}`);
    }

    const existingCount = existingCounts.get(categorySlug) ?? 0;
    const productsNeeded = Math.max(0, 10 - existingCount);
    if (catalog.imageFiles.length < productsNeeded) {
      throw new Error(`Not enough demo product images for ${category.name}`);
    }

    return catalog.imageFiles.slice(0, productsNeeded).map((imageFile, index) => {
      const name = titleFromImageName(imageFile);
      const slug = `${categorySlug}-${slugify(name)}`;
      const sku = `HNL-DEMO-${categorySlug.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${String(existingCount + index + 1).padStart(2, "0")}`;
      const price = catalog.startingPrice + (index % 4) * 20;
      const discountPercentage = 15;
      const image = `/images/products/${catalog.imageDirectory}/${imageFile}`;
      const variants = getPackageOptions(categorySlug, imageFile).map((option) => {
        const variantSku = `${sku}-${slugify(option.name).toUpperCase()}`;
        const variantPrice = Math.round(price * option.multiplier);
        const variantOriginalPrice = Math.round(variantPrice / (1 - discountPercentage / 100));
        return {
          name: option.name,
          weight: option.name,
          price: variantPrice,
          originalPrice: variantOriginalPrice,
          sku: variantSku,
          inStock: true,
        };
      });

      return {
        id: slug,
        slug,
        name,
        categorySlug,
        categoryName: category.name,
        price: variants[0].price,
        originalPrice: variants[0].originalPrice,
        discountPercentage,
        image,
        gallery: [image],
        rating: 0,
        reviewCount: 0,
        stock: 50,
        inStock: true,
        sku,
        shortDescription: `${name} for ${categoryUseCases[categorySlug]}.`,
        description:
          "This sample listing is included for category layout review. Confirm product details, package sizes, ingredients, origin, price, and availability with the supplier before sale.",
        benefits: [],
        ingredients: [],
        howToUse: "Follow the directions on the verified product packaging.",
        origin: "Supplier details pending verification.",
        storage: "Follow the storage instructions on the verified product packaging.",
        variants,
      };
    });
  });
}
