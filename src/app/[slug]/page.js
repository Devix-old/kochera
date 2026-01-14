import { getContentBySlug, getAllContent, getRelatedContent } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { normalizeUrl } from '@/lib/utils/url';
import {
  ChefHat,
  Utensils,
  AlertCircle,
  Archive,
  Wine,
  Lightbulb,
  Flame,
  ArrowRight,
  Timer,
  Clock,
  Users,
  Star,
  BookOpen,
  Heart
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Tag from '@/components/ui/Tag';
import IngredientsList from '@/components/recipe/IngredientsList';
import RecipeSteps from '@/components/recipe/RecipeSteps';
import NutritionInfo from '@/components/recipe/NutritionInfo';
import RecipeCard from '@/components/recipe/RecipeCard';
import ShareButton from '@/components/recipe/ShareButton';
import CommentsSection from '@/components/recipe/CommentsSection';
import { 
  RecipeTipsSection, 
  RecipeFAQSection, 
  RelatedRecipesSection, 
  RecipeCategoriesSection,
  RecipeSocialSection 
} from '@/components/recipe/RecipeSEOSections';
import CategoryCarousel from '@/components/seo/CategoryCarousel';
import { generateRecipeMetadata, generateEnhancedRecipeSchema, generateRecipeKeywords } from '@/lib/seo/recipe-seo';
import { generateInternalLinks, generateContextualLinks } from '@/lib/seo/internal-linking';
import { getAllCategories, getCategoryBySlug } from '@/lib/categories';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import { normalizeNutritionData } from '@/lib/utils/nutrition';
import StructuredData from '@/components/seo/StructuredData';
import EnhancedCategoryClient from '@/components/kategorier/EnhancedCategoryClient';

// Icon mapping function
function getIconComponent(iconName) {
  const iconMap = {
    'Lightbulb': Lightbulb,
    'Clock': Clock,
    'Star': Star,
    'Heart': Heart,
    'Flame': Flame,
    'ChefHat': ChefHat,
    'Utensils': Utensils,
    'AlertCircle': AlertCircle,
    'Wine': Wine,
    'Timer': Timer
  };
  return iconMap[iconName] || Lightbulb;
}

// Difficulty mapping function (Swedish → German)
function mapDifficulty(difficulty) {
  if (!difficulty) return 'Mittel';
  const difficultyLower = difficulty.toLowerCase();
  const mapping = {
    'lätt': 'Einfach',
    'medel': 'Mittel',
    'medium': 'Mittel',
    'svår': 'Schwer',
    'schwer': 'Schwer',
    'einfach': 'Einfach',
    'mittel': 'Mittel'
  };
  return mapping[difficultyLower] || difficulty;
}

// Advanced 5-star rating component with precise percentage-based partial fill
// Handles any rating value with exact percentage fills (e.g., 4.2 = 20%, 4.6 = 60%, 4.8 = 80%)
function StarRating({ rating, size = 'w-5 h-5' }) {
  // Normalize rating to 0-5 range
  const normalizedRating = Math.min(Math.max(rating || 0, 0), 5);
  
  // Calculate star distribution
  const fullStars = Math.floor(normalizedRating);
  const decimalPart = normalizedRating % 1;
  const partialFillPercentage = decimalPart * 100;
  const hasPartialStar = decimalPart > 0 && fullStars < 5;
  const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0);

  return (
    <div 
      className="flex items-center gap-0.5" 
      aria-label={`Rating: ${normalizedRating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star 
          key={`full-${i}`} 
          className={`${size} fill-yellow-400 text-yellow-400`}
          aria-hidden="true"
        />
      ))}
      
      {/* Partial star with precise percentage fill */}
      {hasPartialStar && (
        <div 
          className="relative inline-flex star-clip-container" 
          aria-hidden="true"
        >
          {/* Empty star background (always visible) */}
          <Star className={`${size} text-gray-300 dark:text-gray-600`} />
          
          {/* Filled portion with exact percentage using clip-path for precision */}
          <div 
            className="absolute top-0 left-0 w-full"
              style={{ 
              clipPath: `inset(0 ${100 - partialFillPercentage}% 0 0)`,
              height: '100%'
            }}
          >
            <Star className={`${size} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          className={`${size} text-gray-300 dark:text-gray-600`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Allow dynamic params not in generateStaticParams (enables 404 handling)
export const dynamicParams = true;

// Generate static params for categories and recipes
export async function generateStaticParams() {
  // Get all categories and recipes
  const categories = getAllCategories();
  const categorySlugs = categories.map(cat => ({ slug: cat.slug }));
  
  const recipes = await getAllContent('recipes');
  const recipeSlugs = recipes.map(recipe => ({ slug: recipe.slug }));

  // Categories first, then recipes
  return [...categorySlugs, ...recipeSlugs];
}

// Generate comprehensive metadata - dispatcher
export async function generateMetadata({ params }) {
  const { slug } = await params;

  // First check if it's a category
  const category = getCategoryBySlug(slug);
  if (category) {
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
      url: `/${slug}`,
      keywords: `${category.name.toLowerCase()}, ${category.name.toLowerCase()} Rezepte, leckere ${category.name.toLowerCase()}, wie man ${category.name.toLowerCase()} zubereitet, deutsche ${category.name.toLowerCase()}, ${category.name.toLowerCase()} Tipps, einfache ${category.name.toLowerCase()}, schnelle ${category.name.toLowerCase()}`,
    });
  }

  // Second check if it's a recipe
  const recipeData = await getContentBySlug('recipes', slug);
  if (recipeData) {
    const recipe = {
      ...recipeData.frontmatter,
      slug: recipeData.slug,
      content: recipeData.content,
      title: recipeData.frontmatter.title || recipeData.frontmatter.recipeName,
    };
    return generateRecipeMetadata(recipe);
  }

  // If none match, return 404 metadata
  return { title: 'Seite nicht gefunden' };
}

// Main dispatcher component
export default async function SlugPage({ params }) {
  const { slug } = await params;

  // First check if it's a category
  const category = getCategoryBySlug(slug);
  if (category) {
    // Load all recipes
    const allRecipes = await getAllContent('recipes');
    
    // Filter recipes based on category
    const filteredRecipes = allRecipes.filter(r => {
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

    // Generate JSON-LD structured data for category
    const categorySchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} Rezept`,
      description: category.description,
      url: normalizeUrl(siteUrl, `/${slug}`),
      breadcrumb: {
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
            item: normalizeUrl(siteUrl, `/${slug}`)
          }
        ]
      },
      numberOfItems: filteredRecipes.length,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: filteredRecipes.length,
        itemListElement: filteredRecipes.slice(0, 20).map((recipe, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Recipe',
            name: recipe.title || recipe.recipeName,
            url: normalizeUrl(siteUrl, `/${recipe.slug}`)
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
          name: `Sind ${category.name.toLowerCase()} Rezepte für Anfänger geeignet?`,
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

  // Second check if it's a recipe
  const recipe = await getContentBySlug('recipes', slug);
  if (recipe) {
    // Render recipe page
    const { frontmatter, content } = recipe;
  
  // Calculate total ingredients count
  const ingredientsCount = frontmatter.ingredients?.reduce((total, section) => {
    return total + (section.items?.length || 0);
  }, 0) || 0;
  
  // Get related content
  const relatedRecipes = await getRelatedContent(
    'recipes',
    slug,
    frontmatter.tags,
    frontmatter.category,
    6
  );

  // Get all categories for navigation
  const allCategories = getAllCategories();

  // Find category from recipe category (try slug first, then name)
  let categoryObj = getCategoryBySlug(frontmatter.category);
  if (!categoryObj) {
    categoryObj = allCategories.find(cat => cat.name === frontmatter.category);
  }
  const categoryUrl = categoryObj ? `/${categoryObj.slug}` : null;
  const categoryName = categoryObj ? categoryObj.name : frontmatter.category;

  // Generate internal links
  const internalLinks = await generateInternalLinks(frontmatter);
  const contextualLinks = generateContextualLinks(frontmatter, internalLinks);

  // Use recipeName if available, fallback to title for display
  const displayRecipeName = frontmatter.recipeName || frontmatter.title;

  // Use frontmatter data or generate fallbacks
  const faqs = frontmatter.faqs && frontmatter.faqs.length > 0 
    ? frontmatter.faqs 
    : [
        {
          question: `Wie lange dauert es, ${displayRecipeName} zuzubereiten?`,
          answer: `Es dauert etwa ${frontmatter.totalTimeMinutes} Minuten, ${displayRecipeName} zuzubereiten.${frontmatter.prepTimeMinutes ? ` Vorbereitung: ${frontmatter.prepTimeMinutes} Minuten.` : ''}${frontmatter.cookTimeMinutes ? ` Kochzeit: ${frontmatter.cookTimeMinutes} Minuten.` : ''}`
        },
        {
          question: `Wie viele Portionen ergibt ${displayRecipeName}?`,
          answer: `Dieses Rezept ergibt ${frontmatter.servings} Portionen.`
        },
        {
          question: `Welchen Schwierigkeitsgrad hat ${displayRecipeName}?`,
          answer: `Dieses Rezept hat einen Schwierigkeitsgrad von ${frontmatter.difficulty || 'mittel'}.`
        }
      ];

  // Use frontmatter data or generate fallbacks
  const tips = frontmatter.tips && frontmatter.tips.length > 0 
    ? frontmatter.tips.map(tip => ({
        ...tip,
        icon: getIconComponent(tip.icon)
      }))
    : [
        {
          title: 'Profi-Tipps',
          content: `Für das beste Ergebnis mit ${displayRecipeName} achten Sie darauf, dass alle Zutaten Raumtemperatur haben.`,
          icon: Lightbulb
        },
        {
          title: 'Zeitsparend',
          content: 'Bereiten Sie alle Zutaten vor, bevor Sie beginnen, um Zeit beim Kochen zu sparen.',
          icon: Clock
        },
        {
          title: 'Aufbewahrung',
          content: `${displayRecipeName} kann bis zu 3 Tage im Kühlschrank aufbewahrt oder 2 Monate eingefroren werden.`,
          icon: Heart
        }
      ];

  // Generate breadcrumbs - Home > Category > Recipe
  const breadcrumbs = [
    { name: 'Startseite', url: '/' },
    ...(categoryUrl ? [{ name: categoryName, url: categoryUrl }] : []),
    { name: displayRecipeName, url: `/${slug}` }
  ];

  // CRITICAL #2: Generate keywords once and use in both metadata and schema
  // This ensures metadata and JSON-LD use the same keywords (single source of truth)
  const keywords = generateRecipeKeywords(
    frontmatter.tags || [],
    frontmatter.category || '',
    displayRecipeName || ''
  );
  
  const recipeSchema = generateEnhancedRecipeSchema({
    ...frontmatter,
    slug,
    content: recipe.content
  }, keywords);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url === '/' ? `${siteUrl}/` : normalizeUrl(siteUrl, item.url)) : (index === breadcrumbs.length - 1 ? normalizeUrl(siteUrl, `/${slug}`) : undefined),
    })).filter(item => item.item), // Remove items without URLs
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // Normalize nutrition data for UI component (same format as JSON-LD)
  const normalizedNutrition = normalizeNutritionData(
    frontmatter.nutrition || [],
    frontmatter.caloriesPerServing,
    frontmatter.servings
  );

  return (
    <>
      {/* Add image_src link tag for better social media image recognition */}
      {frontmatter.image?.src && (
        <link 
          href={normalizeUrl(siteUrl, frontmatter.image.src)} 
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 🧭 BREADCRUMB SECTION */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              ...(categoryUrl ? [{ name: categoryName, url: categoryUrl }] : []),
              { name: displayRecipeName },
            ]}
          />
        </div>
      </section>

      {/* 📝 MAIN RECIPE CONTENT */}
      <article className="bg-gray-50 dark:bg-gray-950 pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {/* Title, Description, and Image Section */}
          <section className="mb-12 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 p-6 md:p-10 shadow-lg md:rounded-2xl border border-purple-100/50 dark:border-purple-900/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            
            {/* Single Grid Container: 1 column on mobile, 2 columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              
              {/* 1. TITLE - Always first in DOM */}
              <div className="lg:col-start-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 dark:from-white dark:to-purple-300 bg-clip-text text-transparent leading-tight font-crimson recipe-title-spacing mb-2">
                  {displayRecipeName}
                </h1>
                {/* 2. RATING & SHARE - Order 2 on both */}
              <div className="order-2 lg:col-start-1">
                {frontmatter.ratingAverage && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <StarRating rating={frontmatter.ratingAverage} size="w-5 h-5" />
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {frontmatter.ratingAverage.toFixed(1)}
                        </span>
                        {frontmatter.ratingCount && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({frontmatter.ratingCount})
                          </span>
                        )}
                      </div>
                    </div>
                    <ShareButton 
                      title={displayRecipeName}
                      excerpt={frontmatter.excerpt}
                      url={normalizeUrl(siteUrl, `/${slug}`)}
                    />
                  </div>
                )}
              </div>
              </div>

              {frontmatter.image?.src && (
                <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-4">
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl">
                  
                  {/* 4:3 frame */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900">
                    <img
                      src={frontmatter.image.src}
                      alt={frontmatter.image.alt || `${displayRecipeName} - Kochera Rezept`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />

                    {/* subtle vignette + contrast (always on, not only hover) */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* optional: very light film grain to kill “AI clean” feeling */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('/images/ui/grain.png')]" />
                  </div>
                </div>
              </div>
              )}

              {/* 4. RECIPE INFO - Order 4 */}
              <div className="order-4 lg:col-start-1">
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-purple-200/60 dark:border-purple-800/40">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 mb-1.5">
                      <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {frontmatter.totalTimeMinutes || 0} min
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 mb-1.5">
                      <Utensils className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {ingredientsCount} Zutaten
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 mb-1.5">
                      <Flame className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {mapDifficulty(frontmatter.difficulty)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. DESCRIPTION - Order 5 */}
                <div className="order-5 lg:col-start-1">
                  {(frontmatter.description || frontmatter.excerpt) && (
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-lora">
                      {frontmatter.description || frontmatter.excerpt}
                    </p>
                  )}
                </div>
            </div>
          </section>

          {/* Blog intro - Only show if showBlog is true in frontmatter */}
          {frontmatter.showBlog === true && content && (
            <section className="mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="recipe-blog-content">
                  <MDXRemote source={content} />
                </div>
              </div>
            </section>
          )}
          {/* Recipe two-column responsive layout - single source, no duplication */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:items-start">
              {/* Left column - Ingredients (sticky on desktop) */}
              <aside className="space-y-6 recipe-ingredients-sticky order-1">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ChefHat className="w-6 h-6" />
                      Zutaten
                    </h2>
                  </div>
                  <div className="p-4">
                    <IngredientsList
                      ingredients={frontmatter.ingredients || []}
                      defaultServings={frontmatter.servings || 4}
                    />
                  </div>
                </div>

                {/* Equipment */}
                {frontmatter.equipment?.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Utrustning
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {frontmatter.equipment.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-700 dark:text-gray-300 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Allergens */}
                {frontmatter.allergens?.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-6 border border-rose-200 dark:border-rose-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Allergene
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.allergens.map((a, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full text-sm font-semibold border border-rose-200 dark:border-rose-800"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
              
              {/* Right column - Steps */}
              <div className="space-y-8 order-2">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-stone-400 to-stone-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Timer className="w-6 h-6" />
                      Zubereitung
                    </h2>
                  </div>
                  <div className="p-6 md:p-8">
                    <RecipeSteps steps={frontmatter.steps || []} />
                  </div>
                </div>
              </div>
            </div>
          </section>
          

          {/* Nutrition Information Section */}
          {normalizedNutrition && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NutritionInfo 
                nutrition={normalizedNutrition} 
                servings={frontmatter.servings || 1}
              />
            </section>
          )}
          {/* SEO Sections - Placed FIRST after recipe steps for optimal SEO */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <RecipeTipsSection recipe={frontmatter} tips={tips} />
            <RecipeFAQSection recipe={frontmatter} faqs={faqs} />
          </div>

          {/* Comments Section - Placed after SEO sections, before related recipes */}
          {/* <CommentsSection pageSlug={slug} /> */}

          {/* Related Recipes - Placed after comments */}
          {relatedRecipes.length > 0 && (
            <section aria-hidden="true" data-secondary-content className="pt-12 border-t border-gray-200 dark:border-gray-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-4">
                  {frontmatter.category}
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-playfair"
                >
                  Fler {frontmatter.category?.toLowerCase() || 'recept'} du kanske gillar
                </h2>
              </div>
              
              {/* Recipes grid - 2 columns on desktop, 1 column on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {relatedRecipes.map((r, i) => (
                  <RecipeCard key={`${r.slug}-${i}`} recipe={r} index={i} />
                ))}
              </div>
              
              
            </section>
          )}


          {/* Additional SEO Sections - Placed after related recipes */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* <CategoryCarousel 
              categories={allCategories.slice(0, 8)} 
              currentCategory={frontmatter.category?.toLowerCase()}
            /> */}
            <RecipeSocialSection recipe={frontmatter} />
          </div>
        </div>
      </article>

    </>
  );
  }

  // If not a category or recipe, return 404
  notFound();
}
