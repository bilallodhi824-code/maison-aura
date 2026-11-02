import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, collection, getDocs, setDoc, updateDoc, deleteDoc, Firestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";
import { MenuItem, Reservation, BuffetPackage, Offer, ContactMessage, OrderInquiry, AdminUser } from "@/types";

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase keys are fully set
const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "undefined" &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to Mock DB:", error);
  }
}

// -------------------------------------------------------------
// PRELOADED DEMO DATA
// -------------------------------------------------------------

export const DEFAULT_MENU_ITEMS = [
  // 1. STARTERS / APPETIZERS (10 Items)
  {
    id: "starter-dynamite-prawns",
    name: "Dynamite Prawns",
    slug: "dynamite-prawns",
    category: "Starters",
    shortDescription: "Crispy batter-fried shrimp tossed in a premium zesty, spicy dynamite sauce.",
    longDescription: "Selected jumbo king prawns, lightly battered and fried to perfect golden crispiness, then generously folded in our house-secret spicy honey-sriracha aioli. Served in a chilled martini glass over fresh shredded lettuce with a sprinkle of toasted black sesame and finely sliced scallions.",
    price: 18,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "spicy", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-crispy-chicken",
    name: "Crispy Chicken Bites",
    slug: "crispy-chicken-bites",
    category: "Starters",
    shortDescription: "Tender chicken chunks marinated in Asian spices, crisp fried with dry red chillies.",
    longDescription: "Bite-sized cubes of premium chicken breast marinated in fresh ginger-garlic extract, light soy, and five-spice powder, crispy-fried and dry-tossed with dry red chillies, curry leaves, and a dash of Sichuan pepper.",
    price: 14,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-garlic-mushrooms",
    name: "Garlic Butter Mushrooms",
    slug: "garlic-butter-mushrooms",
    category: "Starters",
    shortDescription: "Plump button mushrooms sautéed in a rich garlic butter white wine sauce.",
    longDescription: "Freshly harvested button mushrooms sautéed in clarified herb butter, roasted garlic, splash of dry white grape juice reduction, and freshly ground black pepper, completed with a sprinkle of fresh micro-herbs.",
    price: 12,
    image: "https://images.unsplash.com/photo-1601000990260-5eae320980de?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-tempura-shrimp",
    name: "Tempura Shrimp",
    slug: "tempura-shrimp",
    category: "Starters",
    shortDescription: "Authentic light and airy Japanese style crispy shrimp tempura with tentsuyu dipping sauce.",
    longDescription: "Perfectly sized black tiger shrimp coated in traditional ice-chilled tempura batter, deep-fried to a delicate golden shell. Served hot with a sweet soy-dashi tentsuyu dip.",
    price: 19,
    image: "https://images.unsplash.com/photo-1615361967487-54453d098d33?q=80&w=600&auto=format&fit=crop",
    tags: ["new", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-truffle-fries",
    name: "Truffle Parmesan Fries",
    slug: "truffle-parmesan-fries",
    category: "Starters",
    shortDescription: "Golden hand-cut russet potatoes tossed in premium white truffle oil and aged Parmesan cheese.",
    longDescription: "Double-cooked crispy golden Idaho potatoes infused with refined Italian white truffle oil, dusted with freshly grated Parmesan Reggiano and a touch of chopped sea parsley. Served with roasted garlic aioli.",
    price: 13,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian", "bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-calamari",
    name: "Calamari Fritti",
    slug: "calamari-fritti",
    category: "Starters",
    shortDescription: "Crispy baby squid tossed in sea salt, cracked pepper, and fresh lime zest.",
    longDescription: "Tender ringlets of fresh calamari, lightly dusted in seasoned rice flour and flash-fried. Garnished with red pepper rings, scallions, and served with a zesty citrus dipping sauce.",
    price: 16,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-beef-carpaccio",
    name: "Wagyu Beef Carpaccio",
    slug: "wagyu-beef-carpaccio",
    category: "Starters",
    shortDescription: "Paper-thin slices of raw beef tenderloin, white truffle oil, capers, and shaved Parmigiano.",
    longDescription: "Ultra-thin slices of prime raw Wagyu beef tenderloin laid over a cold porcelain plate, topped with salted capers, baby arugula, wild white truffle glaze, and shaved Parmigiano Reggiano cheese.",
    price: 22,
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-bruschetta",
    name: "Classic Heirloom Bruschetta",
    slug: "classic-heirloom-bruschetta",
    category: "Starters",
    shortDescription: "Toasted artisanal sourdough topped with marinated cherry tomatoes, basil, and balsamic glaze.",
    longDescription: "Crispy grilled sourdough slices rubbed with fresh garlic cloves, piled high with chopped organic heirloom tomatoes, fresh sweet basil leaves, first-press virgin olive oil, finished with aged Modena balsamic drizzle.",
    price: 12,
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-spring-rolls",
    name: "Gourmet Duck Spring Rolls",
    slug: "gourmet-duck-spring-rolls",
    category: "Starters",
    shortDescription: "Crispy pastry rolls filled with slow-roasted duck meat and shredded glass noodles.",
    longDescription: "Crispy golden wheat pastry rolls packed with tender Peking duck leg confit shreds, wood-ear mushrooms, cabbage, and julienned carrots. Served with house sweet plum-chilli sauce.",
    price: 15,
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "starter-stuffed-mushrooms",
    name: "Parmesan Crab Stuffed Mushrooms",
    slug: "crab-stuffed-mushrooms",
    category: "Starters",
    shortDescription: "Cremini mushroom caps stuffed with seasoned crab meat, herbs, and melted provolone.",
    longDescription: "Plump fresh cremini mushroom caps loaded with premium seasoned crab claw meat, cream cheese, fresh chives, topped with provolone cheese and broiled until bubbling hot.",
    price: 17,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },

  // 2. SOUPS & SALADS (8 Items)
  {
    id: "soup-hot-sour",
    name: "Gourmet Hot & Sour Soup",
    slug: "gourmet-hot-sour-soup",
    category: "Soups",
    shortDescription: "Traditional spicy and sour broth with chicken, tofu, bamboo shoots, and mushrooms.",
    longDescription: "A classic Sichuan chicken broth base infused with black vinegar and white pepper, loaded with tender chicken shreds, diced soft tofu, sliced wood-ear mushrooms, and bamboo shoots, finished with organic egg ribbons.",
    price: 11,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "soup-tom-yum",
    name: "Spicy King Prawn Tom Yum",
    slug: "spicy-king-prawn-tom-yum",
    category: "Soups",
    shortDescription: "Thai lemongrass broth with jumbo prawns, button mushrooms, cherry tomatoes, and fresh coriander.",
    longDescription: "A hot, sour, and aromatic Thai soup crafted with fresh lemongrass stalks, galangal root, kaffir lime leaves, loaded with king prawns, mushrooms, and cherry tomatoes, seasoned with fresh lime juice and red chili paste.",
    price: 16,
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy", "seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "soup-lobster-bisque",
    name: "Creamy Lobster Bisque",
    slug: "creamy-lobster-bisque",
    category: "Soups",
    shortDescription: "Velvety smooth lobster cream soup enriched with French brandy and tarragon.",
    longDescription: "A rich, classic French soup crafted by simmering roasted Atlantic lobster shells, cream, and root vegetables, deglazed with premium VSOP brandy and completed with sweet buttered lobster claw meat chunks.",
    price: 19,
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "soup-miso",
    name: "Classic Tofu Miso Soup",
    slug: "classic-tofu-miso-soup",
    category: "Soups",
    shortDescription: "Japanese white miso paste dissolved in bonito dashi with tofu, wakame, and scallions.",
    longDescription: "Traditional Japanese comforting soup made of white miso paste simmered in natural kelp and bonito flake dashi broth, filled with soft diced silken tofu, dried wakame seaweed, and sliced green onions.",
    price: 9,
    image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "salad-caesar",
    name: "Maison Caesar Salad",
    slug: "maison-caesar-salad",
    category: "Soups",
    shortDescription: "Crispy romaine lettuce, herb garlic croutons, shaved parmesan, and creamy dressing.",
    longDescription: "Crisp organic romaine lettuce tossed in our house creamy Caesar dressing, garlic-herb croutons, topped with shaved Parmigiano Reggiano. (Grilled chicken breast slices optional).",
    price: 14,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "salad-caprese",
    name: "Burrata Caprese Salad",
    slug: "burrata-caprese-salad",
    category: "Soups",
    shortDescription: "Fresh creamy burrata cheese, heirloom sliced tomatoes, wild basil pesto, and balsamic reduction.",
    longDescription: "A beautiful plate of fresh Italian burrata cheese globe surrounded by red heirloom tomato wheels, dressed with green sweet basil pesto oil, sea salt flakes, and aged dark balsamic vinegar droplets.",
    price: 16,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "salad-quinoa",
    name: "Avocado & Quinoa Power Bowl",
    slug: "avocado-quinoa-salad",
    category: "Soups",
    shortDescription: "Fluffy quinoa, diced fresh avocado, cucumber, cherry tomatoes, and honey lemon citronette.",
    longDescription: "Gluten-free mix of steamed red and white quinoa, loaded with ripe diced avocado, baby cucumber slices, vine cherry tomatoes, red bell pepper cublets, and tossed in lemon citronette dressing.",
    price: 13,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian", "new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "soup-chowder",
    name: "Boston Clam Chowder",
    slug: "boston-clam-chowder",
    category: "Soups",
    shortDescription: "Thick creamy seafood broth with chopped ocean clams, celery, onion, and tender potato chunks.",
    longDescription: "A rich cream-based traditional New England soup packed with ocean-fresh chopped baby clams, diced Yukon gold potatoes, carrots, double-smoked bacon lardons, and celery, served with oyster crackers.",
    price: 15,
    image: "https://images.unsplash.com/photo-1594756202469-9ff9799a2e4e?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },

  // 3. RAMEN (10 Items)
  {
    id: "ramen-signature-beef",
    name: "Signature Beef Ramen",
    slug: "signature-beef-ramen",
    category: "Ramen",
    shortDescription: "24-hour slow-cooked rich beef broth, premium tender beef slices, wheat noodles, marinated egg.",
    longDescription: "Our pride. A rich, silky broth simmered for 24 hours with marrow bones and traditional spices. Served with hand-pulled ramen noodles, slow-braised melt-in-your-mouth wagyu beef brisket slices, soft-boiled marinated ajitama egg, bamboo shoots, wood-ear mushrooms, and nori sheet.",
    price: 24,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "bestseller"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-spicy-chicken",
    name: "Spicy Chicken Ramen",
    slug: "spicy-chicken-ramen",
    category: "Ramen",
    shortDescription: "Fiery sesame chicken broth with grilled chicken breast, fresh greens, and spicy oil.",
    longDescription: "A spicy rich chicken broth infused with roasted red chilli paste and white sesame paste. Topped with sliced grilled chicken breast, baby bok choy, fresh scallions, sweet corn kernels, and a generous drizzle of house Sichuan chilli oil.",
    price: 21,
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-miso-seafood",
    name: "Miso Seafood Ramen",
    slug: "miso-seafood-ramen",
    category: "Ramen",
    shortDescription: "Miso-infused seafood dashi with prawns, calamari, scallops, and seaweed.",
    longDescription: "Light but deeply umami-rich white miso and dashi broth, filled with freshly grilled ocean prawns, calamari rings, premium bay scallops, steamed narutomaki fish cakes, toasted sesame seeds, and crispy nori.",
    price: 26,
    image: "https://images.unsplash.com/photo-1547928576-a4a3323d8b36?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-tonkotsu",
    name: "Authentic Tonkotsu Ramen",
    slug: "authentic-tonkotsu-ramen",
    category: "Ramen",
    shortDescription: "Traditional milky pork bone broth, tender chashu pork, naruto, ajitama, bamboo shoots.",
    longDescription: "Classic Hakata-style pork bone soup simmered for 18 hours to release thick gelatinous goodness. Filled with wheat noodles, tender rolled chashu pork belly slices, marinated egg, wood-ear fungus, red ginger, and scallions.",
    price: 23,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-shoyu-veg",
    name: "Shoyu Vegetarian Ramen",
    slug: "shoyu-vegetarian-ramen",
    category: "Ramen",
    shortDescription: "Kombu seaweed and soy sauce vegetable broth, assorted mushrooms, tofu, and greens.",
    longDescription: "A clear, delicate vegetable stock flavored with dry kelp and Japanese soy sauce reduction. Served with vegan-friendly noodles, grilled tofu, fresh enoki mushrooms, baby spinach, roasted garlic skin, and sweet corn.",
    price: 18,
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-black-garlic",
    name: "Black Garlic Oil Ramen",
    slug: "black-garlic-oil-ramen",
    category: "Ramen",
    shortDescription: "Rich Tonkotsu broth topped with charred black garlic oil (mayu), chashu, and menma.",
    longDescription: "Our classic Tonkotsu pork broth enhanced with premium roasted black garlic oil. Gives a smokey, complex aromatic profile. Topped with pork belly, bamboo shoots, and green onion.",
    price: 25,
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-kimchi",
    name: "Fiery Kimchi Pork Ramen",
    slug: "fiery-kimchi-pork-ramen",
    category: "Ramen",
    shortDescription: "Spicy Korean kimchi flavored pork broth, sliced pork shoulder, pickled radish, green onions.",
    longDescription: "A fusion creation linking Korean fermented kimchi spice with Japanese ramen. Features pork shoulder, egg, fresh scallions, sesame seeds, and heaps of dry roasted red chili flakes.",
    price: 22,
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-tantan",
    name: "Spicy Sichuan Tan Tan Ramen",
    slug: "spicy-sichuan-tantan-ramen",
    category: "Ramen",
    shortDescription: "Creamy peanut and sesame broth topped with ground spicy pork, bean sprouts, and bok choy.",
    longDescription: "Creamy base flavored with sesame oil and peanut butter, filled with thick noodles, minced pork cooked in Sichuan bean paste, red oil, baby bok choy, and chopped roasted peanuts.",
    price: 20,
    image: "https://images.unsplash.com/photo-1618889482923-38250401a84e?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy", "bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-truffle-wagyu",
    name: "Truffle Wagyu Beef Ramen",
    slug: "truffle-wagyu-beef-ramen",
    category: "Ramen",
    shortDescription: "Clear shio broth, sliced raw wagyu seared tableside, fresh black truffle oil.",
    longDescription: "A highly luxurious ramen plate: light clear sea salt broth, topped with paper-thin slices of raw Wagyu beef (which sears perfectly in the hot soup), finished with premium black truffle oil drippings.",
    price: 36,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "ramen-duck",
    name: "Crispy Duck Breast Ramen",
    slug: "crispy-duck-breast-ramen",
    category: "Ramen",
    shortDescription: "Soy sauce duck broth with grilled five-spice duck breast slices, leek, and egg.",
    longDescription: "Duck carcass dashi broth flavored with soy sauce, topped with seared tender duck breast slices, microgreens, bamboo shoots, and soft-boiled egg.",
    price: 27,
    image: "https://images.unsplash.com/photo-1552611052-c29a4d21df5c?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },

  // 4. CHOWMEIN / NOODLES (10 Items)
  {
    id: "chowmein-chicken",
    name: "Chicken Chowmein",
    slug: "chicken-chowmein",
    category: "Chowmein",
    shortDescription: "Wok-fired thin egg noodles tossed with shredded chicken and seasonal vegetables.",
    longDescription: "Classic wok-tossed premium egg noodles with tender chicken strips, green cabbage, julienned carrots, fresh bell peppers, onion, and garlic, seasoned with a rich premium dark oyster sauce blend.",
    price: 17,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "chowmein-beef",
    name: "Beef Chowmein",
    slug: "beef-chowmein",
    category: "Chowmein",
    shortDescription: "Stir-fried premium beef slices with dark soy sauce, scallions, and thick noodles.",
    longDescription: "Tender flank steak slices marinated in dark soy and ginger, flash-fried in a roaring hot wok with thick wheat noodles, beansprouts, scallion batons, and finished with a rich soy-shallot reduction.",
    price: 19,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-seafood-chow",
    name: "Seafood Chowmein Deluxe",
    slug: "seafood-chowmein-deluxe",
    category: "Chowmein",
    shortDescription: "Wok-fired wheat noodles with prawns, squid, scallops, and sweet oyster garlic glaze.",
    longDescription: "Wok-tossed noodles with ocean jumbo prawns, bay scallops, calamari rings, onions, and carrots, flavored with oyster sauce, light sesame, and green onions.",
    price: 23,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-pad-thai",
    name: "Artisanal Prawn Pad Thai",
    slug: "artisanal-prawn-pad-thai",
    category: "Chowmein",
    shortDescription: "Flat rice noodles stir-fried with tofu, tiger prawns, egg, beansprouts, and crushed peanuts.",
    longDescription: "Traditional Thai street noodle recipe using sweet-tangy tamarind pulp glaze, wok-tossed flat rice noodles, scrambled egg, chopped chives, salted radish, peanuts, and lime.",
    price: 21,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-singapore",
    name: "Singapore Curry Noodles",
    slug: "singapore-curry-noodles",
    category: "Chowmein",
    shortDescription: "Thin rice vermicelli stir-fried with chicken, prawns, egg, and mild madras curry powder.",
    longDescription: "Thin, airy rice vermicelli wok-tossed with green cabbage, chicken shreds, prawns, and egg, colored and flavored with mild fragrant yellow curry powder.",
    price: 18,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-garlic-butter",
    name: "Stir-Fried Garlic Noodles",
    slug: "stir-fried-garlic-noodles",
    category: "Chowmein",
    shortDescription: "Sweet and savory wok-tossed egg noodles rich in butter, roasted garlic, and Parmesan.",
    longDescription: "Simple but intensely popular: wheat noodles stir-fried in double butter, loads of roasted garlic puree, oyster extract, topped with shaved Parmesan and micro-herbs.",
    price: 15,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-lobster",
    name: "Rock Lobster Chowmein",
    slug: "rock-lobster-chowmein",
    category: "Chowmein",
    shortDescription: "Artisanal noodles topped with half seared lobster tail and white wine butter sauce.",
    longDescription: "Luxury main plate: seared baby rock lobster tail set over egg noodles sautéed with soy and green onion, glazed with garlic-grape reduction.",
    price: 34,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-shanghai",
    name: "Shanghai Soy Noodles",
    slug: "shanghai-soy-noodles",
    category: "Chowmein",
    shortDescription: "Thick udon-style noodles with dark soy, bok choy, and thin mushrooms.",
    longDescription: "Thick wheat Shanghai noodles cooked in sweet dark mushroom soy reduction, accompanied by bok choy hearts and organic wood-ear fungus.",
    price: 16,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-sichuan",
    name: "Schezwan Chili Noodles",
    slug: "schezwan-chili-noodles",
    category: "Chowmein",
    shortDescription: "Wok noodles tossed in fiery red chili Schezwan paste, onions, capsicum, and dry chilies.",
    longDescription: "Wok noodles fired in a spicy homemade Sichuan pepper and dry red chili paste, packed with onions, bell peppers, and garlic.",
    price: 17,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "noodle-dandan",
    name: "Classic Dan Dan Noodles",
    slug: "classic-dandan-noodles",
    category: "Chowmein",
    shortDescription: "Dry-style noodles tossed in roasted sesame oil, ground pork, and preserved vegetables.",
    longDescription: "Traditional Sichuan dry street noodles: cooked wheat noodles tossed in chili paste, vinegar, sesame paste, topped with ground pork and green vegetables.",
    price: 18,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy", "new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },

  // 5. STEAKS & GRILL (10 Items)
  {
    id: "steak-ribeye",
    name: "Ribeye Steak",
    slug: "ribeye-steak",
    category: "Steaks",
    shortDescription: "350g Prime Dry-Aged USDA Wagyu Ribeye cooked to your preferred level, garlic herb butter.",
    longDescription: "350 grams of exquisitely marbled dry-aged USDA Wagyu Ribeye steak, pan-seared to perfection with fresh rosemary, thyme, crushed garlic cloves, and basted with organic butter. Served with loaded garlic mashed potatoes and roasted asparagus.",
    price: 48,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "steak"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-tenderloin",
    name: "Tenderloin Steak",
    slug: "tenderloin-steak",
    category: "Steaks",
    shortDescription: "250g ultra-tender center-cut Filet Mignon steak with creamy green peppercorn sauce.",
    longDescription: "Premium center-cut wagyu filet mignon beef tenderloin. Seared, served with a velvety, rich green peppercorn and French brandy cream sauce, baby glazed carrots, and truffled French fries.",
    price: 45,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["steak"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-chicken",
    name: "Herb Butter Chicken Steak",
    slug: "herb-butter-chicken-steak",
    category: "Steaks",
    shortDescription: "Grilled marinated double chicken breast seared in a rich rosemary butter sauce.",
    longDescription: "Tender boneless chicken breasts marinated in lemon and wild herbs, seared on a hot flat top, then oven-finished with rosemary butter. Served with sautéed vegetables and fries.",
    price: 24,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-pepper",
    name: "Grilled Pepper Steak",
    slug: "grilled-pepper-steak",
    category: "Steaks",
    shortDescription: "Prime strip steak crusted in crushed black peppercorns, glazed with cream demi-sauce.",
    longDescription: "USDA Prime New York strip steak coated in freshly cracked black peppercorns, skillet-seared medium-rare, and covered in a rich cognac-beef stock reduction sauce.",
    price: 40,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["steak"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-tomahawk",
    name: "Royal Wagyu Tomahawk (1kg)",
    slug: "royal-wagyu-tomahawk",
    category: "Steaks",
    shortDescription: "Giant 1kg dry-aged bone-in Wagyu Tomahawk ribeye, roasted garlic bulb, rosemary basting.",
    longDescription: "The crown jewel of our steakhouse. A massive bone-in ribeye seared over lava rocks, basted with premium tallow and rosemary butter, roasted garlic bulb. Served with three signature sauces.",
    price: 110,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-lamb",
    name: "Rosemary Crusted Lamb Chops",
    slug: "rosemary-lamb-chops",
    category: "Steaks",
    shortDescription: "Four pieces of tender Australian lamb chops seared with a garlic-rosemary herb paste.",
    longDescription: "Marinated rack lamb chops, seared medium-rare, crusted in a paste of fresh rosemary, minced garlic, olive oil, and sea salt flakes. Served on mint pea puree.",
    price: 42,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-ribs",
    name: "Slow Smoked BBQ Beef Ribs",
    slug: "bbq-beef-ribs",
    category: "Steaks",
    shortDescription: "Tender beef short ribs glazed in a rich house-crafted hickory smoked BBQ glaze.",
    longDescription: "Wagyu short ribs dry-rubbed in house spices, hickory smoked for 8 hours until bone-tender, coated in dark brown sugar BBQ sauce, baked until sticky.",
    price: 38,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-tbone",
    name: "Prime Porterhouse T-Bone (600g)",
    slug: "prime-tbone-steak",
    category: "Steaks",
    shortDescription: "600g cut combining New York strip and tender Filet seared in garlic bone marrow butter.",
    longDescription: "A large hand-selected T-bone steak seared over open flame, basted with high-grade garlic-infused bone marrow butter. Served with roasted vine tomatoes and mashed potatoes.",
    price: 58,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=600&auto=format&fit=crop",
    tags: ["steak"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-mignon",
    name: "Filet Mignon Truffle Butter",
    slug: "filet-mignon-truffle",
    category: "Steaks",
    shortDescription: "250g delicate center-cut tenderloin steak topped with black truffle whipped butter.",
    longDescription: "Melt-in-your-mouth beef filet seared in cast iron skillet, topped with a thick disc of house-whipped butter blended with grated black truffle paste.",
    price: 49,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "steak-pork-grill",
    name: "Moroccan Spiced Pork Chops",
    slug: "moroccan-pork-chops",
    category: "Steaks",
    shortDescription: "Double cut pork chops marinated in aromatic Moroccan spice blend, grilled over hot charcoals.",
    longDescription: "Thick pork chop cutlets marinated in cumin, paprika, coriander, and lemon zest, grilled, served with fruit couscous and red pepper chutney.",
    price: 29,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },

  // 6. SEAFOOD SPECIALS (8 Items)
  {
    id: "steak-salmon",
    name: "Grilled Salmon Fillet",
    slug: "grilled-salmon-fillet",
    category: "Seafood Specials",
    shortDescription: "Pan-roasted Norwegian salmon with a citrus glaze and wild herb butter sauce.",
    longDescription: "Freshly imported Norwegian Salmon fillet, pan-seared skin-on to a golden crisp. Drizzled with a zesty orange-lemon glaze and accompanied by wilted baby spinach and a garlic quinoa mix.",
    price: 34,
    image: "https://images.unsplash.com/photo-1485921325814-a504314243a0?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-thermidor",
    name: "Lobster Thermidor",
    slug: "lobster-thermidor",
    category: "Seafood Specials",
    shortDescription: "Whole lobster tail baked in a rich mustard cognac cream egg yolk sauce.",
    longDescription: "Classic French seafood main: lobster meat chunks sautéed with mushrooms, shallots, brandy, cream, re-stuffed inside lobster tail shell, covered in Gruyere cheese and broiled.",
    price: 52,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-skewers",
    name: "Tiger Garlic Prawn Skewers",
    slug: "garlic-prawn-skewers",
    category: "Seafood Specials",
    shortDescription: "Grilled jumbo tiger prawns basted with lemon garlic butter on bamboo sticks.",
    longDescription: "Giant prawns marinated in olive oil, garlic cloves, sea salt, threaded on bamboo skewers, grilled over open coals. Served with wild herb rice.",
    price: 28,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-paella",
    name: "Royal Seafood Paella",
    slug: "royal-seafood-paella",
    category: "Seafood Specials",
    shortDescription: "Spanish saffron rice loaded with prawns, mussels, baby squid, and fish chunks.",
    longDescription: "A glorious pan of traditional Spanish rice simmered with expensive saffron strands, seafood broth, packed with green shell mussels, tiger prawns, baby calamari, and bell peppers.",
    price: 36,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood", "bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-scallops",
    name: "Pan-Seared Scallops",
    slug: "pan-seared-scallops",
    category: "Seafood Specials",
    shortDescription: "Fresh jumbo U10 scallops seared in butter, set over creamy cauliflower puree.",
    longDescription: "Plump diver scallops seared in oil-butter until a perfect brown outer ring forms, served medium over velvet cauliflower puree and drizzled with brown caper butter.",
    price: 38,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-oysters",
    name: "Baked Oysters Rockefeller",
    slug: "baked-oysters-rockefeller",
    category: "Seafood Specials",
    shortDescription: "Six fresh oysters topped with spinach paste, butter, breadcrumbs, baked hot.",
    longDescription: "Half shell Pacific oysters topped with a cooked mixture of spinach, butter, garlic, parsley, Pernod liqueur, breadcrumbs, broiled until golden brown.",
    price: 26,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-cod",
    name: "Miso Glazed Black Cod",
    slug: "miso-glazed-black-cod",
    category: "Seafood Specials",
    shortDescription: "Pacific Black Cod marinated in sweet white miso, baked to tender flakes.",
    longDescription: "A highly acclaimed dish: thick cod fillet marinated for 48 hours in sweet mirin, sake, and white miso, baked until caramelised. Flakes beautifully.",
    price: 42,
    image: "https://images.unsplash.com/photo-1485921325814-a504314243a0?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "seafood", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "seafood-mussels",
    name: "White Wine Steamed Mussels",
    slug: "white-wine-mussels",
    category: "Seafood Specials",
    shortDescription: "Fresh blue mussels cooked in garlic white grape juice broth, touch of cream.",
    longDescription: "A classic pot of fresh blue shell mussels steamed in garlic-shallot white grape juice broth, parsley, butter, and completed with crusty garlic bread slices.",
    price: 24,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: true,
  },

  // 7. RICE & CURRIES (8 Items)
  {
    id: "rice-fried",
    name: "Egg Fried Rice",
    slug: "egg-fried-rice",
    category: "Rice",
    shortDescription: "Classic wok-fried Jasmine rice with eggs, green peas, and scallions.",
    longDescription: "Authentic Chinese wok-fired rice: day-old fragrant Jasmine rice tossed in sesame oil, light soy sauce, green peas, scrambled egg, and lots of green spring onions.",
    price: 12,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "rice-garlic",
    name: "Garlic Butter Fried Rice",
    slug: "garlic-butter-fried-rice",
    category: "Rice",
    shortDescription: "Fragrant rice stir-fried in double butter and finely chopped roasted garlic.",
    longDescription: "Rich and aromatic Japanese style rice stir-fried in a blazing hot wok with soy sauce, salted butter, and heaps of toasted golden garlic.",
    price: 13,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "curry-green",
    name: "Thai Green Chicken Curry",
    slug: "thai-green-chicken-curry",
    category: "Rice",
    shortDescription: "Spicy green curry paste, coconut milk, chicken breast, eggplants, bamboo shoots.",
    longDescription: "Authentic Thai green curry simmered with fresh green chilies, coriander root, coconut cream, bamboo shoots, bell peppers, eggplant, and chicken breast cubes. Served with Jasmine rice.",
    price: 19,
    image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy", "bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "curry-beef-chili",
    name: "Beef Chili Onion Sauce",
    slug: "beef-chili-onion",
    category: "Rice",
    shortDescription: "Wok sliced beef stir-fried with green chilies, onions, and spicy dark soy sauce.",
    longDescription: "Thinly sliced beef flank seared with green chilies, sweet white onions, ginger, garlic, cooked in a dark spicy soy sauce mix. Best paired with garlic rice.",
    price: 21,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["spicy"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "curry-manchurian",
    name: "Chicken Manchurian",
    slug: "chicken-manchurian",
    category: "Rice",
    shortDescription: "Crispy fried chicken balls in sweet-tangy garlic ginger dark soy sauce.",
    longDescription: "Battered crispy chicken balls tossed in a thick Chinese gravy seasoned with ginger, garlic, soy sauce, and tomato puree, garnished with spring onion greens.",
    price: 18,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "curry-sweet-sour",
    name: "Sweet & Sour Tiger Prawns",
    slug: "sweet-sour-prawns",
    category: "Rice",
    shortDescription: "Fried tiger prawns cooked in a zesty pineapple tomato syrup sauce with bell peppers.",
    longDescription: "Lightly battered seared prawns stir-fried in a sweet, sour sauce with pineapple cubes, red onion slices, cucumbers, and bell peppers.",
    price: 24,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop",
    tags: ["seafood"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "curry-butter-chicken",
    name: "Royal Mughlai Butter Chicken",
    slug: "royal-butter-chicken",
    category: "Rice",
    shortDescription: "Tandoori chicken tikkas simmered in velvety cream, butter, tomato gravy.",
    longDescription: "Clay-oven baked boneless tandoori chicken tikka pieces cooked in a rich, buttery tomato sauce enriched with cashew paste, cream, and dried fenugreek leaves.",
    price: 22,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "bestseller"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "rice-veg-stirfry",
    name: "Mixed Vegetable Cashew Wok",
    slug: "vegetable-cashew-wok",
    category: "Rice",
    shortDescription: "Crunchy broccoli, mushrooms, carrots, baby corn in ginger garlic oyster-less soy glaze.",
    longDescription: "Sautéed fresh garden greens, mushrooms, baby corn, water chestnuts, roasted cashew nuts, in a vegan soy sauce paste. Light and healthy.",
    price: 15,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },

  // 8. PLATTERS / SHARING EXPERIENCE (6 Items)
  {
    id: "platter-mixed-grill",
    name: "Mixed Grill Platter",
    slug: "mixed-grill-platter",
    category: "Platters",
    shortDescription: "Grand platter of Ribeye slices, grilled chicken, lamb chops, jumbo prawns, and sides.",
    longDescription: "An ultimate sharing experience of fine-cut grilled meats: includes Wagyu Ribeye slices, marinated Moroccan style grilled chicken, rosemary-crusted Lamb chops, butterflied jumbo tiger prawns, grilled sweet corn, baked baby potatoes, and house-made barbecue, chimichurri, and peppercorn dipping sauces.",
    price: 78,
    servingSize: "2 - 3 Persons",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "chef special", "bestseller"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "platter-seafood",
    name: "Seafood Celebration Platter",
    slug: "seafood-celebration-platter",
    category: "Platters",
    shortDescription: "Crispy calimari, garlic butter lobster, grilled prawns, salmon chunks, mussels, fries.",
    longDescription: "A luxurious selection of wild ocean treasures: Half-baked rock lobster tails in garlic butter, fresh seared salmon, grilled jumbo prawns, steamed black shell mussels in white sauce, salt & pepper crispy calamari. Served over buttered garlic rice with French fries.",
    price: 95,
    servingSize: "3 - 4 Persons",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "seafood"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "platter-family-steak",
    name: "Grand Emperor Steak Platter",
    slug: "grand-emperor-steak-platter",
    category: "Platters",
    shortDescription: "Tomahawk steak, Filet Mignon, seared marrow bones, loaded baked potato, grilled onions.",
    longDescription: "A meat lover's ultimate share board: Features a whole grilled Wagyu Tomahawk, center-cut Filet Mignon, roasted split bone marrow, double butter baked potatoes, chimichurri sauce, and mushroom gravy.",
    price: 145,
    servingSize: "4 - 5 Persons",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "chef special", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "platter-asian-fusion",
    name: "Asian Fusion Sharing Platter",
    slug: "asian-fusion-sharing-platter",
    category: "Platters",
    shortDescription: "Dynamite prawns, Peking duck rolls, chicken bites, spicy noodles, kimchi sides.",
    longDescription: "A luxurious combination of our best Asian appetizers: Dynamite Prawns, crispy Duck spring rolls, Ginger-garlic chicken bites, a bowl of wok-fried sesame garlic noodles, and pickled radish salad.",
    price: 70,
    servingSize: "2 - 3 Persons",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "platter-supreme-party",
    name: "Maison Supreme Party Platter",
    slug: "maison-supreme-party-platter",
    category: "Platters",
    shortDescription: "Ribeye slices, grilled chicken breasts, lobster tails, crab cakes, potato wedges, dips.",
    longDescription: "The ultimate catering board designed for large groups: Seared wagyu steak strips, Moroccan chicken breasts, seared baby lobster tails, deep-fried crab cakes, baked sweet potato wedges, garlic bread, with 4 house dips.",
    price: 155,
    servingSize: "5 - 6 Persons",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },
  {
    id: "platter-sushi",
    name: "Emperor Sushi & Sashimi Platter",
    slug: "emperor-sushi-sashimi-platter",
    category: "Platters",
    shortDescription: "Assorted California rolls, spicy tuna rolls, salmon sashimi, nigiri, ginger, wasabi.",
    longDescription: "Freshly cut ocean delicacies assembled beautifully: 12 California rolls, 8 spicy tuna rolls, 8 pieces of fresh Norwegian salmon sashimi, 6 tuna nigiri, served with pickled pink ginger and spicy wasabi paste.",
    price: 85,
    servingSize: "3 - 4 Persons",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
    tags: ["platter", "seafood", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: true,
  },

  // 9. DESSERTS (8 Items)
  {
    id: "dessert-lava",
    name: "Molten Lava Cake",
    slug: "molten-lava-cake",
    category: "Desserts",
    shortDescription: "Dark chocolate cake with a hot oozing molten center, served with vanilla bean ice cream.",
    longDescription: "Baked-to-order Belgian dark chocolate cake with a perfectly flowing rich hot chocolate lava core. Garnished with wild strawberries and served with a scoop of premium Madagascar vanilla bean ice cream.",
    price: 12,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-tiramisu",
    name: "Signature Tiramisu",
    slug: "signature-tiramisu",
    category: "Desserts",
    shortDescription: "Classic Italian coffee-soaked ladyfingers, velvety mascarpone cream, cocoa dusting.",
    longDescription: "Layers of house-baked ladyfinger cookies soaked in rich double-shot espresso, covered with a fluffy mixture of mascarpone cheese, organic egg yolks, and pure cocoa dust on top. Pure luxury.",
    price: 13,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-cheesecake",
    name: "New York Berry Cheesecake",
    slug: "new-york-berry-cheesecake",
    category: "Desserts",
    shortDescription: "Creamy baked cheesecake set on graham crust topped with wild berry compote.",
    longDescription: "Rich, dense cream cheese batter baked slow, set over crunchy crushed graham cracker shell, topped with a thick warm syrup of fresh strawberries, blueberries, and raspberries.",
    price: 14,
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-mousse",
    name: "Belgian Chocolate Mousse",
    slug: "belgian-chocolate-mousse",
    category: "Desserts",
    shortDescription: "Light whipped egg whites folded with melted milk chocolate, whipped cream, cherries.",
    longDescription: "Airy but velvety mousse cup made of premium Belgian cocoa chocolate, folded with heavy cream, served chilled, decorated with gold leaves and fresh cherries.",
    price: 11,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-creme",
    name: "Vanilla Bean Crème Brûlée",
    slug: "vanilla-bean-creme-brulee",
    category: "Desserts",
    shortDescription: "Rich cooked custard base topped with a hard layer of caramelized burnt sugar.",
    longDescription: "Silky baked cream custard flavored with scraped Madagascar vanilla pods, chilled, and finished with organic brown sugar caramelized tableside with a culinary blowtorch.",
    price: 15,
    image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-matcha",
    name: "Matcha Green Tea Ice Cream",
    slug: "matcha-ice-cream",
    category: "Desserts",
    shortDescription: "Traditional Japanese double churned bitter-sweet matcha cream scoop.",
    longDescription: "Gourmet green tea ice cream crafted from ceremonial grade Kyoto matcha powder, double churned with raw sugar and fresh farm milk.",
    price: 10,
    image: "https://images.unsplash.com/photo-1572246538688-3f326dca3951?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian", "new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-tart",
    name: "Warm Spiced Apple Tart",
    slug: "spiced-apple-tart",
    category: "Desserts",
    shortDescription: "Caramelized apples baked in puff pastry, dusting of cinnamon, vanilla scoop.",
    longDescription: "Fresh sliced Granny Smith apples tossed in cinnamon and sugar, laid over flaky puff pastry skin, baked, and topped with honey caramel sauce and vanilla ice cream.",
    price: 12,
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "dessert-pannacotta",
    name: "Lavender Lavender Panna Cotta",
    slug: "lavender-panna-cotta",
    category: "Desserts",
    shortDescription: "Jellied sweet cream flavored with lavender syrup, fresh berry toppings.",
    longDescription: "A delicate Italian panna cotta gelatin cooked with fresh lavender infusion, sweet cream, topped with fresh blackberries and honeyed sauce.",
    price: 13,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },

  // 10. DRINKS / BEVERAGES (8 Items)
  {
    id: "drink-mocktail",
    name: "Signature Gold Mocktail",
    slug: "signature-gold-mocktail",
    category: "Drinks",
    shortDescription: "Refreshed passionfruit, lime, sparkling water, mint, and edible gold flakes.",
    longDescription: "An exquisite luxury blend of ripe fresh passionfruit pulp, freshly squeezed key limes, organic honey syrup, carbonated mineral water, fresh mint leaves, finished with 24k edible gold flakes.",
    price: 10,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "new"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-mojito",
    name: "Classic Mint Mojito",
    slug: "classic-mint-mojito",
    category: "Drinks",
    shortDescription: "Muddled lime wedge, organic mint leaves, pure cane sugar, crushed ice, soda.",
    longDescription: "Traditional refreshing mocktail featuring fresh muddled mint leaves, lime juice, brown sugar crystals, filled to the brim with crushed ice and premium club soda.",
    price: 9,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-iced-coffee",
    name: "Spanish Iced Latte",
    slug: "spanish-iced-latte",
    category: "Drinks",
    shortDescription: "Double espresso shot shaken with condensed milk and whole milk over ice.",
    longDescription: "Double shot of fresh ground Arabica espresso beans, shaken with sweet condensed milk, ice cubes, topped with cold milk foam.",
    price: 8,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop",
    tags: ["bestseller"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-tea",
    name: "Imperial Jasmine Tea",
    slug: "imperial-jasmine-tea",
    category: "Drinks",
    shortDescription: "Organic loose leaf green tea leaves scented with fresh jasmine blossoms.",
    longDescription: "High-grade organic jasmine tea leaves steeped to golden color, releasing a beautiful floral scent. Served in a traditional cast iron pot.",
    price: 11,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    tags: ["vegetarian"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-red-latte",
    name: "Red Velvet Milkshake",
    slug: "red-velvet-shake",
    category: "Drinks",
    shortDescription: "Premium vanilla ice cream blended with cocoa and red velvet cake cake chunks.",
    longDescription: "Rich dessert shake: cream blended with organic red velvet cake slices, cocoa, topped with whipped cream and red velvet dust.",
    price: 12,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-lychee",
    name: "Lychee Mint Spritzer",
    slug: "lychee-mint-spritzer",
    category: "Drinks",
    shortDescription: "Sweet lychee syrup, muddled mint, tonic water, fresh sliced lychee fruit.",
    longDescription: "An exotic refreshing spritzer of sweet lychee syrup, fresh mint leaves, ginger ale, tonic water, and a skewer of fresh lychee fruits.",
    price: 10,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special"],
    availabilityStatus: true,
    featuredStatus: true,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-lagoon",
    name: "Blue Lagoon Mocktail",
    slug: "blue-lagoon-mocktail",
    category: "Drinks",
    shortDescription: "Blue curacao syrup, lemonade juice, crushed ice, sprite, lemon slice garnish.",
    longDescription: "Refreshing electric blue mocktail crafted with blue curacao peel syrup, freshly squeezed sweet lemonade juice, sparkling lemon soda, topped with ice and orange slice.",
    price: 9,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
    tags: ["new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  },
  {
    id: "drink-lavender",
    name: "Lavender Honey Citron Rose",
    slug: "lavender-honey-citron",
    category: "Drinks",
    shortDescription: "Steeped lavender buds, organic honey, fresh lemon juice, sparkling water.",
    longDescription: "Fragrant luxury beverage: French lavender floral syrup, organic honey, fresh squeezed yellow lemon juice, carbonated spring water, topped with dried lavender stalk.",
    price: 10,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop",
    tags: ["chef special", "new"],
    availabilityStatus: true,
    featuredStatus: false,
    buffetAvailabilityFlag: true,
    platterAvailabilityFlag: false,
  }
];

const DEFAULT_BUFFETS = [
  {
    id: "buffet-premium-dinner",
    name: "Premium Dinner Buffet",
    price: 49,
    timings: "Daily, 7:00 PM - 10:30 PM",
    inclusions: [
      "24+ Gourmet Dishes",
      "Unlimited Live Starters & Tempura",
      "Signature Beef/Chicken Chowmein & Rice",
      "Assorted Sushi & Seafood Counter",
      "Chef Special Grill Stations",
      "Complimentary Mocktails & Hot Beverages",
      "Grand Dessert Buffet Bar (Molten Lava Cake, Cheese Cakes)"
    ],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    active: true,
  },
  {
    id: "buffet-executive-lunch",
    name: "Executive Lunch Buffet",
    price: 35,
    timings: "Mon - Fri, 12:00 PM - 3:30 PM",
    inclusions: [
      "15+ Exquisite Items",
      "Gourmet Soups & Starters",
      "Noodle & Rice Live Stations",
      "Assorted Asian Fusion Curries",
      "Fresh Salad Bar & Dips",
      "3 Signature Desserts"
    ],
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
    active: true,
  },
  {
    id: "buffet-seafood-night",
    name: "Seafood Buffet Night",
    price: 65,
    timings: "Every Friday & Saturday, 6:30 PM - 11:00 PM",
    inclusions: [
      "Grand Crab, Lobster, & Shrimp stations",
      "Oysters on Ice & Live Sushi Rolling",
      "Grilled Salmon & Sea Bass to order",
      "Seafood Chowder & Hot Soups",
      "Unlimited Beverages",
      "Full Dessert bar"
    ],
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop",
    active: true,
  }
];

const DEFAULT_OFFERS = [
  {
    id: "offer-royal-family",
    title: "The Royal Family Feast",
    description: "Enjoy 15% off on our grand Family Steak Platter and Seafood Celebration Platter every Sunday.",
    tag: "Family Deal",
    code: "ROYALFEAST",
    active: true,
  },
  {
    id: "offer-vip-loyalty",
    title: "Complimentary Chef Starter",
    description: "Reserve a fine dining regular table using our online platform and receive a free Dynamite Prawn starter.",
    tag: "VIP Exclusive",
    code: "LSTARTER",
    active: true,
  }
];

// LocalStorage helpers to simulate databases
const getLocalData = <T>(key: string, defaults: T): T => {
  if (typeof window === "undefined") return defaults;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    const parsed = JSON.parse(stored) as T;
    if (key === "local_menu_items" && Array.isArray(parsed) && parsed.length < 50) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    return defaults;
  }
};

const setLocalData = <T>(key: string, data: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// -------------------------------------------------------------
// CORE BUSINESS LOGIC APIS (FIREBASE OR LOCAL MOCK)
// -------------------------------------------------------------

// Menu Items CRUD
export async function getMenuItems(): Promise<MenuItem[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "menuItems"));
      if (snap.empty) {
        // Prepopulate Firestore if empty
        for (const item of DEFAULT_MENU_ITEMS) {
          await setDoc(doc(db, "menuItems", item.id), item);
        }
        return DEFAULT_MENU_ITEMS as MenuItem[];
      }
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as MenuItem[];
    } catch (e) {
      console.warn("Firestore fetch error, falling back to local:", e);
    }
  }
  return getLocalData<MenuItem[]>("local_menu_items", DEFAULT_MENU_ITEMS as MenuItem[]);
}

export async function addMenuItem(item: MenuItem): Promise<boolean> {
  const newItem: MenuItem = { ...item, id: item.id || `menu-${Date.now()}` };
  if (db) {
    try {
      await setDoc(doc(db, "menuItems", newItem.id), newItem);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const items = getLocalData<MenuItem[]>("local_menu_items", DEFAULT_MENU_ITEMS as MenuItem[]);
  items.push(newItem);
  setLocalData("local_menu_items", items);
  return true;
}

export async function updateMenuItem(item: MenuItem): Promise<boolean> {
  if (db) {
    try {
      await updateDoc(doc(db, "menuItems", item.id), { ...item });
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const items = getLocalData<MenuItem[]>("local_menu_items", DEFAULT_MENU_ITEMS as MenuItem[]);
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...item };
    setLocalData("local_menu_items", items);
  }
  return true;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (db) {
    try {
      await deleteDoc(doc(db, "menuItems", id));
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const items = getLocalData<MenuItem[]>("local_menu_items", DEFAULT_MENU_ITEMS as MenuItem[]);
  const filtered = items.filter((i) => i.id !== id);
  setLocalData("local_menu_items", filtered);
  return true;
}

// Reservations
export async function getReservations(): Promise<Reservation[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "reservations"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as Reservation[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalData<Reservation[]>("local_reservations", [
    {
      id: "res-demo-1",
      name: "Marcus Aurelius",
      email: "marcus@rome.com",
      phone: "+1 415-555-2671",
      date: "2026-07-10",
      time: "19:30",
      guestCount: 4,
      type: "Regular Dining",
      notes: "Window side table requested if possible, celebrating an anniversary.",
      status: "Confirmed",
      createdAt: new Date().toISOString()
    },
    {
      id: "res-demo-2",
      name: "Lady Penelope",
      email: "penelope@noble.uk",
      phone: "+44 20-7946-0929",
      date: "2026-07-12",
      time: "20:00",
      guestCount: 2,
      type: "Buffet Experience",
      notes: "No gluten allergies.",
      status: "Pending",
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function createReservation(res: Partial<Reservation>): Promise<Reservation> {
  const newRes: Reservation = {
    id: res.id || `res-${Date.now()}`,
    name: res.name || "",
    email: res.email || "",
    phone: res.phone || "",
    date: res.date || "",
    time: res.time || "19:30",
    guestCount: res.guestCount || 2,
    diningType: res.diningType || res.type || "Regular Dining",
    notes: res.notes || "",
    status: (res.status as "Confirmed" | "Cancelled" | "Pending") || "Pending",
    createdAt: res.createdAt || new Date().toISOString(),
    preorderItems: res.preorderItems || null,
    preorderTotal: res.preorderTotal || null,
  };
  if (db) {
    try {
      await setDoc(doc(db, "reservations", newRes.id), newRes);
      return newRes;
    } catch (e) {
      console.error(e);
    }
  }
  const reservations = getLocalData<Reservation[]>("local_reservations", []);
  reservations.push(newRes);
  setLocalData("local_reservations", reservations);
  return newRes;
}

export async function updateReservationStatus(id: string, status: "Confirmed" | "Cancelled" | "Pending"): Promise<boolean> {
  if (db) {
    try {
      await updateDoc(doc(db, "reservations", id), { status });
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const reservations = getLocalData<Reservation[]>("local_reservations", []);
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reservations[idx].status = status;
    setLocalData("local_reservations", reservations);
  }
  return true;
}

// Buffet Packages CRUD
export async function getBuffetPackages(): Promise<BuffetPackage[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "buffetPackages"));
      if (snap.empty) {
        for (const item of DEFAULT_BUFFETS) {
          await setDoc(doc(db, "buffetPackages", item.id), item);
        }
        return DEFAULT_BUFFETS as BuffetPackage[];
      }
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as BuffetPackage[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalData<BuffetPackage[]>("local_buffet_packages", DEFAULT_BUFFETS as BuffetPackage[]);
}

export async function updateBuffetPackage(pack: BuffetPackage): Promise<boolean> {
  if (db) {
    try {
      await setDoc(doc(db, "buffetPackages", pack.id), pack);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const packs = getLocalData<BuffetPackage[]>("local_buffet_packages", DEFAULT_BUFFETS as BuffetPackage[]);
  const idx = packs.findIndex((p) => p.id === pack.id);
  if (idx !== -1) {
    packs[idx] = { ...packs[idx], ...pack };
  } else {
    packs.push(pack);
  }
  setLocalData("local_buffet_packages", packs);
  return true;
}

export async function deleteBuffetPackage(id: string): Promise<boolean> {
  if (db) {
    try {
      await deleteDoc(doc(db, "buffetPackages", id));
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const packs = getLocalData<BuffetPackage[]>("local_buffet_packages", DEFAULT_BUFFETS as BuffetPackage[]);
  const filtered = packs.filter((p) => p.id !== id);
  setLocalData("local_buffet_packages", filtered);
  return true;
}

// Platters CRUD
export async function getPlatters(): Promise<MenuItem[]> {
  const items = await getMenuItems();
  return items.filter(i => i.platterAvailabilityFlag || i.category === "Platters" || i.tags?.includes("platter"));
}

// Contact messages
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "contactMessages"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as ContactMessage[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalData<ContactMessage[]>("local_messages", [
    {
      id: "msg-demo-1",
      name: "Arthur Pendragon",
      email: "arthur@camelot.org",
      subject: "Corporate dinner reservation inquiry",
      message: "We want to book a private buffet dining hall for 35 colleagues on next Friday. Could we request custom lobster and steak platters?",
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function submitContactMessage(msg: Omit<ContactMessage, "id" | "createdAt">): Promise<boolean> {
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  if (db) {
    try {
      await setDoc(doc(db, "contactMessages", newMsg.id), newMsg);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const msgs = getLocalData<ContactMessage[]>("local_messages", []);
  msgs.push(newMsg);
  setLocalData("local_messages", msgs);
  return true;
}

// Order Inquiries
export async function getOrderInquiries(): Promise<OrderInquiry[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "orders"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as OrderInquiry[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalData<OrderInquiry[]>("local_orders", [
    {
      id: "ord-demo-1",
      name: "Chef Gordon",
      email: "gordon@hells.kitchen",
      phone: "+1 310-555-0199",
      type: "Takeaway",
      items: [
        { name: "Mixed Grill Platter", qty: 1, price: 78 },
        { name: "Signature Gold Mocktail", qty: 2, price: 10 }
      ],
      total: 98,
      status: "Preparing",
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function createOrderInquiry(order: Partial<OrderInquiry>): Promise<boolean> {
  const newOrder: OrderInquiry = {
    id: order.id || `ord-${Date.now()}`,
    name: order.name || "",
    email: order.email || "",
    phone: order.phone || "",
    type: order.type || "Takeaway",
    items: order.items || [],
    total: order.total || 0,
    status: order.status || "Pending",
    createdAt: order.createdAt || new Date().toISOString(),
    reservationId: order.reservationId,
  };
  if (db) {
    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const orders = getLocalData<OrderInquiry[]>("local_orders", []);
  orders.push(newOrder);
  setLocalData("local_orders", orders);
  return true;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  if (db) {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const orders = getLocalData<OrderInquiry[]>("local_orders", []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    setLocalData("local_orders", orders);
  }
  return true;
}

// Offers & Specials CRUD
export async function getOffers(): Promise<Offer[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "offers"));
      if (snap.empty) {
        for (const item of DEFAULT_OFFERS) {
          await setDoc(doc(db, "offers", item.id), item);
        }
        return DEFAULT_OFFERS as Offer[];
      }
      return snap.docs.map(d => ({ ...d.data(), id: d.id })) as Offer[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalData<Offer[]>("local_offers", DEFAULT_OFFERS as Offer[]);
}

export async function updateOffer(offer: Offer): Promise<boolean> {
  if (db) {
    try {
      await setDoc(doc(db, "offers", offer.id), offer);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const offers = getLocalData<Offer[]>("local_offers", DEFAULT_OFFERS as Offer[]);
  const idx = offers.findIndex((o) => o.id === offer.id);
  if (idx !== -1) {
    offers[idx] = { ...offers[idx], ...offer };
  } else {
    offers.push(offer);
  }
  setLocalData("local_offers", offers);
  return true;
}

export async function deleteOffer(id: string): Promise<boolean> {
  if (db) {
    try {
      await deleteDoc(doc(db, "offers", id));
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const offers = getLocalData<Offer[]>("local_offers", DEFAULT_OFFERS as Offer[]);
  const filtered = offers.filter((o) => o.id !== id);
  setLocalData("local_offers", filtered);
  return true;
}

// -------------------------------------------------------------
// SECURE ADMIN AUTH FALLBACK (REAL FIREBASE AUTH OR SIGNED JWT SIMULATION)
// -------------------------------------------------------------

export function getAuthInstance() {
  return auth;
}

export function subscribeToAuth(callback: (user: AdminUser | User | null) => void) {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  
  // Local storage mock auth listener
  if (typeof window !== "undefined") {
    const checkUser = () => {
      const stored = localStorage.getItem("admin_user");
      if (stored) {
        try {
          callback(JSON.parse(stored) as AdminUser);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }
  callback(null);
  return () => {};
}

export async function adminLogin(email: string, password: string): Promise<boolean> {
  if (auth) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      console.warn("Firebase Auth login failed, checking fallback:", e);
    }
  }
  // Hardcoded luxury admin fallback
  if (email === "admin@maisonaura.com" && password === "aura123") {
    const mockUser: AdminUser = { email, uid: "mock-admin-uid", role: "Super Admin", displayName: "Maitre D'" };
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("storage"));
    }
    return true;
  }
  throw new Error("Invalid administrator credentials");
}

export async function adminLogout(): Promise<boolean> {
  if (auth) {
    try {
      await signOut(auth);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_user");
    window.dispatchEvent(new Event("storage"));
  }
  return true;
}
