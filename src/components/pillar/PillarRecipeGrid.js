import { getContentBySlug } from '@/lib/mdx';
import RecipeCard from '@/components/recipe/RecipeCard';

/**
 * Recipe grid section for pillar pages
 * Displays related recipes in a grid layout
 * Server component - fetches recipe data server-side
 */
export default async function PillarRecipeGrid({ recipeSlugs = [], title = "Related Recipes" }) {
  // Fetch recipe data for the provided slugs
  // Skip if no valid slugs provided
  if (!recipeSlugs || recipeSlugs.length === 0) {
    return null;
  }

  const recipes = await Promise.all(
    recipeSlugs
      .filter(slug => slug && slug !== 'recipe-slug-1' && slug !== 'recipe-slug-2') // Filter out empty/invalid/placeholder slugs
      .map(async (slug) => {
        try {
          const recipe = await getContentBySlug('recipes', slug);
          return recipe ? { ...recipe.frontmatter, slug: recipe.slug } : null;
        } catch (error) {
          // Silently fail for missing recipes
          return null;
        }
      })
  );

  // Filter out null results
  const validRecipes = recipes.filter(Boolean);

  if (validRecipes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore related recipes from this guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {validRecipes.map((recipe, index) => (
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
}
