/**
 * Smart Internal Linking System
 * Automatically generates relevant internal links for SEO
 */

import { getAllContent } from '@/lib/mdx';
import { getAllCategories } from '@/lib/categories';

/**
 * Generate smart internal links for a recipe
 */
export async function generateInternalLinks(recipe) {
  const allRecipes = await getAllContent('recipes');
  const categories = getAllCategories();
  
  const links = {
    relatedRecipes: [],
    categoryLinks: [],
    ingredientLinks: [],
    techniqueLinks: [],
    seasonalLinks: []
  };

  // Find related recipes by category and tags
  links.relatedRecipes = findRelatedRecipes(recipe, allRecipes);
  
  // Find category links
  links.categoryLinks = findCategoryLinks(recipe, categories);
  
  // Find ingredient-based links
  links.ingredientLinks = findIngredientLinks(recipe, allRecipes);
  
  // Find technique-based links
  links.techniqueLinks = findTechniqueLinks(recipe, allRecipes);
  
  // Find seasonal links
  links.seasonalLinks = findSeasonalLinks(recipe, allRecipes);

  return links;
}

/**
 * Find related recipes based on category and tags
 */
function findRelatedRecipes(currentRecipe, allRecipes) {
  const { category, tags = [], cuisine, mealType } = currentRecipe;
  
  return allRecipes
    .filter(recipe => recipe.slug !== currentRecipe.slug)
    .map(recipe => {
      let score = 0;
      
      // Category match
      if (recipe.category === category) score += 3;
      
      // Tag matches
      const commonTags = recipe.tags?.filter(tag => tags.includes(tag)) || [];
      score += commonTags.length * 2;
      
      // Cuisine match
      if (recipe.cuisine === cuisine) score += 2;
      
      // Meal type match
      if (recipe.mealType === mealType) score += 2;
      
      return { ...recipe, relevanceScore: score };
    })
    .filter(recipe => recipe.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6);
}

/**
 * Find category links
 */
function findCategoryLinks(recipe, categories) {
  return categories
    .filter(cat => cat.slug !== recipe.category?.toLowerCase())
    .slice(0, 4);
}

/**
 * Find ingredient-based links
 */
function findIngredientLinks(recipe, allRecipes) {
  if (!recipe.ingredients) return [];
  
  const mainIngredients = extractMainIngredients(recipe.ingredients);
  
  return allRecipes
    .filter(recipe => recipe.slug !== recipe.slug)
    .map(recipe => {
      const recipeIngredients = extractMainIngredients(recipe.ingredients || []);
      const commonIngredients = mainIngredients.filter(ing => 
        recipeIngredients.some(ri => ri.toLowerCase().includes(ing.toLowerCase()))
      );
      
      return {
        ...recipe,
        commonIngredients,
        ingredientScore: commonIngredients.length
      };
    })
    .filter(recipe => recipe.ingredientScore > 0)
    .sort((a, b) => b.ingredientScore - a.ingredientScore)
    .slice(0, 4);
}

/**
 * Find technique-based links
 */
function findTechniqueLinks(recipe, allRecipes) {
  const techniques = extractCookingTechniques(recipe);
  
  return allRecipes
    .filter(r => r.slug !== recipe.slug)
    .map(r => {
      const recipeTechniques = extractCookingTechniques(r);
      const commonTechniques = techniques.filter(t => recipeTechniques.includes(t));
      
      return {
        ...r,
        commonTechniques,
        techniqueScore: commonTechniques.length
      };
    })
    .filter(r => r.techniqueScore > 0)
    .sort((a, b) => b.techniqueScore - a.techniqueScore)
    .slice(0, 3);
}

/**
 * Find seasonal links
 */
function findSeasonalLinks(recipe, allRecipes) {
  const seasonalTags = ['Vår', 'Sommar', 'Höst', 'Vinter'];
  const currentSeasonalTags = recipe.tags?.filter(tag => seasonalTags.includes(tag)) || [];
  
  if (currentSeasonalTags.length === 0) return [];
  
  return allRecipes
    .filter(r => r.slug !== recipe.slug)
    .map(r => {
      const recipeSeasonalTags = r.tags?.filter(tag => seasonalTags.includes(tag)) || [];
      const commonSeasonal = currentSeasonalTags.filter(tag => recipeSeasonalTags.includes(tag));
      
      return {
        ...r,
        commonSeasonal,
        seasonalScore: commonSeasonal.length
      };
    })
    .filter(r => r.seasonalScore > 0)
    .sort((a, b) => b.seasonalScore - a.seasonalScore)
    .slice(0, 3);
}

/**
 * Extract main ingredients from recipe
 */
function extractMainIngredients(ingredients) {
  return ingredients
    .flatMap(section => section.items || [])
    .map(item => {
      // Extract main ingredient name (remove quantities and descriptions)
      return item
        .replace(/^\d+\s*(dl|ml|g|kg|st|krm|tsk|msk)\s*/, '') // Remove quantities
        .replace(/\s*\([^)]*\)/, '') // Remove parentheses
        .split(',')[0] // Take first part before comma
        .trim();
    })
    .filter(ingredient => ingredient.length > 2);
}

/**
 * Extract cooking techniques from recipe
 */
function extractCookingTechniques(recipe) {
  const techniques = [];
  const content = `${recipe.title} ${recipe.excerpt} ${recipe.steps?.map(s => s.description).join(' ') || ''}`;
  
  const techniqueKeywords = {
    'Stekning': ['stek', 'steka', 'stekt', 'stekpanna'],
    'Kokning': ['koka', 'kok', 'koki', 'koka'],
    'Grillning': ['grill', 'grilla', 'grillad'],
    'Sautering': ['sautera', 'sauter', 'wok'],
    'Braising': ['bräsera', 'bräser', 'långkok'],
    'Fritering': ['fritera', 'friter', 'fritös'],
    'Ångkokning': ['ånga', 'ångkok', 'steam'],
    'Röktning': ['rök', 'röka', 'rökt'],
    'Marinering': ['marinera', 'marin', 'marinad']
  };
  
  Object.entries(techniqueKeywords).forEach(([technique, keywords]) => {
    if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
      techniques.push(technique);
    }
  });
  
  return techniques;
}

/**
 * Generate contextual link suggestions
 */
export function generateContextualLinks(recipe, internalLinks) {
  const suggestions = [];
  
  // Add related recipes
  if (internalLinks.relatedRecipes.length > 0) {
    suggestions.push({
      title: 'Liknande recept',
      links: internalLinks.relatedRecipes.slice(0, 3),
      type: 'related'
    });
  }
  
  // Add ingredient-based links
  if (internalLinks.ingredientLinks.length > 0) {
    suggestions.push({
      title: 'Fler recept med liknande ingredienser',
      links: internalLinks.ingredientLinks.slice(0, 3),
      type: 'ingredients'
    });
  }
  
  // Add technique-based links
  if (internalLinks.techniqueLinks.length > 0) {
    suggestions.push({
      title: 'Fler recept med samma teknik',
      links: internalLinks.techniqueLinks.slice(0, 3),
      type: 'techniques'
    });
  }
  
  // Add seasonal links
  if (internalLinks.seasonalLinks.length > 0) {
    suggestions.push({
      title: 'Fler säsongsrecept',
      links: internalLinks.seasonalLinks.slice(0, 3),
      type: 'seasonal'
    });
  }
  
  return suggestions;
}
