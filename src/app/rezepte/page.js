import { getAllContent } from '@/lib/mdx';
import RecipeListingClient from '@/components/recipe/RecipeListingClient';
import { Suspense } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { generateItemListSchema } from '@/lib/seo';
import { getAllCategories } from '@/lib/categories';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Alle Rezepte - Kochrezepte für jeden Anlass',
  description: 'Entdecke hunderte getestete Rezepte von Kochera. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
  keywords: 'Rezepte, Essen, Kochen, Hähnchen, Pasta, vegetarisch, Brownie, Pfannkuchen, deutsche Rezepte, Frühstück, Mittagessen, Abendessen, Dessert, Familienrezepte',
  openGraph: {
    title: 'Alle Rezepte | Kochera',
    description: 'Entdecke hunderte getestete Rezepte von Kochera. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Deutsche Rezepte - Kochera',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alle Rezepte | Kochera',
    description: 'Entdecke hunderte getestete Rezepte von Kochera. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
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

