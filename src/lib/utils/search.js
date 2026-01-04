/**
 * Client-side search utilities
 */

/**
 * Exact keyword search implementation
 */
export function fuzzyMatch(text, search) {
  if (!text || !search) return false;
  
  const searchLower = search.toLowerCase().trim();
  const textLower = text.toLowerCase();
  
  // Exact match - search term must be contained in the text
  return textLower.includes(searchLower);
}

/**
 * Search through content items
 */
export function searchContent(items, query) {
  if (!query || query.trim() === '') return items;
  
  const searchTerm = query.trim();
  
  return items.filter(item => {
    // Search in title
    if (fuzzyMatch(item.title, searchTerm)) return true;
    
    // Search in excerpt
    if (item.excerpt && fuzzyMatch(item.excerpt, searchTerm)) return true;
    
    // Search in tags
    if (item.tags && item.tags.some(tag => fuzzyMatch(tag, searchTerm))) return true;
    
    // Search in category
    if (item.category && fuzzyMatch(item.category, searchTerm)) return true;
    
    return false;
  });
}

/**
 * Filter recipes by various criteria
 */
export function filterRecipes(recipes, filters) {
  let filtered = [...recipes];
  
  // Filter by category (new category system)
  if (filters.category && filters.category !== 'alla') {
    filtered = filtered.filter(r =>
      r.category === filters.category ||
      (r.tags && r.tags.some(tag =>
        // Check if any tag matches the category name or subcategories
        tag.toLowerCase().includes(filters.category.toLowerCase()) ||
        filters.category.toLowerCase().includes(tag.toLowerCase())
      ))
    );
  }

  // Filter by subcategory
  if (filters.subcategory && filters.subcategory !== 'alla') {
    filtered = filtered.filter(r => 
      r.subcategory === filters.subcategory ||
      (r.tags && r.tags.includes(filters.subcategory))
    );
  }
  
  // Filter by meal type
  if (filters.mealType && filters.mealType !== 'alla') {
    filtered = filtered.filter(r => r.mealType === filters.mealType);
  }
  
  
  // Filter by cooking method
  if (filters.cookingMethod && filters.cookingMethod !== 'alla') {
    filtered = filtered.filter(r => r.cookingMethod === filters.cookingMethod);
  }
  
  // Filter by dietary tags
  if (filters.dietaryTags && filters.dietaryTags.length > 0) {
    filtered = filtered.filter(r => 
      r.dietaryTags && filters.dietaryTags.some(tag => r.dietaryTags.includes(tag))
    );
  }
  
  // Filter by lifestyle tags
  if (filters.lifestyleTags && filters.lifestyleTags.length > 0) {
    filtered = filtered.filter(r => 
      r.lifestyleTags && filters.lifestyleTags.some(tag => r.lifestyleTags.includes(tag))
    );
  }
  
  // Filter by difficulty
  if (filters.difficulty && filters.difficulty !== 'alla') {
    filtered = filtered.filter(r => r.difficulty === filters.difficulty);
  }
  
  // Filter by max time
  if (filters.maxTime) {
    filtered = filtered.filter(r => r.totalTimeMinutes <= parseInt(filters.maxTime));
  }
  
  // Filter by time category
  if (filters.timeCategory) {
    const timeCategories = {
      'snabb': 30,
      'medel': 60,
      'lång': 120,
      'mycket-lång': 999
    };
    const maxTime = timeCategories[filters.timeCategory];
    if (maxTime) {
      filtered = filtered.filter(r => r.totalTimeMinutes <= maxTime);
    }
  }
  
  // Filter by tags (legacy support)
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(r => 
      r.tags && filters.tags.some(tag => r.tags.includes(tag))
    );
  }
  
  // Filter by allergens (exclude recipes with specified allergens)
  if (filters.excludeAllergens && filters.excludeAllergens.length > 0) {
    filtered = filtered.filter(r => {
      if (!r.allergens) return true;
      return !filters.excludeAllergens.some(allergen => r.allergens.includes(allergen));
    });
  }
  
  // Filter by ingredients (include recipes with specified ingredients)
  if (filters.includeIngredients && filters.includeIngredients.length > 0) {
    filtered = filtered.filter(r => {
      if (!r.ingredients) return false;
      const allIngredients = r.ingredients.flatMap(section => section.items || []);
      return filters.includeIngredients.some(ingredient => 
        allIngredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    });
  }
  
  // Filter by exclude ingredients
  if (filters.excludeIngredients && filters.excludeIngredients.length > 0) {
    filtered = filtered.filter(r => {
      if (!r.ingredients) return true;
      const allIngredients = r.ingredients.flatMap(section => section.items || []);
      return !filters.excludeIngredients.some(ingredient => 
        allIngredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    });
  }
  
  return filtered;
}

/**
 * Sort recipes
 */
export function sortRecipes(recipes, sortBy = 'newest') {
  const sorted = [...recipes];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    
    case 'rating':
      return sorted.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
    
    case 'quickest':
      return sorted.sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes);
    
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'sv'));
    
    default:
      return sorted;
  }
}

/**
 * Get unique values for filters
 */
export function getUniqueFilterValues(recipes, field) {
  const values = new Set();
  
  recipes.forEach(recipe => {
    if (Array.isArray(recipe[field])) {
      recipe[field].forEach(v => values.add(v));
    } else if (recipe[field]) {
      values.add(recipe[field]);
    }
  });
  
  return Array.from(values).sort();
}

