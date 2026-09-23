/**
 * Content of the original site mightymeatsanddeli.com (text only, no photos),
 * including the price lists that were published there as images.
 * Prices as of the price list dated 2026-08-26.
 */
import type { CookingMethod } from '@mighty-meats/shared/cooking'
import type { WeekDay } from '@mighty-meats/shared/constants'

export type CategoryContent = {
  slug: string
  title: string
  description?: string
  products: ProductContent[]
}

export type ProductContent = {
  name: string
  description?: string
  price?: string
  perfectFor?: CookingMethod[]
}

const named = (...names: string[]): ProductContent[] => names.map((name) => ({ name }))

export const business = {
  siteName: 'Mighty Meats and Deli',
  tagline: 'Family-run butcher shop in Charleswood, Winnipeg',
  phone: '(204) 691-9333',
  email: 'themightymeats@yahoo.com',
  address: {
    street: '5-4910 Roblin Blvd',
    city: 'Winnipeg',
    region: 'MB',
    postalCode: 'R3R 0G7',
    country: 'CA',
  },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as WeekDay[], opens: '10:00', closes: '18:00' },
    { days: ['Saturday'] as WeekDay[], opens: '09:00', closes: '18:00' },
  ],
  socialLinks: [
    { platform: 'facebook' as const, url: 'https://www.facebook.com/mightymeatsanddeli/' },
    { platform: 'instagram' as const, url: 'https://www.instagram.com/mighty_meats_and_deli/' },
  ],
}

export const aboutText =
  'Mighty Meats & Deli is a dedicated family-run shop located in Charleswood. We offer a wide variety of locally sourced meats and artisan products from all across Manitoba. We carry AAA quality Certified Angus Beef and locally sourced pork and chicken. All in-store made products are naturally made and allergy friendly. We are a lactose free, gluten free and diabetic friendly environment. We strive to provide service and products that are superb.'

/** "Products" page: the original single list, grouped for readability. */
export const inHouseCategories: CategoryContent[] = [
  {
    slug: 'bacon-and-ham',
    title: 'Bacon & ham',
    products: named(
      'Smoked Side Bacon',
      'Back Bacon',
      'Black Forest Ham',
      'Smoked Ham',
      'Maple Sugar Ham',
      'Honey Garlic Ham',
    ),
  },
  {
    slug: 'jerky-and-pepperettes',
    title: 'Jerky & pepperettes',
    products: named(
      'Smoked Jerky',
      'Salt and Pepper Jerky',
      'Teriyaki Jerky',
      'BBQ Jerky',
      'Regular Dry Pepperette',
      'Habanero Dry Pepperette',
      'Beef Pepperette',
      'Cheese Pepperette',
      'Sweet Chili Pepperette',
      'Hot Pepperette',
      'Honey Garlic Pepperette',
    ),
  },
  {
    slug: 'sausages',
    title: 'Sausages',
    products: named(
      'Ham Garlic Ring',
      'Polish Style Kielbasa',
      'Farmer Sausage',
      'Liver Sausage',
      'Smokies',
      'Beef Wiener',
      'Euro Wieners',
      'Fresh Bratwurst',
      'Fresh Mild Italian',
      'Fresh Breakfast Sausage',
    ),
  },
  {
    slug: 'deli-meats',
    title: 'Deli meats',
    products: named(
      'Kielbasa Roll',
      'Regular & All Beef Salami',
      'Pepperoni',
      'Farmer Roll',
      'Bologna Euro & Beef',
      'Lyoner',
      'Bierschinken',
      'Fleischwurst',
      'Jagdwurst',
      'Corned Beef',
      'Roast Beef',
      'Lunch Meatloaves',
      'Headcheese Hot & Mild',
    ),
  },
  {
    slug: 'ready-meals',
    title: 'Ready meals',
    products: named('Lasagna', 'Cabbage Rolls', 'Meatballs in Gravy', 'Meatballs in Pasta Sauce'),
  },
  {
    slug: 'gluten-free',
    title: 'Gluten free',
    products: named('Gluten Free Desserts', 'Gluten Free Pizza', 'Gluten Free Savoury'),
  },
]

const pack = (name: string, price: string, items: string[], perfectFor?: CookingMethod[]): ProductContent => ({
  name,
  price,
  description: items.join(' · '),
  perfectFor,
})

/** "Freezer & Bulk Packs" page: transcribed from the published price list. */
export const freezerCategories: CategoryContent[] = [
  {
    slug: 'freezer-packs',
    title: 'Freezer packs',
    products: [
      pack('Freezer Pack #1 — Dine for 2', '$65', [
        '2 lb regular ground beef',
        '2 lb beef stew',
        '2 lb boneless chicken breast',
        '4 pc pork chops',
        '2 pc pork tenderloin',
        '1 pack farmer sausage',
      ]),
      pack(
        'Freezer Pack #2 — BBQ Pack',
        '$99',
        [
          '2 packs (about 1 kg) wieners',
          '8 pc beef patties',
          '4 pc sirloin steak',
          '2 packs (8 pc) smokies',
          '4 pc boneless chicken breast (plain or marinated)',
        ],
        ['bbq', 'grilling'],
      ),
      pack('Freezer Pack #3', '$135', [
        '3.5–4 lb sirloin roast',
        '8 lb ground beef',
        '5 lb beef stew',
        '3–4 lb pork butt roast',
        '5 lb boneless pork chops',
      ]),
      pack('Freezer Pack #4', '$210', [
        '2 packs farmer sausage',
        '2 packs (2 lb) bacon',
        '10 lb ground beef',
        '5 lb pork chops',
        '5 lb beef stew',
        '5 lb boneless chicken breast',
        '5 lb sirloin steak',
      ]),
      pack(
        'Freezer Pack #5 — BBQ Pack',
        '$95',
        ['4 pc beef patties', '4 pc pork chops', '4 pc NY steak', '4 pc chicken kabobs', '1 pack (4 pc) smokies'],
        ['bbq', 'grilling'],
      ),
      pack(
        'Freezer Pack #6 — BBQ Pack',
        '$125',
        [
          '2 pc ribeye steak',
          '8 pc beef patties',
          '4 pc NY steak',
          '1 pack (4 pc) marinated pork chops',
          '4 pc marinated chicken breast',
        ],
        ['bbq', 'grilling'],
      ),
      pack('Freezer Pack #7', '$200', [
        '5 lb NY steak',
        '10 lb ground beef',
        '5 lb pork chops',
        '5 lb sirloin steak',
        '5 lb pork tenderloin',
      ]),
    ],
  },
  {
    slug: 'bulk-sale',
    title: 'Bulk sale',
    description: '10 lb packs.',
    products: [
      { name: 'Ground Pork', price: '$2.99/lb' },
      { name: 'Ground Pork, vac-packed', price: '$3.49/lb' },
      { name: 'Regular Ground Beef', price: '$6.99/lb' },
      { name: 'Regular Ground Beef, vac-packed 1 lb packages', price: '$7.49/lb' },
      { name: 'Lean Ground Beef', price: '$7.49/lb' },
      { name: 'Lean Ground Beef, vac-packed 1 lb packages', price: '$7.99/lb' },
      { name: 'Certified Angus Beef Patties', description: '5 oz each, 32 pc', price: '$79' },
      { name: 'Frozen Chicken Breast or Thigh, boneless', price: '$75' },
    ],
  },
  {
    slug: 'meat-trays',
    title: 'Meat trays & platters',
    description:
      'Only at our Roblin Blvd location. With in-store made meats and marble cheese. Minimum 24 hours notice.',
    products: [
      { name: '12" Platter', description: 'Serves 8–10 people', price: '$25.00 + taxes' },
      { name: '16" Platter', description: 'Serves 20–25 people', price: '$45.00 + taxes' },
      { name: '18" Platter', description: 'Serves 30–35 people', price: '$60.00 + taxes' },
      {
        name: 'Social Platters — 100+ people',
        description:
          'Includes platters, pickles, rye, paper plates and napkins. Meats: chicken, lunch meatloaf, salami, kielbasa roll, farmer roll, ham. Marble cheese sliced and/or cubed. 1 week notice required.',
        price: '$2.49 per person + tax',
      },
    ],
  },
  {
    slug: 'wild-game-processing',
    title: 'Wild game processing',
    description:
      'Sausage production minimum 10 lb per batch; sausage cost is calculated on final weight. Pork mix in 30% available. Prices plus GST.',
    products: [
      { name: 'Vac-pack packaging', description: 'On finished weight', price: '$0.60/lb' },
      { name: 'Cut only — elk / moose', price: '$0.85/lb' },
      { name: 'Cut only — deer', price: '$1.00/lb' },
      { name: 'Grinding straight', description: '2 lb packs', price: '$1.40/lb' },
      { name: 'Pork added into grinds', description: '2 lb packs', price: '$2.10/lb' },
      { name: 'Breakfast sausage (fresh)', price: '$2.80/lb' },
      { name: 'Italian sausage (fresh)', price: '$2.95/lb' },
      { name: 'Smokies (smoked)', price: '$3.25/lb' },
      { name: 'Cheese smokies (smoked)', price: '$3.95/lb' },
      { name: 'Farmer sausage (smoked)', price: '$3.25/lb' },
      { name: 'Ham garlic ring, fine (smoked)', price: '$3.25/lb' },
      { name: 'Deli sausage (smoked)', price: '$3.25/lb' },
      { name: 'Pepperettes (smoked sticks)', description: 'Honey garlic, sweet chili or kooby', price: '$3.35/lb' },
      { name: 'Cheese pepperettes (smoked)', price: '$3.95/lb' },
    ],
  },
]

/** Freezer packs shown in the "Customer favorites" slider on the home page. */
export const featuredProductNames = [
  'Freezer Pack #2 — BBQ Pack',
  'Freezer Pack #1 — Dine for 2',
  'Freezer Pack #6 — BBQ Pack',
]

export const partners = [
  { name: 'DeLuca’s Specialty Foods', website: 'http://www.deluca.ca/' },
  { name: 'Liv2Bake GF', website: 'https://www.instagram.com/liv.2.bake/' },
  { name: 'Smak-Dab Mustard', website: 'https://www.smakdab.ca/' },
  { name: 'Nature’s Farm', website: 'https://naturesfarm.ca/' },
  { name: 'Harvest Bakery', website: 'https://harvestbakeryanddeli.com/' },
  { name: 'Bothwell Cheese', website: 'http://www.bothwellcheese.com/' },
  { name: 'Hoffmann’s Fine Foods', website: 'https://hoffmannsfinefoods.ca/' },
  { name: 'Prairie Oils', website: 'https://prairieoils.ca/' },
  { name: 'Soy Harvest Candles', website: 'https://www.soyharvest.ca/' },
  { name: 'Reger Honey', website: 'https://regerhoneyfarm.ca/' },
]
