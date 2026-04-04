import { getAllContent } from '@/lib/mdx';
import RecipeListingClient from '@/components/recipe/RecipeListingClient';
import { Suspense } from 'react';
import StructuredData from '@/components/seo/StructuredData';
import { generateItemListSchema } from '@/lib/seo';
import { getAllCategories } from '@/lib/categories';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { normalizeUrl } from '@/lib/utils/url';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochira.de';

export const metadata = {
  title: 'Alle Rezepte - Kochrezepte für jeden Anlass',
  description: 'Entdecke hunderte getestete Rezepte von kochira. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
  keywords: 'Rezepte, Essen, Kochen, Hähnchen, Pasta, vegetarisch, Brownie, Pfannkuchen, deutsche Rezepte, Frühstück, Mittagessen, Abendessen, Dessert, Familienrezepte',
  alternates: {
    canonical: normalizeUrl(siteUrl, '/rezepte'),
  },
  openGraph: {
    title: 'Alle Rezepte | kochira',
    description: 'Entdecke hunderte getestete Rezepte von kochira. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Deutsche Rezepte - kochira',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alle Rezepte | kochira',
    description: 'Entdecke hunderte getestete Rezepte von kochira. Von Hähnchen und Pasta bis zu vegetarisch und Dessert - finde dein neues Lieblingsrezept!',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default async function RecipesPage({ searchParams }) {
  // Redirect /recept?category=... to /[slug]
  const params = await searchParams;

  if (params?.category) {
    const categoryName = params.category;
    const allCategories = getAllCategories();
    const categoryObj = allCategories.find(cat => cat.name === categoryName);
    
    if (categoryObj) {
      redirect(`/${categoryObj.slug}`);
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
      
      {/* 🧭 BREADCRUMB SECTION */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Rezepte' },
            ]}
          />
        </div>
      </section>
      
      <Suspense>
        <RecipeListingClient initialRecipes={recipes} />
      </Suspense>
    </>
  );
}

