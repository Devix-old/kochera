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
import { generateRecipeMetadata, generateEnhancedRecipeSchema, generateRelatedContentSchema, generateRecipeKeywords } from '@/lib/seo/recipe-seo';
import { generateInternalLinks, generateContextualLinks } from '@/lib/seo/internal-linking';
import { getAllCategories, getCategoryBySlug } from '@/lib/categories';
import { generateArticleSchema } from '@/lib/seo';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import MobileLearderboard from '@/components/ads/MobileLearderboard';
import HeaderBanner from '@/components/ads/HeaderBanner';
import InArticle from '@/components/ads/InArticle';
import HalfPage from '@/components/ads/half_page';
import LeaderboardAfterRelatedRecipes from '@/components/ads/LeaderboardAfterRelatedRecipes';
import HeaderAd from '@/components/ads/adsense/HeaderAd';
import Billboard_970x250 from '@/components/ads/Billboard_970x250';
import Leaderboard_before_ingredients from '@/components/ads/Leaderboard_before_ingredients';
import Leaderboard_after_ingredients from '@/components/ads/leaderboard_after_ingredients';
import Leaderboard_after_nutrition from '@/components/ads/leaderboard_after_nutrition';
// import InterScroller from '@/components/ads/InterScroller';

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

// Allow dynamic params not in generateStaticParams (enables 404 handling for missing recipes)
export const dynamicParams = true;

// Generate static params
export async function generateStaticParams() {
  const recipes = await getAllContent('recipes');
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

// Generate comprehensive metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const recipeData = await getContentBySlug('recipes', slug);

  if (!recipeData) return { title: 'Rezept nicht gefunden' };

  // Extract frontmatter data for metadata generation
  const recipe = {
    ...recipeData.frontmatter,
    slug: recipeData.slug,
    content: recipeData.content,
    title: recipeData.frontmatter.title || recipeData.frontmatter.recipeName,
  };

  return generateRecipeMetadata(recipe);
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getContentBySlug('recipes', slug);

  if (!recipe) notFound();

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

  // Find category slug for breadcrumb
  const categoryObj = allCategories.find(cat => cat.name === frontmatter.category);
  const categorySlug = categoryObj ? categoryObj.slug : null;
  const categoryUrl = categorySlug ? `/kategorier/${categorySlug}` : `/recept?category=${encodeURIComponent(frontmatter.category)}`;

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
          question: `Hur lång tid tar det att laga ${displayRecipeName}?`,
          answer: `Det tar cirka ${frontmatter.totalTimeMinutes} minuter att laga ${displayRecipeName}.${frontmatter.prepTimeMinutes ? ` Förberedelse: ${frontmatter.prepTimeMinutes} minuter.` : ''}${frontmatter.cookTimeMinutes ? ` Tillagning: ${frontmatter.cookTimeMinutes} minuter.` : ''}`
        },
        {
          question: `Hur många portioner ger ${displayRecipeName}?`,
          answer: `Detta recept ger ${frontmatter.servings} portioner.`
        },
        {
          question: `Vilken svårighetsgrad har ${displayRecipeName}?`,
          answer: `Detta recept har svårighetsgrad ${frontmatter.difficulty || 'medel'}.`
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
          title: 'Proffstips',
          content: `För bästa resultat med ${displayRecipeName}, se till att alla ingredienser är i rumstemperatur.`,
          icon: Lightbulb
        },
        {
          title: 'Tidssparande',
          content: 'Förbered alla ingredienser innan du börjar för att spara tid under tillagningen.',
          icon: Clock
        },
        {
          title: 'Lagring',
          content: `${displayRecipeName} kan förvaras i kylskåp i upp till 3 dagar eller frysas i 2 månader.`,
          icon: Heart
        }
      ];

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Hem', url: '/' },
    { name: 'Recept', url: '/recept' },
    { name: frontmatter.category, url: categoryUrl },
    { name: displayRecipeName }
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
      item: item.url ? normalizeUrl(siteUrl, item.url) : undefined,
    })),
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
  const relatedSchema = relatedRecipes.length > 0 ? generateRelatedContentSchema(relatedRecipes, frontmatter.category) : null;
  
  // Generate Article schema - recipe pages are also articles
  const articleSchema = generateArticleSchema({
    title: displayRecipeName,
    excerpt: frontmatter.excerpt,
    image: frontmatter.image,
    author: frontmatter.author || 'Kochera Team',
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt || frontmatter.publishedAt,
    url: normalizeUrl(siteUrl, `/recept/${slug}`), // Use correct recipe URL path
  });

  // Generate WebPage schema with primaryImageOfPage (CRITICAL for image SEO)
  const webpageUrl = normalizeUrl(siteUrl, `/recept/${slug}`);
  const webpageId = `${webpageUrl}#webpage`;
  const primaryImageId = `${webpageUrl}#primaryimage`;
  
  // Normalize image URL
  const imageUrl = frontmatter.image?.src
    ? (frontmatter.image.src.startsWith('http') 
        ? frontmatter.image.src 
        : normalizeUrl(siteUrl, frontmatter.image.src))
    : null;

  // Create ImageObject for primaryImageOfPage
  const primaryImageObject = imageUrl ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': primaryImageId,
    url: imageUrl,
    contentUrl: imageUrl,
    inLanguage: 'de-DE',
    // Include width/height if available from image object, otherwise use common recipe image dimensions
    ...(frontmatter.image?.width && frontmatter.image?.height ? {
      width: frontmatter.image.width,
      height: frontmatter.image.height,
    } : {
      width: 1200,
      height: 900,
    }),
    ...(frontmatter.image?.alt ? { caption: frontmatter.image.alt } : {}),
  } : null;

  // Generate WebPage schema
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': webpageId,
    url: webpageUrl,
    name: displayRecipeName,
    description: frontmatter.excerpt,
    ...(primaryImageObject ? { primaryImageOfPage: { '@id': primaryImageId } } : {}),
    inLanguage: 'de-DE',
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      {primaryImageObject ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryImageObject) }}
        />
      ) : null}
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
      {relatedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedSchema) }}
        />
      )}
      <div className="w-full flex justify-center py-4">
        <div className="hb-ad-static hb-ad-billboard">
            <div className="hb-ad-inner">
                <div className="hbagency_cls_static" id="hbagency_space_271592" ></div>
            </div>
        </div>
      </div>
      {/* 🧭 BREADCRUMB SECTION */}
      <section className="bg-gray-50 dark:bg-gray-950 dark:border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: frontmatter.category, url: categoryUrl },
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
                      url={normalizeUrl(siteUrl, `/recept/${slug}`)}
                    />
                  </div>
                )}
              </div>
              </div>

              {frontmatter.image?.src && (
                <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-4">
                  <div className="relative overflow-hidden rounded-2xl ring-2 ring-purple-100 dark:ring-purple-900/50 shadow-xl group">
                    <img
                      src={frontmatter.image.src}
                      alt={frontmatter.image.alt || `${displayRecipeName} - Kochera Rezept`}
                      width="1200"
                      height="900"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                      data-primary-image="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      {ingredientsCount} ingredienser
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 mb-1.5">
                      <Flame className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {frontmatter.difficulty || 'Medel'}
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
          <Leaderboard_before_ingredients />
          {/* Recipe two-column layout */}
          <section className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mb-16 lg:items-start">
            {/* Left column - Ingredients */}
            <aside className="space-y-6 recipe-ingredients-sticky">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-6 h-6" />
                    Ingredienser
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
                      Allergener
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
            <Leaderboard_after_ingredients />
            {/* Right column - Steps and details */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 borde r border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-stone-400 to-stone-500 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Timer className="w-6 h-6" />
                    Så här gör du
                  </h2>
                </div>
                <div className="p-6 md:p-8">
                  <RecipeSteps steps={frontmatter.steps || []} />
                </div>
              </div>
              
            </div>
          </section>
          
            <LeaderboardAd />

          {/* Nutrition Information Section */}
          {frontmatter.nutrition && frontmatter.nutrition.length > 0 && (
            <section className="mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NutritionInfo 
                nutrition={frontmatter.nutrition} 
                servings={frontmatter.servings || 1}
              />
            </section>
          )}
          <Leaderboard_after_nutrition />
          {/* SEO Sections - Placed FIRST after recipe steps for optimal SEO */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <RecipeTipsSection recipe={frontmatter} tips={tips} />
              <InArticle />
            <RecipeFAQSection recipe={frontmatter} faqs={faqs} />
          </div>

          <MobileLearderboard />
          {/* Comments Section - Placed after SEO sections, before related recipes */}
          <CommentsSection pageSlug={slug} />

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
              
              {/* Desktop: 2 columns (recipes) + 1 column (ad) | Mobile: full width recipes */}
              <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                {/* Recipes grid - 2 columns on desktop, 1 column on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {relatedRecipes.map((r, i) => (
                    <RecipeCard key={`${r.slug}-${i}`} recipe={r} index={i} />
                  ))}
                </div>
                
                {/* Half-page ad on desktop - right side, sticky (only renders on large screens) */}
                <aside className="sticky top-4">
                  <div className="flex justify-center">
                    <HalfPage />
                  </div>
                </aside>
              </div>
              
              
            </section>
          )}

          {/* Leaderboard Ad after Related Recipes */}
          <LeaderboardAfterRelatedRecipes />

          {/* Additional SEO Sections - Placed after related recipes */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CategoryCarousel 
              categories={allCategories.slice(0, 8)} 
              currentCategory={frontmatter.category?.toLowerCase()}
            />
            <RecipeSocialSection recipe={frontmatter} />
          </div>
        </div>
      </article>

    </>
  );
}
