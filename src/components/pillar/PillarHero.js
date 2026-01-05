'use client';

import { BookOpen } from 'lucide-react';

/**
 * Semantic Hero section for pillar pages
 * Includes hero image and SEO-optimized introductory text (100-150 words)
 */
export default function PillarHero({ pillar, introductionText }) {
  const {
    title,
    image,
    pillarTopic
  } = pillar;

  return (
    <section className="relative bg-white dark:bg-gray-900 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        {image?.src && (
          <div className="relative w-full aspect-[21/9] md:aspect-[16/6] rounded-2xl overflow-hidden mb-8 shadow-xl">
            <img
              src={image.src}
              alt={image.alt || title}
              width="1400"
              height="600"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          {pillarTopic && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-300 mb-6">
              <BookOpen className="w-4 h-4" />
              {pillarTopic}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
        </div>

        {/* SEO Introduction Text (100-150 words) */}
        {introductionText && (
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              <div className="text-lg md:text-xl">
                {introductionText}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
