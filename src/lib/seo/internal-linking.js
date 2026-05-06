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

  links.relatedRecipes = findRelatedRecipes(recipe, allRecipes);
  links.categoryLinks = findCategoryLinks(recipe, categories);
  links.ingredientLinks = findIngredientLinks(recipe, allRecipes);
  links.techniqueLinks = findTechniqueLinks(recipe, allRecipes);
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

      if (recipe.category === category) score += 3;

      const commonTags = recipe.tags?.filter(tag => tags.includes(tag)) || [];
      score += commonTags.length * 2;

      if (recipe.cuisine === cuisine) score += 2;
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
    .filter(r => r.slug !== recipe.slug)
    .map(r => {
      const recipeIngredients = extractMainIngredients(r.ingredients || []);
      const commonIngredients = mainIngredients.filter(ing =>
        recipeIngredients.some(ri => ri.toLowerCase().includes(ing.toLowerCase()))
      );

      return {
        ...r,
        commonIngredients,
        ingredientScore: commonIngredients.length
      };
    })
    .filter(r => r.ingredientScore > 0)
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
  const seasonalTags = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
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
      return item
        .replace(/^\d+[\d,./]*\s*(g|kg|ml|l|EL|TL|Stück|Prise|Bund|Zehe|Scheibe|Scheiben|Dose|Pkg\.?)\s*/i, '')
        .replace(/\s*\([^)]*\)/, '')
        .split(',')[0]
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
    'Braten': ['braten', 'gebraten', 'anbraten', 'bratpfanne', 'pfanne'],
    'Backen': ['backen', 'gebacken', 'backofen', 'ofen', 'backblech'],
    'Kochen': ['kochen', 'gekocht', 'aufkochen', 'einkochen', 'sieden'],
    'Grillen': ['grillen', 'gegrillt', 'grill', 'grillieren'],
    'Dünsten': ['dünsten', 'gedünstet', 'dämpfen', 'gedämpft'],
    'Frittieren': ['frittieren', 'frittiert', 'fritteuse', 'ausbacken'],
    'Schmoren': ['schmoren', 'geschmort', 'schmorgericht', 'langzeitgaren'],
    'Überbacken': ['überbacken', 'gratinieren', 'gratiniert'],
    'Marinieren': ['marinieren', 'mariniert', 'marinade', 'einlegen']
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

  if (internalLinks.relatedRecipes.length > 0) {
    suggestions.push({
      title: 'Ähnliche Rezepte',
      links: internalLinks.relatedRecipes.slice(0, 3),
      type: 'related'
    });
  }

  if (internalLinks.ingredientLinks.length > 0) {
    suggestions.push({
      title: 'Mehr Rezepte mit ähnlichen Zutaten',
      links: internalLinks.ingredientLinks.slice(0, 3),
      type: 'ingredients'
    });
  }

  if (internalLinks.techniqueLinks.length > 0) {
    suggestions.push({
      title: 'Mehr Rezepte mit gleicher Technik',
      links: internalLinks.techniqueLinks.slice(0, 3),
      type: 'techniques'
    });
  }

  if (internalLinks.seasonalLinks.length > 0) {
    suggestions.push({
      title: 'Mehr Saisonrezepte',
      links: internalLinks.seasonalLinks.slice(0, 3),
      type: 'seasonal'
    });
  }

  return suggestions;
}
