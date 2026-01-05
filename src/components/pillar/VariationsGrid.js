import { getAllContent } from '@/lib/mdx';
import RecipeCard from '@/components/recipe/RecipeCard';

/**
 * Variations Grid - Auto-populated from filterTag
 * Dynamically loads recipes matching the filterTag
 */
export default async function VariationsGrid({ filterTag, title = "Variations" }) {
  if (!filterTag) {
    return null;
  }

  try {
    // Get all recipes
    const allRecipes = await getAllContent('recipes');
    
    // Filter recipes by tag (case-insensitive)
    const variations = allRecipes
      .filter(recipe => {
        const tags = recipe.tags || [];
        const category = recipe.category || '';
        const recipeName = (recipe.recipeName || recipe.title || '').toLowerCase();
        const filterLower = filterTag.toLowerCase();
        
        // Match if tag contains filterTag or recipe name contains filterTag
        return tags.some(tag => tag.toLowerCase().includes(filterLower)) ||
               category.toLowerCase().includes(filterLower) ||
               recipeName.includes(filterLower);
      })
      .slice(0, 12); // Limit to 12 variations

    if (variations.length === 0) {
      return null;
    }

    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore all {filterTag} variations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {variations.map((recipe, index) => (
              <RecipeCard 
                key={recipe.slug} 
                recipe={recipe} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading variations:', error);
    return null;
  }
}

