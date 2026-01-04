'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

export default function BlogPreview({ articles }) {
  // If no articles exist, show placeholder content
  const displayArticles = articles && articles.length > 0 ? articles.slice(0, 3) : [
    {
      slug: 'guide-1',
      title: 'Perfekta pastatempot: Guide till al dente',
      excerpt: 'Lär dig konsten att koka pasta perfekt varje gång. Tips från proffsen som gör skillnad.',
      image: { src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', alt: 'Pasta' },
      category: 'Köksguider',
      readingMinutes: 5,
      publishedAt: '2024-01-15',
    },
    {
      slug: 'guide-2',
      title: 'Smaksätt som en kock: Kryddguiden',
      excerpt: 'Upptäck hur du kombinerar kryddor och örter för maximal smak. Grundläggande tekniker varje matälskare bör kunna.',
      image: { src: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80', alt: 'Kryddor' },
      category: 'Tips & Tricks',
      readingMinutes: 7,
      publishedAt: '2024-01-12',
    },
    {
      slug: 'guide-3',
      title: 'Säsongsinköp: December i köket',
      excerpt: 'Vilka råvaror du bör satsa på just nu. Få ut det bästa av säsongens ingredienser.',
      image: { src: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80', alt: 'Grönsaker' },
      category: 'Råvaror',
      readingMinutes: 4,
      publishedAt: '2024-01-10',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#6FCF97]/10 text-[#6FCF97] rounded-full text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              Från bloggen
            </span>
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Senaste från bloggen
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tips, guider och inspiration för ett roligare köksliv
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={articles && articles.length > 0 ? `/blogg/${article.slug}` : '#'}
                className="group block h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {article.image?.src ? (
                    <img
                      src={article.image.src}
                      alt={article.image.alt || article.title}
                      width="400"
                      height="250"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6FCF97] to-[#A8E6CF]">
                      <span className="text-white text-4xl">📝</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-lg">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#6FCF97] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readingMinutes || 5} min läsning</span>
                    </div>
                    <span className="flex items-center gap-1 text-[#6FCF97] font-medium group-hover:gap-2 transition-all">
                      Läs mer
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {articles && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/blogg"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6FCF97] to-[#A8E6CF] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Utforska alla artiklar
              <BookOpen className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

