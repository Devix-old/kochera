/**
 * Advanced SEO utilities for recipe pages
 * Implements modern SEO best practices for recipe content
 */

import { normalizeUrl } from '@/lib/utils/url';
import { normalizeNutritionData } from '@/lib/utils/nutrition';
import { getYieldData } from '@/lib/utils/yield';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochira.de';

/**
 * Generate comprehensive recipe metadata
 * 
 * LOW PRIORITY #10: PERFORMANCE NOTE
 * When used in Next.js generateMetadata, this function runs on EVERY page load
 * Ensure recipe data is cached appropriately to avoid DB queries on each request
 * Consider using Next.js unstable_cache for production builds
 */
export function generateRecipeMetadata(recipe) {
  const {
    title = '',
    excerpt = '',
    image,
    author = 'kochira Team',
    publishedAt,
    updatedAt,
    tags = [],
    category = '',
    difficulty = '',
    totalTimeMinutes = 0,
    servings = 0,
    ratingAverage = 0,
    ratingCount = 0,
    slug = ''
  } = recipe;

  // Generate SEO-optimized title
  const seoTitle = generateRecipeTitle(title, category, difficulty);
  
  // Generate SEO-optimized description
  const seoDescription = generateRecipeDescription(excerpt, category, totalTimeMinutes, servings);
  
  // Generate keywords
  const keywords = generateRecipeKeywords(tags, category, title);
  
  // Generate canonical URL - use consistent pattern with seo.js
  // Construct path first, then full URL (same pattern as seo.js: `${SITE_URL}${url}`)
  const urlPath = `/${slug}`;
  const canonicalUrl = normalizeUrl(SITE_URL, urlPath);
  
  // Generate image URL - ONLY if recipe image exists
  // Don't use fallback logo for recipe pages (Google will ignore it and pick random image)
  const imageUrl = image?.src ? normalizeUrl(SITE_URL, image.src) : null;
  const imageAlt = image?.alt || title;
  
  // Only create imageMeta if we have a valid recipe image
  // MEDIUM PRIORITY #4: Add dimensions ONLY if available from image metadata
  // If dimensions are not available, let OG parsers auto-detect
  const imageMeta = imageUrl ? {
    url: imageUrl,
    alt: imageAlt,
    // Add dimensions ONLY if you have them from image metadata
    ...(image.width && image.height ? {
      width: image.width,
      height: image.height,
    } : {}),
  } : null;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    // Note: Next.js canonical URLs should be in alternates.canonical, not top-level
    // Removed top-level 'canonical' property for consistency
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: 'kochira',
      // Only include images if we have a valid recipe image
      // Empty array or missing images property is better than wrong image
      ...(imageMeta ? { images: [imageMeta] } : {}),
      locale: 'de_DE',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: author ? [author] : ['kochira Team'],
      tags: tags,
      section: category,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      // Only include images if we have a valid recipe image
      ...(imageUrl ? { images: [imageUrl] } : {}),
      creator: '@kochira',
      site: '@kochira',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // NICE-TO-HAVE #12: Add metadata for AI/LLM discovery
    other: {
      'article:author': author || 'kochira Team',
      // Add content accessibility hints
      'accessibility': 'screen-reader-optimized',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    // Note: article-specific tags are already in openGraph (publishedTime, modifiedTime, tags, section)
    // OG parsers read from openGraph, not from metadata.other
  };
}

/**
 * Generate SEO-optimized recipe title
 * Uses the exact title from MDX file with NO modifications
 * Safe fallback if title is missing (Issue #6)
 */
function generateRecipeTitle(title = '', category = '', difficulty = '') {
  // Use the exact title from MDX file with NO additions
  // Safe fallback: if title is empty, use category-based fallback
  const trimmedTitle = title.trim();
  return trimmedTitle !== '' ? trimmedTitle : (category ? `${category} recept` : 'Recept');
}

/**
 * Generate SEO-optimized recipe description
 * Uses the exact excerpt from MDX file without modifications
 */
function generateRecipeDescription(excerpt = '', category = '', totalTimeMinutes = 0, servings = 0) {
  // Use the exact excerpt from MDX file without any modifications
  return excerpt || 'Lerne, wie du leckeres Essen mit unserer Schritt-für-Schritt-Anleitung auf kochira zubereitest.';
}

/**
 * German stopwords that should be filtered from keywords
 * These are common words Google ignores and can be treated as keyword spam
 */
const GERMAN_STOPWORDS = new Set([
  'der', 'die', 'das', 'und', 'in', 'den', 'von', 'zu', 'dem', 'mit', 'sich',
  'des', 'auf', 'für', 'ist', 'im', 'ein', 'eine', 'als', 'auch', 'es', 'an',
  'werden', 'aus', 'er', 'hat', 'dass', 'sie', 'nach', 'wird', 'bei', 'einer',
  'um', 'am', 'sind', 'noch', 'wie', 'einem', 'über', 'einen', 'so', 'zum',
  'war', 'haben', 'nur', 'oder', 'aber', 'vor', 'zur', 'bis', 'mehr', 'durch',
  'man', 'sein', 'wurde', 'sei', 'in', 'der', 'zu', 'als', 'für', 'im', 'ist',
  // Generic adjectives that create keyword spam
  'gut', 'gute', 'gutes', 'super', 'extra', 'groß', 'große', 'klein', 'kleine'
]);

/**
 * Known recipe terms that should always be kept even if they match stopword patterns
 */
const RECIPE_TERMS = new Set([
  'rezept', 'rezepte', 'pfannkuchen', 'waffeln', 'kuchen', 'torten',
  'hähnchen', 'pasta', 'lasagne', 'fleisch', 'fisch',
  'lachs', 'vegetarisch', 'vegan', 'glutenfrei', 'dessert', 'nachspeise'
]);

/**
 * Generate comprehensive keywords
 * Filters out German stopwords and only keeps meaningful words
 * CRITICAL #2: Exported to use as single source of truth
 */
export function generateRecipeKeywords(tags = [], category = '', title = '') {
  const baseKeywords = [
    'rezepte',
    'kochen',
    'deutsche rezepte',
    'backen',
    'kochtipps',
    'hausgemachtes essen',
    'familienrezepte'
  ];
  
  const categoryKeywords = {
    'Dessert': ['dessert', 'nachspeise', 'süße rezepte', 'backen', 'kuchen', 'torten'],
    'Hauptgericht': ['hauptgericht', 'mittagessen', 'abendessen', 'fleisch', 'fisch', 'hähnchen', 'vegetarisch'],
    'Frühstück': ['frühstück', 'brunch', 'pfannkuchen', 'waffeln', 'morgens'],
    'Vorspeise': ['vorspeise', 'salat', 'suppe', 'snacks'],
    'Backen': ['backen', 'brot', 'kuchen', 'torten', 'kekse', 'süße backwaren'],
    'Suppen': ['suppe', 'suppen', 'cremige suppe', 'vegetarische suppe', 'fleischsuppe', 'fischsuppe', 'gemüsesuppe', 'warme suppe']
  };
  
  // Extract meaningful words from title
  // Filter out: stopwords, words < 4 characters, punctuation
  const titleKeywords = title
    .toLowerCase()
    .split(/[\s–\-—]+/) // Split on spaces, en-dash, em-dash, hyphen
    .map(word => word.replace(/[.,!?;:()]/g, '')) // Remove punctuation
    .filter(word => {
      // Keep words that are:
      // 1. At least 4 characters OR
      // 2. Known recipe terms (even if short) OR
      // 3. Not in stopword list
      return word.length >= 4 || RECIPE_TERMS.has(word);
    })
    .filter(word => {
      // Remove stopwords, but keep recipe terms
      return !GERMAN_STOPWORDS.has(word) || RECIPE_TERMS.has(word);
    })
    .filter(word => word.length > 0); // Remove empty strings
  
  // Filter tags through stopwords (Issue #2)
  // Remove stopwords and short words from tags, same as title keywords
  const filteredTags = tags
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => {
      // Keep tags that are at least 4 characters OR are recipe terms
      return tag.length >= 4 || RECIPE_TERMS.has(tag);
    })
    .filter(tag => {
      // Remove stopwords, but keep recipe terms
      return !GERMAN_STOPWORDS.has(tag) || RECIPE_TERMS.has(tag);
    });
  
  const allKeywords = [
    ...baseKeywords,
    ...(categoryKeywords[category] || []),
    ...filteredTags,
    ...titleKeywords
  ];
  
  // Remove duplicates and join
  return [...new Set(allKeywords)].join(', ');
}

/**
 * Generate enhanced recipe schema with all modern features
 * CRITICAL #2: Accept keywords parameter to use single source of truth
 */
export function generateEnhancedRecipeSchema(recipe, keywords = null) {
  // CRITICAL: Validate required fields to prevent errors
  // Use recipeName if available, fallback to title
  const recipeName = recipe.recipeName || recipe.title;
  if (!recipe || !recipeName || !recipe.slug) {
    return null;
  }

  // CRITICAL: Validate Google's required fields - image, ingredients, instructions
  if (!recipe.image?.src) {
    return null; // Google requires image for Recipe rich results
  }

  // Validate ingredients exist and are not empty
  const hasIngredients = recipe.ingredients && 
    Array.isArray(recipe.ingredients) && 
    recipe.ingredients.length > 0 && 
    recipe.ingredients.some(section => section.items && Array.isArray(section.items) && section.items.length > 0);
  
  if (!hasIngredients) {
    return null; // Google requires ingredients
  }

  // Validate steps exist and have descriptions
  const validSteps = recipe.steps && 
    Array.isArray(recipe.steps) && 
    recipe.steps.filter(step => step && step.description && step.description.trim().length > 0);
  
  if (!validSteps || validSteps.length === 0) {
    return null; // Google requires instructions
  }

  const {
    title,
    recipeName: recipeNameField, // Extract recipeName if available
    excerpt,
    image,
    author,
    publishedAt,
    updatedAt,
    tags = [],
    category,
    difficulty,
    totalTimeMinutes,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    yield: recipeYieldField, // Use yield from MDX if available
    ratingAverage,
    ratingCount,
    ingredients = [],
    steps = [],
    nutrition = [],
    caloriesPerServing,
    allergens = [],
    cuisine,
    mealType, // WARNING #5: Defined but unused - kept for future use
    slug = ''
  } = recipe;

  // Use recipeName if available, fallback to title
  const displayName = recipeNameField || title;

  // CRITICAL #3: Google Recipe schema requires image as simple URL array
  // Use array of URLs only - mixing with ImageObject can cause validation issues
  const imageArray = image?.src
    ? [normalizeUrl(SITE_URL, image.src)]
    : undefined;

  // Filter and validate steps - only include steps with valid descriptions
  const validStepsWithDescriptions = steps
    .filter(step => step && step.description && step.description.trim().length > 0)
    .map((step, index) => {
      // HIGH PRIORITY #4: Enhanced HowToStep with URL anchors and proper ImageObject
      const stepSchema = {
        '@type': 'HowToStep',
        name: step.title || `Schritt ${index + 1}`,
        text: step.description.trim(), // Ensure text is trimmed and not empty
        url: normalizeUrl(SITE_URL, `/${slug}#step-${index + 1}`),
      };
      // Add image with proper ImageObject format if stepImage exists
      // Priority: stepImage > step.image (for backward compatibility)
      const stepImageSrc = step.stepImage?.src || step.image;
      if (stepImageSrc) {
        // Handle both string paths and object with src property
        const imageUrl = typeof stepImageSrc === 'string' 
          ? stepImageSrc 
          : stepImageSrc.src || stepImageSrc;
        
        // Ensure URL is absolute
        const absoluteImageUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : normalizeUrl(SITE_URL, imageUrl);
        
        stepSchema.image = {
          '@type': 'ImageObject',
          url: absoluteImageUrl,
          // Add alt text if available
          ...(step.stepImage?.alt ? { caption: step.stepImage.alt } : {}),
        };
      }
      // Note: stepVideo is not included in Schema.org HowToStep
      // Video content should be handled separately if needed
      return stepSchema;
    });

  // Filter and validate ingredients - only include valid ingredient strings
  const validIngredients = ingredients
    .flatMap(section => section.items || [])
    .filter(item => item && typeof item === 'string' && item.trim().length > 0);

  // Ensure description exists - use excerpt or fallback to displayName
  const recipeDescription = excerpt && excerpt.trim().length > 0 
    ? excerpt.trim() 
    : displayName;

  // Generate keywords if not provided - Google recommends keywords field for Recipe schema
  const schemaKeywords = keywords !== null 
    ? keywords 
    : generateRecipeKeywords(tags, category, displayName);

  const yieldData = getYieldData(recipeYieldField, servings);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: displayName,
    description: recipeDescription,
    image: imageArray,
    // Add language for better international SEO
    inLanguage: 'de-DE',
    // Issue #4: Add mainEntityOfPage to associate recipe with exact URL
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': normalizeUrl(SITE_URL, `/${slug}`),
      url: normalizeUrl(SITE_URL, `/${slug}`), // Also add url property for completeness
    },
    author: {
      '@type': 'Person',
      name: author || 'kochira Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'kochira',
      logo: {
        '@type': 'ImageObject',
        url: normalizeUrl(SITE_URL, '/kochira-logo.png'),
        width: 512,
        height: 512,
      },
    },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    prepTime: prepTimeMinutes ? `PT${prepTimeMinutes}M` : undefined,
    cookTime: cookTimeMinutes ? `PT${cookTimeMinutes}M` : undefined,
    totalTime: totalTimeMinutes ? `PT${totalTimeMinutes}M` : undefined,
    // Use yield from MDX if available, otherwise use German localization
    recipeYield: yieldData ? `${yieldData.amount} ${yieldData.unit}` : undefined,
    // CRITICAL #2: Don't default to 'Dessert' - use undefined if category missing
    recipeCategory: category || undefined,
    recipeCuisine: cuisine || 'German',
    // Keywords removed from schema per user request (keep only in metadata)
    recipeInstructions: validStepsWithDescriptions,
    recipeIngredient: validIngredients,
    suitableForDiet: generateDietaryInfo(allergens, tags),
    // REMOVED: cookingMethod is not a standard Schema.org Recipe property
    // Google doesn't recognize this property in Recipe schema
    // MINOR #1: recipeDifficulty is not officially supported by Google Recipe schema
    // Kept for potential future use but Google ignores it
    // recipeDifficulty: difficulty,
    // MINOR #2: recipeServings is not an official Schema.org property
    // Google prefers recipeYield (already included above) and servingSize (in nutrition)
    // recipeServings: servings,
  };

  // Add rating if available
  if (ratingAverage && ratingCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingAverage,
      ratingCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // MEDIUM PRIORITY #8: Add Review schema support if individual reviews exist
  // This can significantly boost CTR in search results
  if (recipe.reviews && Array.isArray(recipe.reviews) && recipe.reviews.length > 0) {
    schema.review = recipe.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author || 'Anonymous',
      },
      datePublished: review.date || publishedAt,
      reviewBody: review.text || review.reviewBody || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating || ratingAverage || 5,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  // MEDIUM PRIORITY #7: Schema.org-compliant nutrition data
  // Use normalized nutrition function for 100% Schema.org compliance
  const normalizedNutrition = normalizeNutritionData(nutrition, caloriesPerServing, servings);
  if (normalizedNutrition) {
    schema.nutrition = {
      '@type': 'NutritionInformation',
      ...normalizedNutrition,
    };
  }

  // Add video if available (NICE-TO-HAVE #11: Enhanced with interaction stats)
  if (recipe.video) {
    schema.video = {
      '@type': 'VideoObject',
      name: `${title} - Videoguide`,
      description: `Lerne, wie du ${title} mit unserer Schritt-für-Schritt-Videoanleitung zubereitest`,
      thumbnailUrl: image?.src ? normalizeUrl(SITE_URL, image.src) : undefined,
      contentUrl: recipe.video.url,
      embedUrl: recipe.video.embedUrl,
      uploadDate: publishedAt,
      // MEDIUM PRIORITY #6: Duration must be in ISO 8601 format (e.g., "PT1M33S" for 1 min 33 sec)
      // Ensure recipe.video.duration is already in ISO 8601 format!
      duration: recipe.video.duration,
      // Add interaction statistics if available
      ...(recipe.video.views ? {
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WatchAction',
          userInteractionCount: recipe.video.views,
        },
      } : {}),
    };
  }

  return schema;
}

/**
 * Generate dietary information for schema
 */
function generateDietaryInfo(allergens, tags) {
  const dietaryInfo = [];
  
  if (tags.includes('Vegetariskt')) dietaryInfo.push('VegetarianDiet');
  if (tags.includes('Veganskt')) dietaryInfo.push('VeganDiet');
  if (tags.includes('Glutenfritt')) dietaryInfo.push('GlutenFreeDiet');
  if (tags.includes('Laktosfritt')) dietaryInfo.push('LowLactoseDiet');
  if (tags.includes('Lågkolhydrat')) dietaryInfo.push('LowCarbDiet');
  if (tags.includes('Lågfett')) dietaryInfo.push('LowFatDiet');
  
  return dietaryInfo.length > 0 ? dietaryInfo : undefined;
}

/**
 * Generate FAQ schema for recipe
 * MEDIUM PRIORITY #9: Enhanced with dynamic FAQs based on tags/allergens
 * HIGH PRIORITY #3: Added validation to prevent invalid FAQs
 */
export function generateRecipeFAQSchema(recipe) {
  // HIGH PRIORITY #3: Validate required data exists
  if (!recipe || !recipe.title || !recipe.totalTimeMinutes || !recipe.servings) {
    return null; // Don't generate FAQ if critical data is missing
  }

  const faqs = [
    {
      question: `Hur lång tid tar det att laga ${recipe.title}?`,
      answer: `Det tar cirka ${recipe.totalTimeMinutes} minuter att laga ${recipe.title}.${recipe.prepTimeMinutes ? ` Förberedelse: ${recipe.prepTimeMinutes} minuter.` : ''}${recipe.cookTimeMinutes ? ` Tillagning: ${recipe.cookTimeMinutes} minuter.` : ''}`
    },
    {
      question: `Hur många portioner ger ${recipe.title}?`,
      answer: `Detta recept ger ${recipe.servings} portioner.`
    },
    {
      question: `Vilken svårighetsgrad har ${recipe.title}?`,
      answer: `Detta recept har svårighetsgrad ${recipe.difficulty || 'medel'}. ${getDifficultyDescription(recipe.difficulty)}`
    }
  ];

  // Add allergen FAQ if allergens exist
  if (recipe.allergens && recipe.allergens.length > 0) {
    faqs.push({
      question: `Innehåller ${recipe.title} allergener?`,
      answer: `Ja, detta recept innehåller: ${recipe.allergens.join(', ')}.`
    });
  }

  // Add dynamic FAQs based on tags
  if (recipe.tags && Array.isArray(recipe.tags)) {
    if (recipe.tags.includes('Vegetariskt')) {
      faqs.push({
        question: `Är ${recipe.title} vegetariskt?`,
        answer: `Ja, detta recept är helt vegetariskt och innehåller inga kött- eller fiskprodukter.`
      });
    }
    
    if (recipe.tags.includes('Veganskt')) {
      faqs.push({
        question: `Är ${recipe.title} veganskt?`,
        answer: `Ja, detta recept är helt veganskt och innehåller inga animaliska produkter.`
      });
    }
    
    if (recipe.tags.includes('Glutenfritt')) {
      faqs.push({
        question: `Är ${recipe.title} glutenfritt?`,
        answer: `Ja, detta recept är glutenfritt och använder inga glutenhaltiga ingredienser.`
      });
    }
  }

  // Add storage tips FAQ if available
  if (recipe.storageTips) {
    faqs.push({
      question: `Hur förvarar jag ${recipe.title}?`,
      answer: recipe.storageTips
    });
  }

  // Filter out undefined items and return schema
  const validFaqs = faqs.filter(Boolean);
  
  if (validFaqs.length === 0) {
    return null; // Don't return empty FAQ schema
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Get difficulty description
 */
function getDifficultyDescription(difficulty) {
  const descriptions = {
    'Lätt': 'Perfekt för nybörjare med enkla tekniker och få ingredienser.',
    'Medel': 'Kräver lite erfarenhet och några grundläggande matlagningsfärdigheter.',
    'Svår': 'Avancerat recept som kräver erfarenhet och precision.'
  };
  return descriptions[difficulty] || descriptions['Medel'];
}

/**
 * Generate related content suggestions
 * CRITICAL: Do NOT use @type: 'Recipe' for related recipes in ItemList
 * This causes Google to index multiple recipes from the same page URL
 * Only use simple references (name, url, description, image) without type
 */
export function generateRelatedContentSchema(relatedRecipes, category) {
  const safeCategory = category || 'Recept';
  const categoryLabel = safeCategory.toLowerCase();

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Verwandte ${safeCategory} Rezepte`,
    description: `Weitere ${categoryLabel} Rezepte, die dir gefallen könnten`,
    itemListElement: relatedRecipes.map((recipe, index) => {
      // CRITICAL: Remove @type: 'Recipe' to avoid Google seeing multiple recipes on same page
      // Use simple reference with URL, name, description only - no Recipe type
      const item = {
        // DO NOT add '@type': 'Recipe' here - that's only for actual recipe pages
        name: recipe.title,
        url: normalizeUrl(SITE_URL, `/${recipe.slug}`),
        description: recipe.excerpt,
      };
      
      // Only add image if it exists, in array format
      if (recipe.image?.src) {
        item.image = [normalizeUrl(SITE_URL, recipe.image.src)];
      }
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item,
      };
    }),
  };
}

/**
 * HIGH PRIORITY #5: Generate BreadcrumbList schema for recipe pages
 * Helps Google understand site structure and improves navigation in search results
 */
export function generateRecipeBreadcrumbSchema(recipe, category) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: SITE_URL,
    },
  ];

  // Add category breadcrumb if available
  // Use flat category routes /[slug]
  if (category) {
    // Try to find category slug from categories
    let categorySlug = null;
    try {
      const { getAllCategories } = require('@/lib/categories');
      const allCategories = getAllCategories();
      const categoryObj = allCategories.find(cat => cat.name === category);
      categorySlug = categoryObj ? categoryObj.slug : null;
    } catch (e) {
      // Fallback if categories not available
    }
    
    const categoryUrl = categorySlug 
      ? normalizeUrl(SITE_URL, `/${categorySlug}`)
      : normalizeUrl(SITE_URL, `/rezepte?category=${encodeURIComponent(category)}`);
    
    itemListElement.push({
      '@type': 'ListItem',
      position: 3,
      name: category,
      item: categoryUrl,
    });
  }

  // Add recipe as final breadcrumb
  itemListElement.push({
    '@type': 'ListItem',
    position: category ? 4 : 3,
    name: recipe.title,
    item: normalizeUrl(SITE_URL, `/${recipe.slug}`),
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * HIGH PRIORITY #6: Generate Organization schema
 * Use once on homepage or in root layout
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'kochira',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: normalizeUrl(SITE_URL, '/kochira-logo.png'),
      width: 512,
      height: 512,
    },
    // MEDIUM PRIORITY #5: Add social media profiles when available
    // MINOR #4: Social media links boost E-E-A-T and brand authenticity
    sameAs: [
      // TODO: Add social media profiles once accounts are created
      // Uncomment and update with actual social media URLs:
      // 'https://www.instagram.com/kochira',
      // 'https://www.facebook.com/kochira',
      // 'https://twitter.com/kochira',
      // 'https://pinterest.com/kochira',
    ].filter(Boolean), // Remove empty entries
  };
}

/**
 * LOW PRIORITY #10: Generate WebSite schema with Search Action
 * Enables Google search box in search results
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'kochira',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: normalizeUrl(SITE_URL, '/sok?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
