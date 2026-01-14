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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
  const categoryUrl = normalizeUrl(siteUrl, `/kategorier/${slug}`);
  const webpageId = `${categoryUrl}#webpage`;
  const itemListId = `${categoryUrl}#itemlist`;
  const breadcrumbId = `${categoryUrl}#breadcrumb`;
  const faqPageId = `${categoryUrl}#faqpage`;

  // Calculate easy recipes count for accurate FAQ
  const easyRecipesCount = filteredRecipes.filter(r => {
    const diff = (r.difficulty || '').toLowerCase();
    return diff.includes('lätt') || diff.includes('leicht') || diff.includes('easy');
  }).length;

  // Generate JSON-LD structured data for category using @graph format
  const categorySchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage/CollectionPage
      {
        '@id': webpageId,
        '@type': 'CollectionPage',
        name: `${category.name} Rezepte`,
        description: category.description,
        url: categoryUrl,
        inLanguage: 'de-DE',
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': itemListId },
        hasPart: { '@id': faqPageId },
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`
        }
      },
      // BreadcrumbList
      {
        '@id': breadcrumbId,
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Startseite',
            item: siteUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Kategorien',
            item: normalizeUrl(siteUrl, '/kategorien')
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: categoryUrl
          }
        ]
      },
      // ItemList (summary page - only URLs, no Recipe objects)
      {
        '@id': itemListId,
        '@type': 'ItemList',
        numberOfItems: filteredRecipes.length,
        itemListElement: filteredRecipes.map((recipe, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: normalizeUrl(siteUrl, `/${recipe.slug}`)
        }))
      },
      // FAQPage (only if FAQs are visible on page)
      {
        '@id': faqPageId,
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Wie viele ${category.name.toLowerCase()} Rezepte gibt es?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: filteredRecipes.length === 1
                ? `Wir haben ${filteredRecipes.length} ${category.name.toLowerCase()} Rezept zur Auswahl.`
                : `Wir haben ${filteredRecipes.length} verschiedene ${category.name.toLowerCase()} Rezepte zur Auswahl.`
            }
          },
          {
            '@type': 'Question',
            name: `Wie lange dauert es, ${category.name.toLowerCase()} zuzubereiten?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: filteredRecipes.length === 1
                ? `Dieses ${category.name} Rezept dauert etwa 20-45 Minuten.`
                : `Die Zeit variiert je nach Rezept, aber die meisten ${category.name.toLowerCase()} Rezepte dauern zwischen 20-45 Minuten.`
            }
          },
          {
            '@type': 'Question',
            name: `Sind ${category.name.toLowerCase()} Rezepte für Anfänger geeignet?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: easyRecipesCount > 0
                ? `Ja! Wir haben ${easyRecipesCount} ${easyRecipesCount === 1 ? 'einfaches' : 'einfache'} ${category.name.toLowerCase()} Rezept${easyRecipesCount === 1 ? '' : 'e'} mit "Einfach" Schwierigkeitsgrad, die perfekt für Anfänger sind.`
                : `Die Rezepte in dieser Kategorie haben unterschiedliche Schwierigkeitsgrade. Einfache Rezepte sind für Anfänger geeignet.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={categorySchemaGraph} />
      
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