import { notFound } from 'next/navigation';

/**
 * No UI route: avoid soft-404 rewrites. Crawl /seo-optiz → real 404.
 * Dev tooling uses /api/seo-optiz/* only.
 */
export default function SeoOptizCatchAll() {
  notFound();
}
