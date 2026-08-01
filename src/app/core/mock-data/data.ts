export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  heatLevel: number; // 0 to 5
  origin: string;
  description: string;
  story: string;
  images: string[];
  stock: number;
  tags: string[];
  usage: string;
  nutritionalInfo: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Rare Peppercorns',
    slug: 'peppercorns',
    description: 'Cracked, smoked, and raw whole peppercorns sourced from remote estates.',
    image: '/images/category-peppercorns.png'
  },
  {
    id: 'cat_2',
    name: 'Ground Spices',
    slug: 'ground-spices',
    description: 'Fine powders ground in small batches to preserve volatile flavor compounds.',
    image: '/images/category-ground.png'
  },
  {
    id: 'cat_3',
    name: 'Spice Blends',
    slug: 'blends',
    description: 'Artisanal spice combinations inspired by global culinary heritage.',
    image: '/images/category-blends.png'
  },
  {
    id: 'cat_4',
    name: 'Whole Spices',
    slug: 'whole-spices',
    description: 'Untouched seed pods, barks, and flower buds bursting with essential oils.',
    image: '/images/category-whole.png'
  },
  {
    id: 'cat_5',
    name: 'Gift Boxes',
    slug: 'gift-boxes',
    description: 'Curated tasting collections and premium spice racks for culinary enthusiasts.',
    image: '/images/category-gifts.png'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Kampot Black Peppercorns',
    category: 'peppercorns',
    price: 18.50,
    rating: 4.9,
    heatLevel: 2,
    origin: 'Kampot Province, Cambodia',
    description: 'Widely regarded as the king of pepper. Grown in mineral-rich quartz soil, offering a complex aroma of eucalyptus, citrus, and sweet pine.',
    story: 'Cultivated at the foot of the Elephant Mountains using traditional organic farming techniques passed down for generations. The maritime breeze and microclimate give these peppercorns an unmatched floral complexity.',
    images: ['/images/kampot-1.png', '/images/kampot-2.png', '/images/kampot-3.png'],
    stock: 24,
    tags: ['single-origin', 'organic', 'award-winning'],
    usage: 'Grind fresh over grilled meats, seafood, ripe strawberries, or fresh pasta dishes.',
    nutritionalInfo: 'Serving Size: 1 tsp (2g). Calories: 6. Total Fat: 0g. Sodium: 0mg. Total Carb: 1g. Protein: 0g.'
  },
  {
    id: 'prod_2',
    name: 'Vibrant Kashmiri Chili',
    category: 'ground-spices',
    price: 12.90,
    rating: 4.8,
    heatLevel: 3,
    origin: 'Kashmiri Valley, India',
    description: 'A brilliant crimson red chili powder that offers a warm, glowing color and deep fruity undertones with a very mild, manageable heat profile.',
    story: 'Harvested by hand in the temperate valley of Kashmir. Our chilis are dried in the shade to protect their natural moisture before being stone-ground into a fine crimson powder.',
    images: ['/images/kashmiri-1.png', '/images/kashmiri-2.png'],
    stock: 45,
    tags: ['stone-ground', 'vibrant-color', 'mild-heat'],
    usage: 'Essential for tandoori marinades, butter chicken, rich stews, and roasted root vegetables.',
    nutritionalInfo: 'Serving Size: 1 tsp (2g). Calories: 8. Total Fat: 0.3g. Sodium: 1mg. Total Carb: 1.2g. Protein: 0.3g.'
  },
  {
    id: 'prod_3',
    name: 'Wild Forest Tellicherry',
    category: 'peppercorns',
    price: 15.00,
    rating: 4.7,
    heatLevel: 2,
    origin: 'Malabar Coast, India',
    description: 'Extra-large Tellicherry TGSEB grade peppercorns left on the vine longer to mature, resulting in sweet, full-bodied spice with citrus notes.',
    story: 'Sourced from wild-growing vines in the moist tropical forests of Kerala. Leaving the berries on the vine longer allows them to swell and develop complex natural sugars that balance their sharp kick.',
    images: ['/images/tellicherry-1.png', '/images/tellicherry-2.png'],
    stock: 18,
    tags: ['single-origin', 'small-batch', 'extra-large'],
    usage: 'Excellent as a general table pepper, in pepper sauces, cacio e pepe, and dry rubs.',
    nutritionalInfo: 'Serving Size: 1 tsp (2g). Calories: 7. Total Fat: 0g. Sodium: 0mg. Total Carb: 1.3g. Protein: 0.2g.'
  },
  {
    id: 'prod_4',
    name: 'Imperial Saffron Threads',
    category: 'whole-spices',
    price: 34.00,
    rating: 5.0,
    heatLevel: 0,
    origin: 'Herat Province, Afghanistan',
    description: 'Super Negin grade saffron threads of exceptional purity. Yields an intense golden-yellow infusion with deep floral and honeyed notes.',
    story: 'Every single crimson thread is carefully plucked by hand from the purple Crocus sativus flower at sunrise. It takes approximately 150,000 flowers to produce just one kilogram of this culinary gold.',
    images: ['/images/saffron-1.png', '/images/saffron-2.png'],
    stock: 12,
    tags: ['rare', 'hand-harvested', 'organic'],
    usage: 'Steep a pinch of threads in warm water or milk for 15 minutes before adding to paella, risotto, or desserts.',
    nutritionalInfo: 'Serving Size: 0.1g. Calories: 0. Total Fat: 0g. Sodium: 0mg. Total Carb: 0g. Protein: 0g.'
  },
  {
    id: 'prod_5',
    name: 'Smoked Aleppo Pepper Flakes',
    category: 'ground-spices',
    price: 14.50,
    rating: 4.9,
    heatLevel: 2,
    origin: 'Aleppo Region, Syria / Turkey Border',
    description: 'Coarse, seedless pepper flakes dried under the Mediterranean sun, oiled with cotton seed oil, and lightly salted. Mildly hot and tangy.',
    story: 'Grown on small family farms near the historical silk road routes. The pods are partially dried, de-seeded, coarsely ground, and cured with a touch of oil and salt to preserve their moist, shiny texture and raisin-like sweetness.',
    images: ['/images/aleppo-1.png', '/images/aleppo-2.png'],
    stock: 32,
    tags: ['cured-flakes', 'sun-dried', 'tangy-spice'],
    usage: 'Sprinkle over hummus, roasted vegetables, fried eggs, avocado toast, or grilled fish.',
    nutritionalInfo: 'Serving Size: 1 tsp (2g). Calories: 9. Total Fat: 0.4g. Sodium: 35mg. Total Carb: 1g. Protein: 0.3g.'
  },
  {
    id: 'prod_6',
    name: 'Shichimi Togarashi (7-Spice)',
    category: 'blends',
    price: 13.00,
    rating: 4.8,
    heatLevel: 4,
    origin: 'Tokyo, Japan',
    description: 'A traditional Japanese spice blend containing chili flakes, orange peel, sesame seeds, ginger, nori seaweed, and wild Sansho pepper.',
    story: 'Crafted according to an 18th-century herbalist recipe. The complex layering of zesty citrus, nutty sesame, sea-fresh nori, and the tongue-tingling Sansho pepper creates an unforgettable umami sensation.',
    images: ['/images/shichimi-1.png', '/images/shichimi-2.png'],
    stock: 50,
    tags: ['umami-blend', 'citrus-notes', 'artisan'],
    usage: 'Shake onto ramen, noodle soups, grilled meats, tempura, or warm edamame.',
    nutritionalInfo: 'Serving Size: 1 tsp (2g). Calories: 8. Total Fat: 0.2g. Sodium: 5mg. Total Carb: 1g. Protein: 0.2g.'
  },
  {
    id: 'prod_7',
    name: 'Smoked Bourbon Vanilla Beans',
    category: 'whole-spices',
    price: 22.00,
    rating: 4.9,
    heatLevel: 0,
    origin: 'Sava Region, Madagascar',
    description: 'Plump, glossy, and highly aromatic vanilla pods cured to perfection, then lightly cold-smoked over bourbon oak casks for a woody undertone.',
    story: 'Pollinated by hand on the day of blooming. These gourmet vanilla beans are cured over several months, developing millions of tiny caviar-like seeds packed with rich vanillin.',
    images: ['/images/vanilla-1.png', '/images/vanilla-2.png'],
    stock: 15,
    tags: ['hand-pollinated', 'smoked', 'gourmet'],
    usage: 'Slice open, scrape out seeds and add to custards, creams, pastries, or savory lobster sauces.',
    nutritionalInfo: 'Serving Size: 1 pod. Calories: 5. Total Fat: 0g. Sodium: 0mg. Total Carb: 1g. Protein: 0g.'
  },
  {
    id: 'prod_8',
    name: 'Grand Spice Merchant Cabinet',
    category: 'gift-boxes',
    price: 95.00,
    rating: 5.0,
    heatLevel: 0,
    origin: 'Global Curated',
    description: 'A handcrafted wooden spice chest featuring six of our signature spices in premium glass jars, complete with a brass measuring spoon.',
    story: 'Designed for the ultimate home cook. This collector cabinet features a curated rotation of our finest single-origin harvests: Kampot Pepper, Kashmiri Chili, Saffron, Aleppo Flakes, Wild Cardamom, and Sumac.',
    images: ['/images/cabinet-1.png', '/images/cabinet-2.png'],
    stock: 8,
    tags: ['gift-collection', 'artisan-woodwork', 'signature-spices'],
    usage: 'The perfect centerpiece for a food lover\'s kitchen. Jars are fully refillable.',
    nutritionalInfo: 'Various nutritional values apply per spice jar included.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Chef Marcus Vance',
    role: 'Michelin Star Restaurateur',
    rating: 5,
    comment: 'The Kampot peppercorns have completely transformed our signature steak au poivre. The depth of flavor, the notes of citrus and eucalyptus, are simply not found in generic suppliers.',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'test_2',
    name: 'Elena Rostova',
    role: 'Home Gastronomer',
    rating: 5,
    comment: 'I never realized saffron could taste this pure. A tiny pinch of their Negin saffron turns a simple rice pilaf into a golden, fragrant masterpiece. Sourcing is absolutely top tier.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 'test_3',
    name: 'Daniel Harrison',
    role: 'BBQ Pitmaster & Author',
    rating: 5,
    comment: 'The Aleppo pepper flakes are my secret weapon. They add a gorgeous moisture, tanginess, and warm glow to my dry rubs. The aroma when opening the jar is intoxicating.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  }
];
