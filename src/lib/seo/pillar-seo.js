/**
 * SEO utilities for pillar pages
 * Implements SEO best practices for informational/guide content
 */

import { normalizeUrl } from '@/lib/utils/url';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

/**
 * Generate comprehensive pillar page metadata
 * Focuses on informational content (Article/HowToGuide schema)
 */
export function generatePillarMetadata(pillar) {
  const {
    title = '',
    excerpt = '',
    image,
    author = 'Kochera Team',
    publishedAt,
    updatedAt,
    tags = [],
    mainKeyword = '',
    relatedKeywords = [],
    slug = ''
  } = pillar;

  // Generate SEO-optimized title
  const seoTitle = generatePillarTitle(title, mainKeyword);
  
  // Generate SEO-optimized description
  const seoDescription = generatePillarDescription(excerpt, mainKeyword);
  
  // Generate keywords
  const keywords = generatePillarKeywords(tags, mainKeyword, relatedKeywords, title);
  
  // Generate canonical URL
  const urlPath = `/${slug}`;
  const canonicalUrl = normalizeUrl(SITE_URL, urlPath);
  
  // Generate image URL
  const imageUrl = image?.src ? normalizeUrl(SITE_URL, image.src) : normalizeUrl(SITE_URL, '/bak-stunden.png');
  const imageAlt = image?.alt || title;
  
  const imageMeta = {
    url: imageUrl,
    alt: imageAlt,
    ...(image?.width && image?.height ? {
      width: image.width,
      height: image.height,
    } : {
      width: 1200,
      height: 630,
    }),
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: 'Kochera',
      images: [imageMeta],
      locale: 'de_DE',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: author ? [author] : ['Kochera Team'],
      tags: tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
      creator: '@kochera',
      site: '@kochera',
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
    other: {
      'article:author': author || 'Kochera Team',
      'accessibility': 'screen-reader-optimized',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate SEO-optimized pillar title
 */
function generatePillarTitle(title = '', mainKeyword = '') {
  const trimmedTitle = title.trim();
  if (trimmedTitle !== '') {
    return trimmedTitle;
  }
  // Fallback to keyword-based title
  return mainKeyword ? `${mainKeyword} - Complete Guide | Kochera` : 'Complete Guide | Kochera';
}

/**
 * Generate SEO-optimized pillar description
 */
function generatePillarDescription(excerpt = '', mainKeyword = '') {
  if (excerpt && excerpt.trim()) {
    return excerpt.trim();
  }
  // Fallback description
  return mainKeyword 
    ? `Learn everything about ${mainKeyword} with our comprehensive guide. Expert tips, techniques, and best practices.`
    : 'Comprehensive guide with expert tips and best practices.';
}

/**
 * Generate keywords for pillar pages
 */
export function generatePillarKeywords(tags = [], mainKeyword = '', relatedKeywords = [], title = '') {
  const baseKeywords = [
    'guide',
    'how to',
    'tips',
    'best practices',
    'tutorial',
    'complete guide',
    'kochera'
  ];
  
  // Extract meaningful words from title
  const titleKeywords = title
    .toLowerCase()
    .split(/[\s–\-—]+/)
    .map(word => word.replace(/[.,!?;:()]/g, ''))
    .filter(word => word.length >= 4)
    .filter(word => word.length > 0);
  
  // Filter tags
  const filteredTags = tags
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length >= 3);
  
  const allKeywords = [
    ...baseKeywords,
    mainKeyword,
    ...relatedKeywords,
    ...filteredTags,
    ...titleKeywords
  ].filter(Boolean); // Remove empty strings
  
  // Remove duplicates and join
  return [...new Set(allKeywords)].join(', ');
}

/**
 * Generate Article schema for pillar pages
 * Uses Article schema type for informational content
 */
export function generatePillarSchema(pillar) {
  const {
    title,
    excerpt,
    image,
    author = 'Kochera Team',
    publishedAt,
    updatedAt,
    mainKeyword = '',
    tags = [],
    slug = '',
    content = ''
  } = pillar;

  if (!title || !slug) {
    return null;
  }

  const imageArray = image?.src
    ? [normalizeUrl(SITE_URL, image.src)]
    : [normalizeUrl(SITE_URL, '/bak-stunden.png')];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt || title,
    image: imageArray,
    inLanguage: 'de-DE',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': normalizeUrl(SITE_URL, `/${slug}`),
      url: normalizeUrl(SITE_URL, `/${slug}`),
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kochera',
      logo: {
        '@type': 'ImageObject',
        url: normalizeUrl(SITE_URL, '/logo.png'),
        width: 512,
        height: 512,
      },
    },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    keywords: generatePillarKeywords(tags, mainKeyword, [], title),
    articleSection: mainKeyword || 'Guide',
  };

  // Add articleBody if content exists
  if (content && content.trim()) {
    // Extract text from MDX content (simple approach)
    const textContent = content
      .replace(/[#*\[\](){}`]/g, '') // Remove markdown syntax
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
      .substring(0, 5000); // Limit to 5000 chars
    
    if (textContent.length > 0) {
      schema.articleBody = textContent;
    }
  }

  return schema;
}

/**
 * Generate HowToGuide schema for pillar pages with step-by-step content
 */
export function generatePillarHowToSchema(pillar) {
  const {
    title,
    excerpt,
    image,
    author = 'Kochera Team',
    publishedAt,
    updatedAt,
    steps = [],
    totalTime = '',
    difficulty = '',
    slug = ''
  } = pillar;

  if (!title || !slug || !steps || steps.length === 0) {
    return null; // Only generate HowTo if steps exist
  }

  const imageArray = image?.src
    ? [normalizeUrl(SITE_URL, image.src)]
    : [normalizeUrl(SITE_URL, '/bak-stunden.png')];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: excerpt || title,
    image: imageArray,
    inLanguage: 'de-DE',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': normalizeUrl(SITE_URL, `/${slug}`),
      url: normalizeUrl(SITE_URL, `/${slug}`),
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kochera',
      logo: {
        '@type': 'ImageObject',
        url: normalizeUrl(SITE_URL, '/logo.png'),
        width: 512,
        height: 512,
      },
    },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    totalTime: totalTime ? `PT${totalTime}M` : undefined,
    estimatedCost: undefined, // Optional
    tool: undefined, // Optional
    supply: undefined, // Optional
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title || step.name || `Step ${index + 1}`,
      text: step.description || step.text || '',
      url: normalizeUrl(SITE_URL, `/${slug}#step-${index + 1}`),
      ...(step.image ? {
        image: {
          '@type': 'ImageObject',
          url: normalizeUrl(SITE_URL, step.image),
        },
      } : {}),
    })),
  };

  return schema;
}

/**
 * Generate BreadcrumbList schema for pillar pages
 */
export function generatePillarBreadcrumbSchema(pillar) {
  const {
    title,
    slug,
    pillarTopic = ''
  } = pillar;

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: SITE_URL,
    },
  ];

  // Add topic breadcrumb if available
  if (pillarTopic) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: pillarTopic,
      item: normalizeUrl(SITE_URL, `/guides?topic=${encodeURIComponent(pillarTopic)}`),
    });
  }

  // Add pillar as final breadcrumb
  itemListElement.push({
    '@type': 'ListItem',
    position: pillarTopic ? 3 : 2,
    name: title,
    item: normalizeUrl(SITE_URL, `/${slug}`),
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Generate FAQ schema for pillar pages
 */
export function generatePillarFAQSchema(faqs = []) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Filter valid FAQs
  const validFaqs = faqs.filter(faq => 
    faq && 
    faq.question && 
    faq.answer && 
    faq.question.trim().length > 0 && 
    faq.answer.trim().length > 0
  );

  if (validFaqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  };
}
