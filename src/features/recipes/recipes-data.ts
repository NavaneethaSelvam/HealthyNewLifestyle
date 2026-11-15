export interface Recipe {
  id: string;
  title: string;
  tamilTitle: string;
  image: string;
  cookTime: string;
  serves: string;
  category: string;
  summary: string;
  featuredProduct: {
    name: string;
    slug: string;
  };
  ingredients: string[];
  steps: string[];
}

export const recipes: Recipe[] = [
  {
    id: "karuppu-kavuni-sweet-pongal",
    title: "Heritage Karuppu Kavuni Sweet Porridge",
    tamilTitle: "கருப்பு கவுனி இனிப்பு பொங்கல்",
    image: "/images/recipes/recipe-traditional-rice.jpg",
    cookTime: "40 mins (Soaking: 4 hrs)",
    serves: "4 persons",
    category: "Traditional Rice",
    summary:
      "A sweet porridge prepared with black rice, palm jaggery (karupatti), and cardamom.",
    featuredProduct: {
      name: "Karuppu Kavuni Black Rice",
      slug: "karuppu-kavuni-black-rice",
    },
    ingredients: [
      "1 cup Karuppu Kavuni Black Rice (soaked 4 hours)",
      "3/4 cup Palm Jaggery (Karupatti), grated",
      "3 cups Fresh Water",
      "1/2 cup Coconut Milk or fresh milk",
      "4 Cardamom pods, crushed",
      "1 tbsp ghee",
      "10 Cashews and Raisins",
    ],
    steps: [
      "Wash and soak Karuppu Kavuni rice in 3 cups of water for at least 4 hours.",
      "Pressure cook the soaked rice with the soaking water for 5-6 whistles on medium flame until soft.",
      "Melt palm jaggery in 1/4 cup water, strain, and bring to a simmer.",
      "Add the melted jaggery syrup and cardamom to the cooked black rice. Mash lightly and simmer for 5 minutes.",
      "Stir in coconut milk, roast cashews in ghee until golden, and pour over the porridge. Serve warm.",
    ],
  },
  {
    id: "foxtail-millet-lemon-rice",
    title: "Thinai (Foxtail Millet) Lemon Rice",
    tamilTitle: "தினை எலுமிச்சை சாதம்",
    image: "/images/recipes/recipe-millet-breakfast.jpg",
    cookTime: "25 mins",
    serves: "3 persons",
    category: "Millets",
    summary:
      "A tangy tempered grain dish made with foxtail millet, groundnut oil, and curry leaves.",
    featuredProduct: {
      name: "Organic Foxtail Millet (Thinai)",
      slug: "organic-foxtail-millet",
    },
    ingredients: [
      "1 cup Foxtail Millet (Thinai), washed",
      "2 cups Water",
      "2 tbsp Wood Pressed Groundnut Oil",
      "1 tsp Mustard Seeds",
      "1 tsp Chana Dal & Urad Dal",
      "1/2 tsp Turmeric Powder",
      "Juice of 1 fresh lemon",
      "2 Green chillies, slit",
      "Fresh curry leaves and roasted peanuts",
    ],
    steps: [
      "Cook foxtail millet with 2 cups water (either in a pot or open pressure cooker for 1 whistle). Allow grains to cool completely.",
      "Heat groundnut oil in a pan. Splutter mustard seeds, then add lentils, peanuts, and green chillies.",
      "Add turmeric powder and curry leaves. Turn off the flame.",
      "Stir in freshly squeezed lemon juice and salt.",
      "Gently fold the tempered mixture into the cooled millet grains. Garnish with fresh coriander.",
    ],
  },
  {
    id: "sprouted-ragi-nutri-malt",
    title: "Warm Sprouted Ragi & Almond Nutri-Malt",
    tamilTitle: "முளைகட்டிய ராகி சத்து கஞ்சி",
    image: "/images/recipes/recipe-healthy-drinks.jpg",
    cookTime: "10 mins",
    serves: "2 persons",
    category: "Health Mix",
    summary:
      "A South Indian breakfast drink made with sprouted finger millet, pulses, nuts, and palm sugar.",
    featuredProduct: {
      name: "Sprouted Ragi Health Mix",
      slug: "sprouted-ragi-health-mix",
    },
    ingredients: [
      "2 tbsp Sprouted Ragi Health Mix",
      "1.5 cups Water or fresh warm milk",
      "1 tbsp Palm Sugar or Karupatti Powder",
      "Pinch of Cardamom and Dry Ginger (Sukku)",
    ],
    steps: [
      "In a small bowl, whisk 2 tablespoons of health mix into 1/2 cup of cold water until smooth.",
      "Bring the remaining 1 cup of water or milk to a gentle simmer in a saucepan.",
      "Slowly pour the dissolved paste into the simmering pan while stirring continuously.",
      "Cook on low flame for 4 to 5 minutes until it thickens.",
      "Sweeten with palm sugar or honey, stir well, and serve warm.",
    ],
  },
  {
    id: "traditional-garlic-kuzhambu",
    title: "Chekku Nalla Ennai Poondu Kuzhambu",
    tamilTitle: "மரச்செக்கு நல்லெண்ணெய் பூண்டு குழம்பு",
    image: "/images/recipes/recipe-traditional-meals.jpg",
    cookTime: "30 mins",
    serves: "4 persons",
    category: "Wood-Pressed Oils",
    summary:
      "A tangy curry made with garlic, shallots, tamarind, and gingelly oil.",
    featuredProduct: {
      name: "Cold Wood-Pressed Sesame Oil",
      slug: "wood-pressed-sesame-oil",
    },
    ingredients: [
      "1/4 cup Wood Pressed Sesame Oil (Marachekku Nalla Ennai)",
      "25 country garlic cloves, peeled",
      "15 small shallots (chinna vengayam), peeled",
      "1 lemon-sized ball of Tamarind, soaked in 2 cups warm water",
      "2 tbsp Sambar / Kulambu Chilly Powder",
      "1 tsp Fenugreek seeds (vendhayam)",
      "1 sprig fresh curry leaves",
      "1/2 tsp Turmeric powder and rock salt to taste",
    ],
    steps: [
      "Heat sesame oil in a clay pot or heavy pan. Add fenugreek seeds and let them turn golden.",
      "Add peeled garlic cloves and shallots. Sauté on medium flame until garlic is translucent.",
      "Add curry leaves, turmeric powder, sambar powder, tamarind extract, and rock salt.",
      "Bring to a boil, then reduce the flame. Simmer for 15 minutes until the sauce thickens.",
      "Allow to rest before serving with steamed rice.",
    ],
  },
  {
    id: "sprouted-ragi-dosa",
    title: "Sprouted Ragi Dosa",
    tamilTitle: "முளைகட்டிய ராகி தோசை",
    image: "/images/recipes/recipe-ragi-dosa.jpg",
    cookTime: "25 mins (Resting: 15 mins)",
    serves: "3 persons",
    category: "Ragi Dosa",
    summary:
      "A savoury dosa made with sprouted ragi health mix, rice flour, cumin, and curry leaves.",
    featuredProduct: {
      name: "Sprouted Ragi Health Mix",
      slug: "sprouted-ragi-health-mix",
    },
    ingredients: [
      "1 cup Sprouted Ragi Health Mix",
      "1/2 cup rice flour",
      "1/4 cup plain curd",
      "1/2 tsp cumin seeds",
      "1 small onion, finely chopped",
      "1 green chilli, finely chopped",
      "Curry leaves and salt to taste",
      "Water and oil as needed",
    ],
    steps: [
      "Whisk the ragi health mix, rice flour, curd, salt, and enough water into a smooth, pourable batter.",
      "Rest the batter for 15 minutes, then stir in cumin, onion, chilli, and chopped curry leaves.",
      "Heat a lightly oiled dosa pan and pour a ladle of batter, spreading it into a thin circle.",
      "Cook until the edges turn crisp, flip briefly if needed, and serve hot.",
    ],
  },
  {
    id: "mappillai-samba-idli",
    title: "Mappillai Samba Idli",
    tamilTitle: "மாப்பிள்ளை சம்பா இட்லி",
    image: "/images/recipes/recipe-idli.jpg",
    cookTime: "30 mins (Soaking & fermenting: 8 hrs)",
    serves: "4 persons",
    category: "Traditional Breakfast",
    summary:
      "Soft, steamed idlis made with traditional Mappillai Samba rice and urad dal.",
    featuredProduct: {
      name: "Native Mappillai Samba Red Rice",
      slug: "mappillai-samba-rice",
    },
    ingredients: [
      "2 cups Mappillai Samba rice",
      "1 cup whole urad dal",
      "1/2 tsp fenugreek seeds",
      "Salt to taste",
      "Water as needed",
      "A little oil for greasing the idli plates",
    ],
    steps: [
      "Rinse and soak the rice separately from the urad dal and fenugreek for 6 hours.",
      "Grind the urad dal and fenugreek until fluffy, then grind the rice to a slightly grainy batter.",
      "Combine both batters with salt and leave covered in a warm place to ferment until risen.",
      "Lightly grease idli plates, fill with batter, and steam for 10 to 12 minutes.",
      "Let the idlis rest briefly before removing and serving with chutney or sambar.",
    ],
  },
  {
    id: "red-rice-aval-chivda",
    title: "Spiced Red Rice Aval Chivda",
    tamilTitle: "கார அவல் மிக்ஸ்",
    image: "/images/recipes/recipe-homemade-snacks.jpg",
    cookTime: "20 mins",
    serves: "4 persons",
    category: "Homemade Snacks",
    summary:
      "A crunchy homemade snack of red rice aval tossed with peanuts, roasted gram, and curry leaves.",
    featuredProduct: {
      name: "Traditional Red Rice Aval",
      slug: "traditional-red-rice-aval",
    },
    ingredients: [
      "2 cups Traditional Red Rice Aval",
      "2 tbsp groundnut oil",
      "1/4 cup peanuts",
      "2 tbsp roasted gram",
      "1/2 tsp mustard seeds",
      "1/4 tsp turmeric powder",
      "A pinch of chilli powder",
      "Curry leaves and salt to taste",
    ],
    steps: [
      "Gently roast the aval in a dry pan until crisp, then set it aside.",
      "Heat groundnut oil, splutter mustard seeds, and add peanuts and curry leaves.",
      "Stir in the roasted gram, turmeric, chilli powder, and salt.",
      "Add the aval and toss over low heat until evenly coated and crisp.",
      "Cool completely before serving or storing in an airtight container.",
    ],
  },
  {
    id: "karupatti-ellu-urundai",
    title: "Karupatti Ellu Urundai",
    tamilTitle: "கருப்பட்டி எள்ளு உருண்டை",
    image: "/images/recipes/recipe-traditional-sweets.jpg",
    cookTime: "25 mins",
    serves: "12 balls",
    category: "Traditional Sweets",
    summary:
      "A traditional sweet made by binding toasted sesame seeds with a warm palm-jaggery syrup.",
    featuredProduct: {
      name: "Pure Palm Jaggery (Karupatti)",
      slug: "pure-palm-jaggery-karupatti",
    },
    ingredients: [
      "1 cup sesame seeds",
      "3/4 cup grated Palm Jaggery (Karupatti)",
      "1/4 cup water",
      "1/4 tsp cardamom powder",
      "1 tsp ghee for greasing your hands",
    ],
    steps: [
      "Toast the sesame seeds in a dry pan over low heat until fragrant, then set aside.",
      "Dissolve the palm jaggery in water and strain the syrup into a clean pan.",
      "Simmer the syrup until it reaches a firm, sticky consistency when tested in cool water.",
      "Turn off the heat, mix in the sesame seeds and cardamom, and stir quickly.",
      "When cool enough to handle, grease your hands lightly and shape the mixture into small balls.",
    ],
  },
];
