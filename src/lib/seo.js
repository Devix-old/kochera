/**
 * SEO utility functions and JSON-LD schema generators
 */

import { normalizeUrl } from '@/lib/utils/url';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
const SITE_NAME = 'Kochera';
const SITE_DESCRIPTION = 'Deutschlands beste Sammlung von Rezepten und Kochtipps. Finde Inspiration für Alltagsgerichte, Backen und Festessen.';

/**
 * MINOR #2: Generate keywords from title for better SEO
 * Simple keyword extraction from title when keywords are not provided
 */
function generateKeywordsFromTitle(title) {
  if (!title) return '';
  
  // Basic stopwords to filter
  const stopwords = new Set(['och', 'att', 'i', 'det', 'som', 'en', 'på', 'är', 'av', 'för', 'med', 'till', 'den', 'de', 'har', 'om', 'du', 'han', 'hon', 'vi', 'ni', 'så', 'här', 'där', 'gör', 'ska', 'kan', 'utan', 'eller', 'men', 'vad', 'hur', 'var', 'när', 'från', 'ut', 'in']);
  
  const keywords = title
    .toLowerCase()
    .split(/[\s–\-—]+/)
    .map(word => word.replace(/[.,!?;:()]/g, ''))
    .filter(word => word.length >= 4 && !stopwords.has(word));
  
  return keywords.length > 0 ? keywords.join(', ') : 'Rezepte, Kochen, Backen';
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  keywords,
  noindex = false,
  nofollow = false,
}) {
  const fullTitle = title || SITE_NAME;
  const fullUrl = url ? normalizeUrl(SITE_URL, url) : SITE_URL;
  const imageUrl = image ? normalizeUrl(SITE_URL, image) : normalizeUrl(SITE_URL, '/bak-stunden.png');

  const metadata = {
    title: fullTitle,
    description: description || SITE_DESCRIPTION,
    // MINOR #2: Derive keywords from title if missing for better SEO
    keywords: keywords || (title ? generateKeywordsFromTitle(title) : 'Rezepte, Kochen, Backen, deutsche Rezepte, Kochtipps, Backen, Dessert, Abendessen, Frühstück'),
    authors: author ? [{ name: author }] : undefined,
    creator: author || SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    generator: 'Next.js',
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description || SITE_DESCRIPTION,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          // MINOR #1: Only add dimensions if image metadata contains them
          // Don't send fake dimensions - let platforms auto-detect
          ...(image?.width && image?.height ? {
            width: image.width,
            height: image.height,
          } : {}),
          alt: title || SITE_NAME,
        },
      ],
      locale: 'de_DE',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || SITE_DESCRIPTION,
      images: [imageUrl],
      creator: '@kochera',
      site: '@kochera',
    },
    alternates: {
      canonical: fullUrl,
    },
    // Note: metadataBase should ONLY be set in root layout (src/app/layout.js)
    // Setting it here in route-level generateMetadata is ignored by Next.js
    // and can cause canonical/OG URL issues
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    other: {
      'msapplication-TileColor': '#FF7A7A',
      'theme-color': '#FF7A7A',
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: type === 'article' ? 'Food & Cooking' : 'Food & Cooking',
  };

  if (type === 'article' && publishedTime) {
    metadata.openGraph.publishedTime = publishedTime;
    if (modifiedTime) {
      metadata.openGraph.modifiedTime = modifiedTime;
    }
    if (author) {
      metadata.openGraph.authors = [author];
    }
    if (tags) {
      metadata.openGraph.tags = tags;
    }
  }

  return metadata;
}

/**
 * Generate Recipe JSON-LD schema
 * MINOR #4: This function is outdated compared to generateEnhancedRecipeSchema() in recipe-seo.js
 * The new version has: better stopwords, better keyword generation, better step URLs, better image structure, better nutrition
 * Consider using generateEnhancedRecipeSchema() instead for new implementations
 */
export function generateRecipeSchema(recipe) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt,
    image: recipe.image?.src ? normalizeUrl(SITE_URL, recipe.image.src) : undefined,
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    author: {
      '@type': 'Person',
      name: recipe.author || 'Kochera Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt || recipe.publishedAt,
    prepTime: recipe.prepTimeMinutes ? `PT${recipe.prepTimeMinutes}M` : undefined,
    cookTime: recipe.cookTimeMinutes ? `PT${recipe.cookTimeMinutes}M` : undefined,
    totalTime: recipe.totalTimeMinutes ? `PT${recipe.totalTimeMinutes}M` : undefined,
    // MINOR #6: Use English for recipeYield for international visibility
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    // MINOR #7: Don't default to 'Dessert' - use undefined if category missing
    recipeCategory: recipe.category || undefined,
    recipeCuisine: 'Swedish',
    // MINOR #5: Add mainEntityOfPage to reduce canonical mistakes
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': normalizeUrl(SITE_URL, `/recept/${recipe.slug || ''}`),
    },
    keywords: recipe.tags?.join(', '),
    aggregateRating: recipe.ratingAverage ? {
      '@type': 'AggregateRating',
      ratingValue: recipe.ratingAverage,
      ratingCount: recipe.ratingCount || 0,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    recipeInstructions: (() => {
      // CRITICAL #2: Validate that steps exist and are not empty
      if (!recipe.steps || recipe.steps.length === 0) {
        // Provide fallback instruction if steps are missing
        return [{
          '@type': 'HowToStep',
          position: 1,
          text: recipe.excerpt || recipe.description || 'Se den fullständiga receptet'
        }];
      }
      return recipe.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title || `Steg ${index + 1}`,
        text: step.description,
      }));
    })(),
  };

  // Add ingredients
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    schema.recipeIngredient = recipe.ingredients.flatMap(section => 
      section.items || []
    );
  }

  // Add nutrition
  // CRITICAL #3: Use standard Schema.org properties instead of dynamic properties
  // Google doesn't recognize dynamic properties - must use standard names
  if (recipe.nutrition && recipe.nutrition.length > 0) {
    // Helper function to find nutrition value by Swedish name
    const findNutrition = (swedishName) => {
      const item = recipe.nutrition.find(n => 
        n.name.toLowerCase() === swedishName.toLowerCase()
      );
      if (item) {
        const unit = item.unit || '';
        return `${item.value}${unit}`;
      }
      return undefined;
    };

    schema.nutrition = {
      '@type': 'NutritionInformation',
      calories: recipe.caloriesPerServing ? `${recipe.caloriesPerServing} calories` : findNutrition('Kalorier'),
      fatContent: findNutrition('Fett'),
      carbohydrateContent: findNutrition('Kolhydrater'),
      proteinContent: findNutrition('Protein'),
      sugarContent: findNutrition('Socker'),
      fiberContent: findNutrition('Fiber'),
      sodiumContent: findNutrition('Natrium'),
      // Remove undefined properties
    };
    
    // Remove undefined properties for cleaner schema
    Object.keys(schema.nutrition).forEach(key => {
      if (schema.nutrition[key] === undefined) {
        delete schema.nutrition[key];
      }
    });
  }

  // MINOR #10: Remove undefined properties for cleaner schema
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate Article JSON-LD schema
 * Can be used for articles, blog posts, or recipe pages (as articles)
 */
export function generateArticleSchema(article) {
  // Support both URL path and slug - URL takes precedence
  const articleUrl = article.url || (article.slug ? normalizeUrl(SITE_URL, `/${article.slug}`) : undefined);
  
  // Handle image - can be string or object with src property
  let imageUrl = undefined;
  if (article.image) {
    if (typeof article.image === 'string') {
      imageUrl = article.image.startsWith('http') ? article.image : normalizeUrl(SITE_URL, article.image);
    } else if (article.image.src) {
      imageUrl = article.image.src.startsWith('http') ? article.image.src : normalizeUrl(SITE_URL, article.image.src);
    }
  }
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title || article.headline,
    description: article.excerpt || article.description,
    image: imageUrl ? [imageUrl] : undefined, // Use array format for multiple images support
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    author: {
      '@type': 'Person',
      name: article.author || 'Kochera Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      // MINOR #12: Add width/height to logo
      logo: {
        '@type': 'ImageObject',
        url: normalizeUrl(SITE_URL, '/logo.png'),
        width: 512,
        height: 512,
      },
    },
    datePublished: article.publishedAt || article.datePublished,
    dateModified: article.updatedAt || article.dateModified || article.publishedAt || article.datePublished,
    mainEntityOfPage: articleUrl ? {
      '@type': 'WebPage',
      '@id': articleUrl,
      url: articleUrl,
    } : undefined,
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate Breadcrumb JSON-LD schema
 * MINOR #9: URL logic matches recipe-seo.js breadcrumb generation
 */
export function generateBreadcrumbSchema(items) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? normalizeUrl(SITE_URL, item.url) : undefined,
    })),
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate Website JSON-LD schema with SearchAction
 */
export function generateWebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        // MINOR #11: Fix search path to match actual search page
        urlTemplate: normalizeUrl(SITE_URL, '/sok?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate Organization JSON-LD schema
 */
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    logo: {
      '@type': 'ImageObject',
      url: normalizeUrl(SITE_URL, '/logo.png'),
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@kochera.de',
    },
    sameAs: [
      'https://instagram.com/kochera',
      'https://pinterest.com/kochera',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        // MINOR #11: Fix search path to match actual search page
        urlTemplate: normalizeUrl(SITE_URL, '/sok?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(faqs) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

/**
 * Generate ItemList JSON-LD schema for listing pages
 * CRITICAL: Do NOT use @type: 'Recipe' for items in listings
 * Only actual recipe pages (/recept/[slug]) should have Recipe schema
 * Listings should use simple references (name, url, image) without type
 */
export function generateItemListSchema(items, type = null, basePath = '/recept') {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    // MINOR #3: Add inLanguage for multilingual sites
    inLanguage: 'de-DE',
    itemListElement: items.map((item, index) => {
      // Use the provided basePath or default to /recept for recipes
      // If item already has a full URL, use it; otherwise construct from basePath
      const itemUrl = item.url || normalizeUrl(SITE_URL, `${basePath}/${item.slug}`);
      
      const itemData = {
        name: item.title,
        url: itemUrl,
        image: item.image?.src ? normalizeUrl(SITE_URL, item.image.src) : undefined,
      };
      
      // Only add @type if it's explicitly provided and NOT 'Recipe'
      // Recipe type should only appear on actual recipe pages, not in listings
      if (type && type !== 'Recipe') {
        itemData['@type'] = type;
      }
      
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: itemData,
      };
    }),
  };

  // MINOR #10: Remove undefined properties
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  return schema;
}

