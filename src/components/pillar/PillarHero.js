'use client';

import { BookOpen, Clock, TrendingUp } from 'lucide-react';

/**
 * Hero section for pillar pages
 * Different design from recipe pages - more informational/guide-focused
 */
export default function PillarHero({ pillar }) {
  const {
    title,
    excerpt,
    image,
    publishedAt,
    updatedAt,
    pillarTopic,
    readTime
  } = pillar;

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-900 py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {pillarTopic && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
                <BookOpen className="w-4 h-4" />
                {pillarTopic}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {title}
            </h1>
            
            {excerpt && (
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {excerpt}
              </p>
            )}

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400">
              {publishedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Published {new Date(publishedAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              {readTime && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{readTime} min read</span>
                </div>
              )}

              {updatedAt && updatedAt !== publishedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    Updated {new Date(updatedAt).toLocaleDateString('de-DE', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Image */}
          {image?.src && (
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/50">
                <img
                  src={image.src}
                  alt={image.alt || title}
                  width="800"
                  height="600"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
