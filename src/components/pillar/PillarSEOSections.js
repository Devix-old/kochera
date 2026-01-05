import Link from 'next/link';
import { BookOpen, Share2, TrendingUp } from 'lucide-react';
import ShareButton from '@/components/recipe/ShareButton';
import { normalizeUrl } from '@/lib/utils/url';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

/**
 * Social sharing section for pillar pages
 */
export function PillarSocialSection({ pillar }) {
  const {
    title,
    excerpt,
    slug
  } = pillar;

  return (
    <section className="py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Share this guide:
            </span>
          </div>
          <ShareButton
            title={title}
            excerpt={excerpt}
            url={normalizeUrl(SITE_URL, `/${slug}`)}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Related pillars section
 */
export function RelatedPillarsSection({ relatedPillars = [] }) {
  if (!relatedPillars || relatedPillars.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Related Guides
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Continue learning with these related guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={`/${pillar.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {pillar.image?.src && (
                <div className="aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={pillar.image.src}
                    alt={pillar.image.alt || pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="p-6">
                {pillar.pillarTopic && (
                  <div className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    {pillar.pillarTopic}
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {pillar.title}
                </h3>
                
                {pillar.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {pillar.excerpt}
                  </p>
                )}
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Read guide →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
