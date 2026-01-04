'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Clock, Users, Star, ArrowRight, Flame } from 'lucide-react';

export default function PopularThisWeek({ recipes }) {
  // Get top rated recipes
  const popularRecipes = recipes
    ? recipes
        .filter(r => r.ratingAverage)
        .sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
        .slice(0, 7)
    : [];

  if (popularRecipes.length === 0) return null;

  const [featured, ...rest] = popularRecipes;

  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16 xl:px-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 dark:bg-orange-900 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200 dark:bg-rose-900 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <span className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-orange-200 dark:border-orange-900">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Populärt just nu</span>
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-gray-900 via-orange-800 to-rose-900 dark:from-white dark:via-orange-200 dark:to-rose-200 bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Populärt den här veckan
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            De sötsaker som får hela Sverige att vattnas i munnen
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
          {/* Featured Large Card - Left Side */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <Link
                href={`/recept/${featured.slug}`}
                className="group block relative h-[500px] lg:h-[700px] overflow-hidden"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  {featured.image?.src ? (
                    <img
                      src={featured.image.src}
                      alt={featured.image.alt || featured.title}
                      width="1200"
                      height="900"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500"></div>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Trending Badge */}
                <div className="absolute top-6 left-6">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-gray-900">#1 Trending</span>
                  </span>
                </div>

                {/* Rating Badge */}
                {featured.ratingAverage && (
                  <div className="absolute top-6 right-6">
                    <span className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white">
                      <Star className="w-4 h-4 fill-white" />
                      <span className="text-sm font-bold">{featured.ratingAverage}</span>
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                  <div className="flex items-center gap-4 mb-4 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featured.totalTimeMinutes || 30} min</span>
                    </div>
                    {featured.servings && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{featured.servings} portioner</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                    {featured.title}
                  </h3>
                  
                  <p className="text-white/90 text-base lg:text-lg mb-6 line-clamp-2 max-w-2xl">
                    {featured.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                    <span>Läs recept</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Right Side - Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* Top Two Medium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {rest.slice(0, 2).map((recipe, index) => (
                <motion.div
                  key={`${recipe.slug}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Link
                    href={`/recept/${recipe.slug}`}
                    className="group block relative h-[320px] overflow-hidden"
                  >
                    <div className="absolute inset-0">
                      {recipe.image?.src ? (
                        <img
                          src={recipe.image.src}
                          alt={recipe.image.alt || recipe.recipeName || recipe.title}
                          width="400"
                          height="300"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                          data-related-recipe="true"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500"></div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Ranking Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center justify-center w-10 h-10 bg-white/95 backdrop-blur-md">
                        <span className="text-sm font-bold text-orange-500">#{index + 2}</span>
                      </span>
                    </div>

                    {/* Rating */}
                    {recipe.ratingAverage && (
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-md">
                          <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                          <span className="text-xs font-bold text-gray-900">{recipe.ratingAverage}</span>
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-200 transition-colors">
                        {recipe.recipeName || recipe.title}
                      </h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.totalTimeMinutes || 30} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid - Small Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {rest.slice(2, 6).map((recipe, index) => (
            <Link
              key={`${recipe.slug}-${index}`}
              href={`/recept/${recipe.slug}`}
              className="group block"
            >
              <div className="relative h-[200px] md:h-[240px] overflow-hidden mb-4">
                {recipe.image?.src ? (
                  <img
                    src={recipe.image.src}
                    alt={recipe.image.alt || recipe.title}
                    width="400"
                    height="300"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    data-related-recipe="true"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-rose-400"></div>
                )}

                {/* Ranking */}
                <div className="absolute top-3 left-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-white/95 backdrop-blur-md">
                    <span className="text-xs font-bold text-orange-500">#{index + 4}</span>
                  </span>
                </div>

                {/* Rating */}
                {recipe.ratingAverage && (
                  <div className="absolute bottom-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-md">
                      <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                      <span className="text-xs font-bold text-gray-900">{recipe.ratingAverage}</span>
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {recipe.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{recipe.totalTimeMinutes || 30} min</span>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            href="/recept"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300"
          >
            Utforska alla recept
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}