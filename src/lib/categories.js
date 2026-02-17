/**
 * Comprehensive food categories for kochira (German)
 * Organized for optimal user experience and SEO
 * Categories match pillar pages and home page story categories
 */

export const PRIMARY_CATEGORIES = {
  'pfannkuchen': {
    name: 'Pfannkuchen',
    slug: 'pfannkuchen',
    description: 'Fluffige Pfannkuchen und Pancakes für jedes Frühstück',
    icon: '🥞',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/kategorien/pfannkuchen.webp',
    subcategories: ['Pfannkuchen', 'Pancakes', 'Crêpes', 'American Pancakes']
  },
  'waffeln': {
    name: 'Waffeln',
    slug: 'waffeln',
    description: 'Knusprige Waffeln für süße Momente',
    icon: '🧇',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/kategorien/waffeln.webp',
    subcategories: ['Waffeln', 'Belgische Waffeln', 'Knusperwaffeln']
  },
  'kuchen': {
    name: 'Kuchen',
    slug: 'kuchen',
    description: 'Saftige Kuchen und Torten für jede Gelegenheit',
    icon: '🍰',
    color: 'from-pink-400 to-red-500',
    image: '/images/kategorien/kuchen-marmorkuchen.webp',
    subcategories: ['Kuchen', 'Torten', 'Marmorkuchen', 'Gugelhupf']
  },
  'lasagne': {
    name: 'Lasagne',
    slug: 'lasagne',
    description: 'Klassische Lasagne mit köstlichen Zutaten',
    icon: '🍝',
    color: 'from-orange-400 to-red-500',
    image: '/images/kategorien/lasagne.webp',
    subcategories: ['Lasagne', 'Vegetarische Lasagne', 'Fischlasagne']
  },
  'airfryer': {
    name: 'Airfryer',
    slug: 'airfryer',
    description: 'Köstliche Rezepte für die Heißluftfritteuse',
    icon: '💨',
    color: 'from-blue-400 to-purple-500',
    image: '/images/kategorien/airfryer-kartoffeln.webp',
    subcategories: ['Airfryer', 'Heißluftfritteuse', 'Frittieren']
  },
  'schnell': {
    name: 'Schnell',
    slug: 'schnell',
    description: 'Schnelle Rezepte für unterwegs',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/kategorien/schnelles-abendessen-quesadilla.webp',
    subcategories: ['Schnell', 'Schnelle Gerichte', 'Unter 30 Minuten']
  },
  'gesund': {
    name: 'Gesund',
    slug: 'gesund',
    description: 'Gesunde und nährstoffreiche Rezepte',
    icon: '🥗',
    color: 'from-green-400 to-emerald-500',
    image: '/images/kategorien/gesunde-fruhstucks-bowl.webp',
    subcategories: ['Gesund', 'Gesunde Ernährung', 'Nährstoffreich']
  },
  'vegetarisch': {
    name: 'Vegetarisch',
    slug: 'vegetarisch',
    description: 'Leckere vegetarische Rezepte für jeden Tag',
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    image: '/images/kategorien/vegetarisches-ofengericht.webp',
    subcategories: ['Vegetarisch', 'Vegan', 'Pflanzenbasiert']
  },
  'pasta': {
    name: 'Pasta',
    slug: 'pasta',
    description: 'Klassische Pasta-Gerichte und Nudelrezepte für jeden Geschmack',
    icon: '🍝',
    color: 'from-orange-400 to-red-500',
    image: '/images/rezepte/trueffelpasta-mit-sahnesauce.webp', // Will use default or can be updated later
    subcategories: ['Pasta', 'Pasta mit Sahnesauce', 'Spaghetti', 'Penne', 'Fusilli', 'Tagliatelle', 'Carbonara', 'Bolognese', 'Trüffelpasta']
  },
  'gulasch': {
    name: 'Gulasch',
    slug: 'gulasch',
    description: 'Traditionelle Gulasch-Rezepte von klassisch bis modern',
    icon: '🍲',
    color: 'from-orange-500 to-red-600',
    image: '/images/rezepte/gulasch-ohne-anbraten.webp',
    subcategories: ['Gulasch', 'Rindergulasch', 'Rindergulasch Thermomix', 'Rindergulasch im Dutch Oven', 'Wiener Gulasch', 'Wildgulasch', 'Hirschgulasch', 'Rehgulasch', 'Veganes Gulasch', 'Ofen-Gulasch', 'Gulasch im Backofen', 'Schmorgericht', 'Wildgericht']
  },
  'muffins': {
    name: 'Muffins',
    slug: 'muffins',
    description: 'Leckere Muffins für jede Gelegenheit',
    icon: '🥧',
    color: 'from-pink-400 to-red-500',
    image: '/images/rezepte/glutenfreie-schokomuffins.webp',
    subcategories: ['Muffins', 'Muffins mit Schokolade', 'Muffins mit Nüssen', 'Muffins mit Früchten']
  },
  'kuerbissuppe': {
    name: 'Kürbissuppe',
    slug: 'kuerbissuppe',
    description: 'Kürbissuppe mit verschiedenen Zutaten',
    icon: '🍲',
    color: 'from-orange-400 to-red-500',
    image: '/images/rezepte/kuerbissuppe-mit-maronen.webp',
    subcategories: ['Kürbissuppe', 'Kürbissuppe mit Maronen', 'Kürbissuppe mit Garnelen', 'Kürbissuppe mit Mango', 'Kürbissuppe mit Apfel', 'Kürbissuppe mit Lachs', 'Kürbissuppe mit Hackfleisch', 'Kürbissuppe mit Feta', 'Kürbissuppe im Ofen']
  }
};

export const MEAL_TYPES = {
  'fruhstuck': { name: 'Frühstück', icon: '🌅' },
  'lunch': { name: 'Mittagessen', icon: '☀️' },
  'mittag': { name: 'Mittagessen', icon: '☀️' },
  'abendessen': { name: 'Abendessen', icon: '🌙' },
  'snack': { name: 'Snack', icon: '🍪' },
  'dessert': { name: 'Dessert', icon: '🍰' }
};

export const COOKING_METHODS = {
  'grill': { name: 'Grill & BBQ', icon: '🔥' },
  'stekning': { name: 'Braten & Wok', icon: '🍳' },
  'kokning': { name: 'Kochen & Eintopf', icon: '🍲' },
  'ra': { name: 'Roh & Salate', icon: '🥄' },
  'snabb': { name: 'Schnell (< 30 min)', icon: '⚡' },
  'langsam': { name: 'Langsames Kochen', icon: '⏰' },
  'enkel': { name: 'Einfach & Anfängerfreundlich', icon: '🍳' }
};

export const DIETARY_TAGS = {
  'vegetarisch': { name: 'Vegetarisch', icon: '🌱', color: 'green' },
  'vegan': { name: 'Vegan', icon: '🌿', color: 'emerald' },
  'glutenfrei': { name: 'Glutenfrei', icon: '🌾', color: 'amber' },
  'nussfrei': { name: 'Nussfrei', icon: '🥜', color: 'orange' },
  'laktosefrei': { name: 'Laktosefrei', icon: '🥛', color: 'blue' },
  'zuckerfrei': { name: 'Zuckerfrei', icon: '🍯', color: 'yellow' },
  'keto': { name: 'Keto', icon: '🥑', color: 'purple' },
  'low-carb': { name: 'Low-Carb', icon: '🏃‍♀️', color: 'red' },
  'proteinreich': { name: 'Proteinreich', icon: '💪', color: 'indigo' }
};

export const LIFESTYLE_TAGS = {
  'kinderfreundlich': { name: 'Kinderfreundlich', icon: '👶', color: 'pink' },
  'seniorenfreundlich': { name: 'Seniorenfreundlich', icon: '👴', color: 'gray' },
  'budgetfreundlich': { name: 'Budgetfreundlich', icon: '💰', color: 'green' },
  'schnell': { name: 'Schnell', icon: '⚡', color: 'yellow' },
  'alltag': { name: 'Alltag', icon: '🏠', color: 'blue' },
  'fest': { name: 'Fest', icon: '🎉', color: 'purple' },
  'gesund': { name: 'Gesund', icon: '💚', color: 'green' },
  'komfort': { name: 'Komfort', icon: '🤗', color: 'orange' }
};

export const DIFFICULTY_LEVELS = {
  'leicht': { name: 'Leicht', color: 'green', description: 'Perfekt für Anfänger' },
  'mittel': { name: 'Mittel', color: 'yellow', description: 'Benötigt etwas Erfahrung' },
  'schwer': { name: 'Schwer', color: 'red', description: 'Für erfahrene Köche' }
};

export const TIME_CATEGORIES = {
  'schnell': { name: 'Schnell', maxMinutes: 30, description: 'Unter 30 Minuten' },
  'mittel': { name: 'Mittellang', maxMinutes: 60, description: '30-60 Minuten' },
  'lang': { name: 'Lang', maxMinutes: 120, description: '1-2 Stunden' },
  'sehr-lang': { name: 'Sehr lang', maxMinutes: 999, description: 'Über 2 Stunden' }
};

/**
 * Get all categories for navigation
 */
export function getAllCategories() {
  return Object.values(PRIMARY_CATEGORIES);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug) {
  return PRIMARY_CATEGORIES[slug];
}

/**
 * Get all meal types
 */
export function getAllMealTypes() {
  return Object.entries(MEAL_TYPES).map(([key, value]) => ({
    key,
    ...value
  }));
}

/**
 * Get all cooking methods
 */
export function getAllCookingMethods() {
  return Object.entries(COOKING_METHODS).map(([key, value]) => ({
    key,
    ...value
  }));
}

/**
 * Get all dietary tags
 */
export function getAllDietaryTags() {
  return Object.entries(DIETARY_TAGS).map(([key, value]) => ({
    key,
    ...value
  }));
}

/**
 * Get all lifestyle tags
 */
export function getAllLifestyleTags() {
  return Object.entries(LIFESTYLE_TAGS).map(([key, value]) => ({
    key,
    ...value
  }));
}

/**
 * Get difficulty levels
 */
export function getDifficultyLevels() {
  return Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => ({
    key,
    ...value
  }));
}

/**
 * Get time categories
 */
export function getTimeCategories() {
  return Object.entries(TIME_CATEGORIES).map(([key, value]) => ({
    key,
    ...value
  }));
}
