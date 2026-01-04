import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all files from a directory
 */
export function getContentFiles(type) {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
}

/**
 * Get content by slug with MDX content (for RSC)
 */
export async function getContentBySlug(type, slug) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content, // Raw MDX content for MDXRemote RSC
    slug,
  };
}

/**
 * Get all content of a specific type
 */
export async function getAllContent(type) {
  const files = getContentFiles(type);
  
  const content = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(contentDirectory, type, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        ...data,
      };
    })
  );

  // Sort by publishedAt date (newest first)
  return content.sort((a, b) => {
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });
}

/**
 * Get related content with smart relevance scoring
 * Uses multiple factors to determine relevance and ensures stable results
 */
export async function getRelatedContent(type, currentSlug, tags, category, limit = 6) {
  const allContent = await getAllContent(type);
  
  // Find the current recipe to get all its metadata for comparison
  const currentRecipe = allContent.find(item => item.slug === currentSlug);
  if (!currentRecipe) {
    return [];
  }
  
  // Extract comparison fields from current recipe
  const {
    category: currentCategory,
    subcategory: currentSubcategory,
    tags: currentTags = [],
    cuisine: currentCuisine,
    mealType: currentMealType,
    cookingMethod: currentCookingMethod,
    dietaryTags: currentDietaryTags = [],
    difficulty: currentDifficulty,
  } = currentRecipe;
  
  // Calculate relevance score for each recipe
  // Filter by same category first to ensure focused related recipes
  const scoredRecipes = allContent
    .filter(item => 
      item.slug !== currentSlug && // Exclude current recipe
      item.category === currentCategory // Only recipes from same category
    )
    .map(item => {
      let score = 0;
      
      // Category match: +3 points (base score for being in same category)
      score += 3;
      
      // Subcategory match: +2 points (within same category)
      if (item.subcategory && currentSubcategory && item.subcategory === currentSubcategory) {
        score += 2;
      }
      
      // Tag matches: +2 points per shared tag
      const sharedTags = item.tags?.filter(tag => currentTags.includes(tag)) || [];
      score += sharedTags.length * 2;
      
      // Cuisine match: +2 points
      if (item.cuisine && currentCuisine && item.cuisine === currentCuisine) {
        score += 2;
      }
      
      // Meal type match: +2 points
      if (item.mealType && currentMealType && item.mealType === currentMealType) {
        score += 2;
      }
      
      // Cooking method match: +1 point
      if (item.cookingMethod && currentCookingMethod && item.cookingMethod === currentCookingMethod) {
        score += 1;
      }
      
      // Dietary tags overlap: +1 point per match (for recipes with dietary restrictions)
      if (item.dietaryTags && currentDietaryTags.length > 0) {
        const sharedDietaryTags = item.dietaryTags.filter(tag => 
          currentDietaryTags.includes(tag)
        );
        score += sharedDietaryTags.length;
      }
      
      // Difficulty match: +1 point (bonus for similar difficulty level)
      if (item.difficulty && currentDifficulty && item.difficulty === currentDifficulty) {
        score += 1;
      }
      
      return { ...item, relevanceScore: score };
    })
    .filter(item => item.relevanceScore > 0) // Only include recipes with some relevance
    .sort((a, b) => {
      // Primary sort: by relevance score (descending)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Secondary sort: by slug (ascending) for stability
      // This ensures recipes with the same score always appear in the same order
      // regardless of when new recipes are added
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);

  return scoredRecipes;
}

