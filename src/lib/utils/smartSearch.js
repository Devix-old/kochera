/**
 * Modern Smart Search Algorithm
 * Features:
 * - Fuzzy matching with relevance scoring
 * - Ingredient search
 * - Multi-field search (title, tags, category, ingredients, excerpt)
 * - Typo tolerance
 * - Relevance ranking
 */

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

/**
 * Calculate similarity score (0-1)
 */
function calculateSimilarity(str1, str2) {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Extract ingredients from recipe
 */
function extractIngredients(recipe) {
  if (!recipe.ingredients) return [];
  
  return recipe.ingredients
    .flatMap(section => section.items || [])
    .map(item => {
      // Remove quantities and measurements, keep ingredient name
      return item
        .replace(/\d+\s*(g|kg|ml|l|dl|cl|tsk|msk|st|stycken|krm|pkt|burk|flaska)/gi, '')
        .replace(/\d+/g, '')
        .trim();
    })
    .filter(Boolean);
}

/**
 * Smart search with relevance scoring
 */
export function smartSearch(recipes, query) {
  if (!query || query.trim() === '') return recipes.map(r => ({ ...r, relevanceScore: 0 }));

  const searchTerms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0);

  if (searchTerms.length === 0) return recipes.map(r => ({ ...r, relevanceScore: 0 }));

  const results = recipes.map(recipe => {
    let score = 0;
    const maxScore = 100;

    // Extract all searchable text
    const title = (recipe.title || '').toLowerCase();
    const excerpt = (recipe.excerpt || '').toLowerCase();
    const category = (recipe.category || '').toLowerCase();
    const tags = (recipe.tags || []).map(t => t.toLowerCase());
    const ingredients = extractIngredients(recipe).map(i => i.toLowerCase());

    // Search each term
    searchTerms.forEach(term => {
      // Exact title match (highest priority)
      if (title === term) {
        score += 40;
      } else if (title.includes(term)) {
        score += 30;
      } else {
        const titleSimilarity = calculateSimilarity(title, term);
        if (titleSimilarity > 0.7) {
          score += 20 * titleSimilarity;
        }
      }

      // Category match
      if (category.includes(term)) {
        score += 15;
      }

      // Tag match
      tags.forEach(tag => {
        if (tag === term) {
          score += 12;
        } else if (tag.includes(term)) {
          score += 8;
        }
      });

      // Ingredient match
      ingredients.forEach(ingredient => {
        if (ingredient.includes(term)) {
          score += 10;
        } else {
          const ingSimilarity = calculateSimilarity(ingredient, term);
          if (ingSimilarity > 0.8) {
            score += 8 * ingSimilarity;
          }
        }
      });

      // Excerpt match
      if (excerpt.includes(term)) {
        score += 5;
      }
    });

    // Boost score for multiple term matches
    const matchedFields = [
      title,
      category,
      ...tags,
      ...ingredients,
      excerpt
    ].filter(field => 
      searchTerms.some(term => field.includes(term))
    ).length;

    if (matchedFields > 1) {
      score += matchedFields * 2;
    }

    return {
      ...recipe,
      relevanceScore: Math.min(score, maxScore)
    };
  });

  // Filter out zero-score results and sort by relevance
  return results
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Generate search suggestions based on recipes
 */
export function generateSearchSuggestions(recipes, query, limit = 8) {
  if (!query || query.trim().length < 2) return [];

  const queryLower = query.toLowerCase().trim();
  const suggestions = new Set();

  recipes.forEach(recipe => {
    // Title suggestions
    if (recipe.title && recipe.title.toLowerCase().includes(queryLower)) {
      suggestions.add(recipe.title);
    }

    // Category suggestions
    if (recipe.category && recipe.category.toLowerCase().includes(queryLower)) {
      suggestions.add(recipe.category);
    }

    // Tag suggestions
    if (recipe.tags) {
      recipe.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    }

    // Ingredient suggestions
    const ingredients = extractIngredients(recipe);
    ingredients.forEach(ingredient => {
      if (ingredient.toLowerCase().includes(queryLower)) {
        suggestions.add(ingredient);
      }
    });
  });

  return Array.from(suggestions)
    .slice(0, limit)
    .sort((a, b) => {
      // Prioritize shorter, more exact matches
      const aIndex = a.toLowerCase().indexOf(queryLower);
      const bIndex = b.toLowerCase().indexOf(queryLower);
      
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.length - b.length;
    });
}

/**
 * Get popular search terms
 */
export function getPopularSearchTerms(recipes, limit = 10) {
  const termCounts = new Map();

  recipes.forEach(recipe => {
    // Count category
    if (recipe.category) {
      termCounts.set(recipe.category, (termCounts.get(recipe.category) || 0) + 3);
    }

    // Count tags
    if (recipe.tags) {
      recipe.tags.forEach(tag => {
        termCounts.set(tag, (termCounts.get(tag) || 0) + 2);
      });
    }
  });

  return Array.from(termCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term]) => term);
}

