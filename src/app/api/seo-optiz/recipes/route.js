import { getAllContent } from '@/lib/mdx';
import { PRIMARY_CATEGORIES } from '@/lib/categories';

export const dynamic = 'force-dynamic';

// Security: Only allow in development/localhost
function isLocalRequest(request) {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development';
}

export async function GET(request) {
  // Security check
  if (!isLocalRequest(request)) {
    return Response.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('category');

    // Force fresh data - no caching
    const allRecipes = await getAllContent('recipes');

    // If category is specified, filter by category
    if (categoryKey && PRIMARY_CATEGORIES[categoryKey]) {
      const category = PRIMARY_CATEGORIES[categoryKey];
      
      // More robust filtering - check multiple ways a recipe can belong to a category
      const filteredRecipes = allRecipes
        .filter(r => {
          // Normalize category names for comparison
          const recipeCategory = (r.category || '').trim();
          const categoryName = category.name.trim();
          
          // Exact match
          if (recipeCategory === categoryName) return true;
          
          // Case-insensitive match
          if (recipeCategory.toLowerCase() === categoryName.toLowerCase()) return true;
          
          // Check if recipe category contains category name or vice versa
          if (recipeCategory.toLowerCase().includes(categoryName.toLowerCase()) ||
              categoryName.toLowerCase().includes(recipeCategory.toLowerCase())) {
            return true;
          }
          
          // Check tags against subcategories
          if (r.tags && Array.isArray(r.tags)) {
            const hasMatchingTag = r.tags.some(tag => {
              const normalizedTag = (tag || '').trim().toLowerCase();
              return category.subcategories && category.subcategories.some(subcat => {
                const normalizedSubcat = (subcat || '').trim().toLowerCase();
                return normalizedTag === normalizedSubcat || 
                       normalizedTag.includes(normalizedSubcat) ||
                       normalizedSubcat.includes(normalizedTag);
              });
            });
            if (hasMatchingTag) return true;
          }
          
          // Check primaryCategory field if it exists
          if (r.primaryCategory && r.primaryCategory === categoryKey) return true;
          
          return false;
        })
        .map(r => ({
          slug: r.slug,
          recipeName: (r.recipeName || r.title || '').trim(),
          title: (r.title || '').trim(),
          category: (r.category || '').trim(),
          publishedAt: r.publishedAt || '',
        }))
        .filter(r => r.recipeName) // Only include recipes with a name
        .sort((a, b) => {
          // Sort by recipeName for easy duplicate detection
          const nameA = (a.recipeName || '').toLowerCase();
          const nameB = (b.recipeName || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });

      return Response.json({
        category: category.name,
        categoryKey,
        recipes: filteredRecipes,
        count: filteredRecipes.length,
        timestamp: new Date().toISOString(), // Add timestamp for cache busting
      });
    }

    // If no category specified, return all recipes grouped by category
    const recipesByCategory = {};
    
    Object.keys(PRIMARY_CATEGORIES).forEach(categoryKey => {
      const category = PRIMARY_CATEGORIES[categoryKey];
      const categoryRecipes = allRecipes.filter(r => {
        return r.category === category.name || 
               (r.tags && r.tags.some(tag => 
                 category.subcategories && category.subcategories.includes(tag)
               ));
      });
      
      recipesByCategory[categoryKey] = {
        category: category.name,
        count: categoryRecipes.length,
        recipes: categoryRecipes.map(r => ({
          slug: r.slug,
          recipeName: r.recipeName || r.title || '',
          title: r.title || '',
        })),
      };
    });

    return Response.json({
      recipesByCategory,
      totalRecipes: allRecipes.length,
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to fetch recipes', 
      details: error.message,
    }, { status: 500 });
  }
}

