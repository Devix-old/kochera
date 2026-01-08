import { getAllContent } from '@/lib/mdx';
import { getAllCategories } from '@/lib/categories';
import fs from 'fs';
import path from 'path';
import type { MetadataRoute } from 'next';
import { normalizeUrl } from '@/lib/utils/url';

export const revalidate = 3600;
export const dynamic = 'force-static';

/**
 * Extract the real image URL from MDX/Next.js structures
 */
function normalizeImageSrc(image: any): string | null {
  if (!image) return null;

  // 1. String directly
  if (typeof image === 'string') return image;

  // 2. Normal imported image: { src, width, height }
  if (typeof image.src === 'string') return image.src;

  // 3. Try common keys
  const keys = ['url', 'loc', 'path', 'href'];
  for (const key of keys) {
    if (typeof image[key] === 'string') return image[key];
  }

  // 4. Deep extraction fallback
  for (const value of Object.values(image)) {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      const deep = normalizeImageSrc(value);
      if (deep) return deep;
    }
  }

  return null;
}

/**
 * Main Sitemap Generator
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kochera.de';

  // Load MDX content
  let recipes: any[] = [];
  let categories: any[] = [];

  try {
    [recipes, categories] = await Promise.all([
      getAllContent('recipes'),
      getAllCategories(),
    ]);
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }

  // Get homepage lastModified based on newest recipe
  const mostRecent =
    recipes.length > 0
      ? new Date(
          Math.max(
            ...recipes.map((r) =>
              new Date(r.updatedAt || r.publishedAt || new Date()).getTime()
            )
          )
        )
      : new Date();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: mostRecent, changeFrequency: 'daily', priority: 1 },
    { url: normalizeUrl(baseUrl, '/rezepte'), lastModified: mostRecent, changeFrequency: 'daily', priority: 0.9 },
    { url: normalizeUrl(baseUrl, '/kategorier'), lastModified: mostRecent, changeFrequency: 'weekly', priority: 0.7 },
    { url: normalizeUrl(baseUrl, '/om'), lastModified: new Date('2024-01-01'), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic recipe routes
  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => {
    const lastModified = new Date(
      recipe.updatedAt ||
        recipe.publishedAt ||
        new Date()
    );

    const priority =
      (new Date().getTime() - lastModified.getTime()) / 86400000 < 7 ? 0.95 : 0.8;

    // Extract valid image URL
    const raw = normalizeImageSrc(recipe.image);
    let imageUrl: string | null = null;

    if (raw && typeof raw === 'string') {
      imageUrl = raw.startsWith('http')
        ? raw
        : normalizeUrl(baseUrl, raw);

      // Verify local file exists
      if (!raw.startsWith('http')) {
        const imgPath = path.join(process.cwd(), 'public', raw.replace(/^\//, ''));
        if (!fs.existsSync(imgPath)) imageUrl = null;
      }
    }

    // Images must be an array of STRINGS
    const images = imageUrl ? [imageUrl] : undefined;

    return {
      url: normalizeUrl(baseUrl, `/recept/${recipe.slug}`),
      lastModified,
      changeFrequency: 'monthly',
      priority,
      ...(images ? { images } : {}),
    };
  });


  // Category routes
  const categoryDateMap = new Map();

  recipes.forEach((r) => {
    const date = new Date(r.updatedAt || r.publishedAt || new Date());

    if (r.category) {
      const existing = categoryDateMap.get(r.category);
      if (!existing || date > existing) categoryDateMap.set(r.category, date);
    }

    if (Array.isArray(r.tags)) {
      r.tags.forEach((tag) => {
        const cat = categories.find(
          (c) => c.subcategories && c.subcategories.includes(tag)
        );
        if (cat) {
          const existing = categoryDateMap.get(cat.name);
          if (!existing || date > existing) categoryDateMap.set(cat.name, date);
        }
      });
    }
  });

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: normalizeUrl(baseUrl, `/kategorier/${category.slug}`),
    lastModified: categoryDateMap.get(category.name) || new Date('2024-01-01'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...recipeRoutes, ...categoryRoutes];
}
