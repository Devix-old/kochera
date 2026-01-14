import { getAllContent } from '@/lib/mdx';
import { getAllCategories } from '@/lib/categories';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import StructuredData from '@/components/seo/StructuredData';
import EnhancedCategoryClient from '@/components/kategorier/EnhancedCategoryClient';
import { normalizeUrl } from '@/lib/utils/url';

export async function generateMetadata() {
  return generateSiteMetadata({
    title: 'Alle Rezeptkategorien - Finde Dein Nächstes Lieblingsrezept | Kochera',
    description: 'Entdecke alle unsere Rezeptkategorien: Hähnchen, Pasta, Vegetarisch, Kuchen, Pfannkuchen und vieles mehr. Über 100+ Rezepte in 16 Kategorien für alle Geschmäcker und Anlässe.',
    url: '/kategorien',
    keywords: 'Rezeptkategorien, Matkategorien, Hähnchen Rezepte, Pasta Rezepte, vegetarische Rezepte, Kuchen Rezepte, Pfannkuchen Rezepte, deutsche Rezepte, Kochen, Kochbuch, Rezept Inspiration, Kategorien Essen, alle Rezepte, Rezept Sortierung',
    openGraph: {
      images: [
        {
          url: '/images/fika-och-bakning-svensk-stil.webp',
          width: 1200,
          height: 630,
          alt: 'Alle Rezeptkategorien auf Kochera',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/images/fika-och-bakning-svensk-stil.webp'],
    },
  });
}

export default async function KategorienPage() {
  // Load all recipes and categories
  const allRecipes = await getAllContent('recipes');
  const allCategories = getAllCategories();

  // Calculate recipe counts for each category
  const categoriesWithCounts = allCategories.map(category => {
    const recipeCount = allRecipes.filter(recipe => 
      recipe.category === category.name ||
      (recipe.tags && recipe.tags.some(tag => 
        category.subcategories && category.subcategories.includes(tag)
      ))
    ).length;

    return {
      ...category,
      count: recipeCount,
      recipeCount: recipeCount
    };
  });

  // Sort categories by recipe count (most popular first)
  const sortedCategories = categoriesWithCounts.sort((a, b) => b.count - a.count);

  // Get popular categories (top 8)
  const popularCategories = sortedCategories.slice(0, 8);

  // Get all other categories
  const otherCategories = sortedCategories.slice(8);

  // Calculate total recipes
  const totalRecipes = allRecipes.length;

  // Generate structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kategorien',
        item: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', '/kategorien')
      }
    ]
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Alle Rezeptkategorien',
    description: 'Entdecke alle unsere Rezeptkategorien mit über 100+ Rezepten für alle Geschmäcker und Anlässe',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'}/kategorien`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allCategories.length,
      itemListElement: allCategories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: category.name,
          description: category.description,
          url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', `/${category.slug}`)
        }
      }))
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Wie viele Rezeptkategorien gibt es?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Wir haben ${allCategories.length} verschiedene Rezeptkategorien mit über ${totalRecipes} Rezepten insgesamt. Die Kategorien umfassen alles von Hähnchen und Pasta bis zu vegetarischen Gerichten und klassischen deutschen Desserts.`
        }
      },
      {
        '@type': 'Question',
        name: 'Welche sind die beliebtesten Rezeptkategorien?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Unsere beliebtesten Kategorien sind ${popularCategories.slice(0, 3).map(cat => cat.name).join(', ')} und ${popularCategories[3]?.name || 'weitere Kategorien'}. Diese Kategorien enthalten die meisten Rezepte und sind Favoriten bei unseren Nutzern.`
        }
      },
      {
        '@type': 'Question',
        name: 'Gibt es vegetarische Rezeptkategorien?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, wir haben eine eigene vegetarische Kategorie mit vielen Rezepten. Außerdem findest du vegetarische Alternativen in anderen Kategorien wie Pasta, Salate und Beilagen.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kann ich Rezepte nach Schwierigkeitsgrad filtern?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, alle unsere Rezepte sind mit Schwierigkeitsgrad (Einfach, Mittel, Fortgeschritten) gekennzeichnet, sodass du einfach Rezepte finden kannst, die zu deinem Erfahrungsniveau passen. Perfekt für Anfänger und erfahrene Köche!'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={collectionPageSchema} />
      <StructuredData data={faqSchema} />
      
      <EnhancedCategoryClient 
        allCategories={sortedCategories}
        totalRecipes={totalRecipes}
        showAllCategories={true}
      />
    </>
  );
}
