import { getAllContent } from '@/lib/mdx';
import RecipeListingClient from '@/components/recipe/RecipeListingClient';
import { Suspense } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { generateItemListSchema } from '@/lib/seo';
import { getAllCategories } from '@/lib/categories';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Alla recept - Matrecept för alla tillfällen',
  description: 'Utforska hundratals provlagade matrecept från Bakstunden. Från kyckling och pasta till vegetariskt och dessert - hitta din nya favorit!',
  keywords: 'recept, mat, matlagning, kyckling, pasta, vegetariskt, kladdkaka, pannkakor, svenska recept, frukost, lunch, middag, dessert, familjerecept',
  openGraph: {
    title: 'Alla recept | Bakstunden',
    description: 'Utforska hundratals provlagade matrecept från Bakstunden. Från kyckling och pasta till vegetariskt och dessert - hitta din nya favorit!',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Svenska matrecept - Bakstunden',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alla recept | Bakstunden',
    description: 'Utforska hundratals provlagade matrecept från Bakstunden. Från kyckling och pasta till vegetariskt och dessert - hitta din nya favorit!',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default async function RecipesPage({ searchParams }) {
  // Redirect /recept?category=... to /kategorier/[slug]
  const params = await searchParams;

  if (params?.category) {
    const categoryName = params.category;
    const allCategories = getAllCategories();
    const categoryObj = allCategories.find(cat => cat.name === categoryName);
    
    if (categoryObj) {
      redirect(`/kategorier/${categoryObj.slug}`);
    }
  }

  // Load all recipes from MDX files
  const recipes = await getAllContent('recipes');

  // Generate structured data for recipe listing
  // Do NOT pass 'Recipe' type - only recipe pages should have Recipe schema
  const recipeListSchema = generateItemListSchema(recipes.slice(0, 20));

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={recipeListSchema} />
      
      <Suspense>
        <RecipeListingClient initialRecipes={recipes} />
      </Suspense>
    </>
  );
}

