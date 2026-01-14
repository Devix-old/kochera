import { getAllContent } from '@/lib/mdx';
import EnhancedHomeClient from '@/components/EnhancedHomeClient';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebsiteSchema, generateOrganizationSchema, generateItemListSchema } from '@/lib/seo';

export default async function Home() {
  // Load all recipes to calculate dynamic counts
  const allRecipes = await getAllContent('recipes');

  // Try to load authors (may not exist yet)
  let allAuthors = [];
  try {
    allAuthors = await getAllContent('authors');
  } catch (error) {
    // Authors don't exist yet, use empty array
    allAuthors = [];
  }

  // Get manually selected homepage featured recipes
  const featuredRecipes = allRecipes.filter(r => r.homepageFeatured === true);

  // Calculate tag counts dynamically
  const tagCounts = {};
  allRecipes.forEach(recipe => {
    if (recipe.tags) {
      recipe.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Get all categories and select the most relevant ones for homepage
  const { getAllCategories } = await import('@/lib/categories');
  const allCategories = getAllCategories();
  
  // Use all available categories (new structure uses German categories)
  const popularCategories = allCategories.map(category => {
    return {
      name: category.name,
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      description: category.description,
      count: `${tagCounts[category.name] || 0}+ Rezepte`
    };
  }).filter(cat => cat.name); // Filter out any undefined categories

  // Generate structured data
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();
  // Do NOT pass 'Recipe' type - only recipe pages should have Recipe schema
  const recipeListSchema = generateItemListSchema(featuredRecipes.slice(0, 10));
  

  return (
    <>
      {/* Structured Data - Schema.org JSON-LD */}
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={recipeListSchema} />
      
      <EnhancedHomeClient
        popularCategories={popularCategories}
        totalRecipes={allRecipes.length}
        featuredRecipes={featuredRecipes}
        allRecipes={allRecipes}
        authors={allAuthors}
      />
    </>
  );
}
