import { getAllContent } from '@/lib/mdx';
import { getCategoryBySlug, getAllCategories } from '@/lib/categories';
import EnhancedCategoryClient from '@/components/kategorier/EnhancedCategoryClient';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import StructuredData from '@/components/seo/StructuredData';
import { normalizeUrl } from '@/lib/utils/url';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Kategori hittades inte',
      description: 'Den begärda kategorin kunde inte hittas.'
    };
  }

  // Load recipes for metadata
  const allRecipes = await getAllContent('recipes');
  const filteredRecipes = allRecipes.filter(r => {
    return r.category === category.name || 
           (r.tags && r.tags.some(tag => 
             category.subcategories && category.subcategories.includes(tag)
           ));
  });

  return generateSiteMetadata({
    title: `${category.name} Rezepte - ${filteredRecipes.length}+ Leckere Rezepte | Kochera`,
    description: `${category.description} Finde die besten ${category.name.toLowerCase()} Rezepte mit Schritt-für-Schritt-Anleitungen. ${filteredRecipes.length}+ getestete Rezepte für alle Levels.`,
    url: `/kategorier/${slug}`,
    keywords: `${category.name.toLowerCase()}, ${category.name.toLowerCase()} Rezepte, leckere ${category.name.toLowerCase()}, wie man ${category.name.toLowerCase()} zubereitet, deutsche ${category.name.toLowerCase()}, ${category.name.toLowerCase()} Tipps, einfache ${category.name.toLowerCase()}, schnelle ${category.name.toLowerCase()}`,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  // Load all recipes
  const allRecipes = await getAllContent('recipes');
  
  // Filter recipes based on new category system
  const filteredRecipes = allRecipes.filter(r => {
    // Check if recipe belongs to this category
    return r.category === category.name || 
           (r.tags && r.tags.some(tag => 
             category.subcategories && category.subcategories.includes(tag)
           ));
  });

  // Get all categories for related categories section
  const allCategories = getAllCategories();

  // Calculate category stats
  const categoryStats = {
    avgTime: filteredRecipes.length > 0 
      ? filteredRecipes.reduce((sum, r) => sum + (r.totalTimeMinutes || 0), 0) / filteredRecipes.length
      : 0,
    avgRating: filteredRecipes.length > 0
      ? filteredRecipes.reduce((sum, r) => sum + (r.ratingAverage || 0), 0) / filteredRecipes.length
      : 0,
    easyRecipes: filteredRecipes.filter(r => r.difficulty?.toLowerCase() === 'lätt').length,
    quickRecipes: filteredRecipes.filter(r => (r.totalTimeMinutes || 0) < 30).length,
    popularRecipes: filteredRecipes.filter(r => (r.ratingAverage || 0) >= 4.5).length
  };

  // Generate JSON-LD structured data for category
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Recept`,
    description: category.description,
    url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', `/kategorier/${slug}`),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Hem',
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Kategorier',
          item: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', '/kategorier')
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', `/kategorier/${slug}`)
        }
      ]
    },
    numberOfItems: filteredRecipes.length,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredRecipes.length,
      itemListElement: filteredRecipes.slice(0, 10).map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          // DO NOT use '@type': 'Recipe' here - only recipe pages should have Recipe schema
          // Use simple reference to avoid Google indexing multiple recipes from category pages
          name: recipe.title,
          url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', `/recept/${recipe.slug}`),
          image: recipe.image?.src || recipe.image,
          description: recipe.excerpt
        }
      }))
    }
  };

  // Generate FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Wie viele ${category.name.toLowerCase()} Rezepte gibt es?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Wir haben ${filteredRecipes.length} verschiedene ${category.name.toLowerCase()} Rezepte zur Auswahl.`
        }
      },
      {
        '@type': 'Question',
        name: `Wie lange dauert es, ${category.name.toLowerCase()} zuzubereiten?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Die Zeit variiert je nach Rezept, aber die meisten ${category.name.toLowerCase()} Rezepte dauern zwischen 20-45 Minuten.`
        }
      },
      {
        '@type': 'Question',
        name: `Är ${category.name.toLowerCase()} recept lämpliga för nybörjare?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ja! Wir haben viele einfache ${category.name.toLowerCase()} Rezepte mit "Einfach" Schwierigkeitsgrad, die perfekt für Anfänger sind.`
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={categorySchema} />
      <StructuredData data={faqSchema} />
      
      <EnhancedCategoryClient
        category={category}
        recipes={filteredRecipes}
        allCategories={allCategories}
        categoryStats={categoryStats}
      />
    </>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { getAllCategories } = await import('@/lib/categories');
  const categories = getAllCategories();
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}