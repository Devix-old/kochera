import { getAllContent } from '@/lib/mdx';
import { getAllCategories } from '@/lib/categories';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import StructuredData from '@/components/seo/StructuredData';
import EnhancedCategoryClient from '@/components/kategorier/EnhancedCategoryClient';
import { normalizeUrl } from '@/lib/utils/url';

export async function generateMetadata() {
  return generateSiteMetadata({
    title: 'Alle Rezeptkategorien - Finde Dein Nächstes Lieblingsrezept | Kochera',
    description: 'Utforska alla våra receptkategorier: Kyckling, Pasta, Vegetariska, Kladdkaka, Pannkakor och mycket mer. Över 100+ recept i 16 kategorier för alla smaker och tillfällen.',
    url: '/kategorier',
    keywords: 'receptkategorier, matkategorier, kyckling recept, pasta recept, vegetariska recept, kladdkaka recept, pannkakor recept, svenska recept, matlagning, kokbok, recept inspiration, kategorier mat, alla recept, recept sortering',
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

export default async function KategorierPage() {
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
        name: 'Start',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kategorier',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'}/kategorier`
      }
    ]
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Alle Rezeptkategorien',
    description: 'Entdecke alle unsere Rezeptkategorien mit über 100+ Rezepten für alle Geschmäcker und Anlässe',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de'}/kategorier`,
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
          url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de', `/kategorier/${category.slug}`)
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
        name: 'Hur många receptkategorier finns det?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Vi har ${allCategories.length} olika receptkategorier med över ${totalRecipes} recept totalt. Kategorierna inkluderar allt från kyckling och pasta till vegetariska rätter och klassiska svenska desserter.`
        }
      },
      {
        '@type': 'Question',
        name: 'Vilka är de populäraste receptkategorierna?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Våra mest populära kategorier är ${popularCategories.slice(0, 3).map(cat => cat.name).join(', ')} och ${popularCategories[3].name}. Dessa kategorier innehåller de flesta recepten och är favoriter bland våra användare.`
        }
      },
      {
        '@type': 'Question',
        name: 'Finns det vegetariska receptkategorier?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, vi har en dedikerad vegetariska kategorier med många recept. Dessutom hittar du vegetariska alternativ i andra kategorier som pasta, sallader och tillbehör.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kan jag filtrera recept efter svårighetsgrad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, alla våra recept är märkta med svårighetsgrad (Lätt, Medel, Svår) så du enkelt kan hitta recept som passar din erfarenhetsnivå. Perfekt för både nybörjare och erfarna kockar!'
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