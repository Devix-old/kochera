/**
 * Comprehensive food categories for Bakstunden
 * Organized for optimal user experience and SEO
 */

export const PRIMARY_CATEGORIES = {
  'kycklingfars': {
    name: 'Kycklingfärs',
    slug: 'kycklingfars-recept',
    description: 'Saftiga kycklingfärsrecept för vardag och fest',
    icon: '🍗',
    color: 'from-orange-400 to-red-500',
    image: '/images/recipes/kycklingfarsbullar-i-tomatsas.webp',
    subcategories: ['Köttbullar', 'Färsbiffar', 'Köttfärs', 'Kycklingfärs']
  },
  'kyckling': {
    name: 'Kyckling',
    slug: 'kyckling-recept',
    description: 'Mörbakat kycklingrecept med perfekt smak',
    icon: '🐔',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/recipes/varldens-godaste-kyckling-i-ugn.webp',
    subcategories: ['Kycklingbröst', 'Kycklinglår', 'Hel kyckling', 'Kycklingfilé']
  },
  'pasta': {
    name: 'Pasta',
    slug: 'pasta-recept',
    description: 'Autentiska pastarecept från Italien och världen',
    icon: '🍝',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/recipes/kramig-pasta-soltorkade-tomater.webp',
    subcategories: ['Spaghetti', 'Penne', 'Fettuccine', 'Lasagne', 'Ravioli']
  },
  'kycklinglarfile': {
    name: 'Kycklinglårfilé',
    slug: 'kycklinglarfile-recept',
    description: 'Mör kycklinglårfilé med saftig smak',
    icon: '🍖',
    color: 'from-amber-400 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop',
    subcategories: ['Kycklinglår', 'Lårfilé', 'Kycklingben']
  },
  'lax': {
    name: 'Lax',
    slug: 'lax-recept',
    description: 'Färsk lax med omega-3 och fantastisk smak',
    icon: '🐟',
    color: 'from-pink-400 to-red-500',
    image: '/images/recipes/lax-i-ugn-med-honung-och-soja.webp',
    subcategories: ['Laxfilé', 'Gravad lax', 'Rökt lax', 'Laxburgare']
  },
  'lasagne': {
    name: 'Lasagne',
    slug: 'lasagne-recept',
    description: 'Klassisk lasagne med köttfärs och ost',
    icon: '🍽️',
    color: 'from-orange-400 to-red-500',
    image: '/images/recipes/klassisk-lasagne.webp',
    subcategories: ['Köttfärslasagne', 'Vegetarisk lasagne', 'Fiskelassagne']
  },
  'scones': {
    name: 'Scones',
    slug: 'scones-recept',
    description: 'Fluffiga scones med te och sylt',
    icon: '🥐',
    color: 'from-amber-400 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    subcategories: ['Klassiska scones', 'Chokladscones', 'Fruktscones']
  },
  'vegetariska': {
    name: 'Vegetariska',
    slug: 'vegetariska-recept',
    description: 'Näringsrika vegetariska recept för alla',
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    subcategories: ['Vegetariska', 'Veganska', 'Plantbaserade']
  },
  'appelmos': {
    name: 'Äppelmos',
    slug: 'appelmos-recept',
    description: 'Hemlagat äppelmos med kanel och socker',
    icon: '🍎',
    color: 'from-red-400 to-pink-500',
    image: '/images/recipes/appelmos.webp',
    subcategories: ['Klassiskt äppelmos', 'Kanelmos', 'Söta äpplen']
  },
  'kladdkaka': {
    name: 'Kladdkaka',
    slug: 'kladdkaka-recept',
    description: 'Kladdig chokladkaka som smälter i munnen',
    icon: '🍫',
    color: 'from-amber-600 to-yellow-700',
    image: '/images/recipes/klassisk-kladdkaka.webp',
    subcategories: ['Kladdkaka', 'Chokladkaka', 'Brownies']
  },
  'chokladbollar': {
    name: 'Chokladbollar recept',
    slug: 'chokladbollar-recept',
    description: 'Hemlagade chokladbollar utan bakning',
    icon: '🍪',
    color: 'from-amber-600 to-yellow-700',
    image: '/images/recipes/chokladbollar-med-kaffe-recept.webp',
    subcategories: ['Chokladbollar', 'Kokosbollar', 'No-bake']
  },
  'appelpaj': {
    name: 'Äppelpaj',
    slug: 'appelpaj-recept',
    description: 'Klassisk äppelpaj med smuldeg och kanel',
    icon: '🥧',
    color: 'from-amber-400 to-orange-500',
    image: '/images/recipes/appelpaj-klassisk-svensk.webp',
    subcategories: ['Äppelpaj', 'Smuldeg', 'Fruktpaj']
  },
  'kaka-cookies': {
    name: 'Kaka & cookies',
    slug: 'kaka-cookies-recept',
    description: 'Hemlagade kakor och cookies för fika',
    icon: '🍪',
    color: 'from-amber-400 to-yellow-500',
    image: '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    subcategories: ['Kakor', 'Cookies', 'Fikabröd']
  },
  'vafflor': {
    name: 'Våfflor',
    slug: 'vafflor-recept',
    description: 'Fluffiga våfflor med sylt och grädde',
    icon: '🧇',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/recipes/belgiska-vafflor.webp',
    subcategories: ['Klassiska våfflor', 'Belgiska våfflor', 'Frasvåfflor']
  },
  'pannkakor': {
    name: 'Pannkakor',
    slug: 'pannkakor-recept',
    description: 'Svenska pannkakor med sylt och grädde',
    icon: '🥞',
    color: 'from-yellow-400 to-orange-500',
    image: '/images/recipes/amerikanska-pannkakor.webp',
    subcategories: ['Svenska pannkakor', 'Amerikanska pannkakor', 'Glutenfria pannkakor']
  },
  'pinsa': {
    name: 'Pinsa',
    slug: 'pinsa-recept',
    description: 'Italiensk pinsa med krispig botten och saftiga pålägg',
    icon: '🍕',
    color: 'from-orange-400 to-red-500',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    subcategories: ['Klassisk pinsa', 'Pinsa med ost', 'Vegetarisk pinsa']
  },
  'soppor': {
    name: 'Soppor',
    slug: 'soppor',
    description: 'Värmande och mättande soppor för alla årstider',
    icon: '🍲',
    color: 'from-orange-500 to-red-600',
    image: '/images/recipes/gronkalssoppa.webp',
    subcategories: ['Vegetarisk soppa', 'Krämig soppa', 'Köttsoppa', 'Fisksoppa', 'Grönsakssoppa']
  }
};


export const MEAL_TYPES = {
  'frukost': { name: 'Frukost', icon: '🌅' },
  'lunch': { name: 'Lunch', icon: '☀️' },
  'middag': { name: 'Middag', icon: '🌙' },
  'snack': { name: 'Snack', icon: '🍪' },
  'dessert': { name: 'Dessert', icon: '🍰' }
};

export const COOKING_METHODS = {
  'grill': { name: 'Grill & BBQ', icon: '🔥' },
  'stekning': { name: 'Stekning & Wok', icon: '🍳' },
  'kokning': { name: 'Kokning & Gryta', icon: '🍲' },
  'ra': { name: 'Rå mat & Sallader', icon: '🥄' },
  'snabb': { name: 'Snabbmat (< 30 min)', icon: '⚡' },
  'langsam': { name: 'Långsam matlagning', icon: '⏰' },
  'enkel': { name: 'Enkelt & Nybörjarvänligt', icon: '🍳' }
};

export const DIETARY_TAGS = {
  'vegetariskt': { name: 'Vegetariskt', icon: '🌱', color: 'green' },
  'veganskt': { name: 'Veganskt', icon: '🌿', color: 'emerald' },
  'glutenfritt': { name: 'Glutenfritt', icon: '🌾', color: 'amber' },
  'nötfritt': { name: 'Nötfritt', icon: '🥜', color: 'orange' },
  'laktosfritt': { name: 'Laktosfritt', icon: '🥛', color: 'blue' },
  'sockerfritt': { name: 'Sockerfritt', icon: '🍯', color: 'yellow' },
  'keto': { name: 'Keto', icon: '🥑', color: 'purple' },
  'lågkolhydrat': { name: 'Lågkolhydrat', icon: '🏃‍♀️', color: 'red' },
  'proteinfokuserat': { name: 'Proteinfokuserat', icon: '💪', color: 'indigo' }
};

export const LIFESTYLE_TAGS = {
  'barnvänligt': { name: 'Barnvänligt', icon: '👶', color: 'pink' },
  'seniorvänligt': { name: 'Seniorvänligt', icon: '👴', color: 'gray' },
  'budgetvänligt': { name: 'Budgetvänligt', icon: '💰', color: 'green' },
  'snabbmat': { name: 'Snabbmat', icon: '⚡', color: 'yellow' },
  'vardagsmat': { name: 'Vardagsmat', icon: '🏠', color: 'blue' },
  'festmat': { name: 'Festmat', icon: '🎉', color: 'purple' },
  'hälsosam': { name: 'Hälsosam', icon: '💚', color: 'green' },
  'komfort': { name: 'Komfortmat', icon: '🤗', color: 'orange' }
};

export const DIFFICULTY_LEVELS = {
  'lätt': { name: 'Lätt', color: 'green', description: 'Perfekt för nybörjare' },
  'medel': { name: 'Medel', color: 'yellow', description: 'Kräver lite erfarenhet' },
  'svår': { name: 'Svår', color: 'red', description: 'För erfarna kockar' }
};

export const TIME_CATEGORIES = {
  'snabb': { name: 'Snabbmat', maxMinutes: 30, description: 'Under 30 minuter' },
  'medel': { name: 'Medellång', maxMinutes: 60, description: '30-60 minuter' },
  'lång': { name: 'Lång', maxMinutes: 120, description: '1-2 timmar' },
  'mycket-lång': { name: 'Mycket lång', maxMinutes: 999, description: 'Över 2 timmar' }
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
  // Handle both 'kladdkaka' and 'kladdkaka-recept' formats
  const key = slug.replace('-recept', '');
  return PRIMARY_CATEGORIES[key];
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
