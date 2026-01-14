'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';

/**
 * Variants Section - Shows recipes from recipe MDX files
 * Displays horizontal blog-like cards with full recipe information
 */
export default function VariantsSection({ recipes = [], pillarTitle = '', pillarDescription = '' }) {
  const [showAll, setShowAll] = useState(false);
  
  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Show initial 6 recipes, then all when "See More" is clicked
  const initialCount = 6;
  const displayedRecipes = showAll ? recipes : recipes.slice(0, initialCount);
  const hasMore = recipes.length > initialCount;

  // Get recipe image URL
  const getRecipeImage = (recipe) => {
    if (recipe?.image?.src) return recipe.image.src;
    if (typeof recipe?.image === 'string') return recipe.image;
    return "https://images.unsplash.com/photo-1527904324834-3cc0e1e045fe?w=800&h=600&fit=crop";
  };

  // Get recipe name
  const getRecipeName = (recipe) => {
    return recipe?.recipeName || recipe?.title || 'Rezept';
  };

  // Get recipe slug
  const getRecipeSlug = (recipe) => {
    return recipe?.slug || '#';
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Beliebte Variationen
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Entdecke unsere beliebtesten Rezepte
          </p>
        </div>

        {/* Recipes List - Blog-like horizontal cards */}
        <div className="space-y-6">
          {displayedRecipes.map((recipe, index) => {
            const recipeSlug = getRecipeSlug(recipe);
            const recipeName = getRecipeName(recipe);
            const recipeImage = getRecipeImage(recipe);
            const recipeTitle = recipe?.pillarTitle || recipe?.title || recipeName;
            const recipeDescription = recipe?.pillarDescription || recipe?.description || recipe?.excerpt || '';
            const totalTime = recipe?.totalTimeMinutes || recipe?.cookTimeMinutes || 0;
            const servings = recipe?.servings || 0;
            const rating = recipe?.ratingAverage || 0;

            return (
              <div key={recipeSlug || index} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-b-0 last:pb-0">
                <Link
                  href={`/${recipeSlug}`}
                  className="group block"
                >
                  <article className="flex flex-col md:flex-row gap-4 md:gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl p-4 md:p-6 transition-all duration-300">
                    {/* Image */}
                    <div className="relative w-full md:w-64 h-48 md:h-64 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={recipeImage}
                        alt={recipeTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Rating badge */}
                      {rating > 0 && (
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* Title & Name */}
                      <div className="mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {recipeTitle}
                        </h3>
                        {recipeName !== recipeTitle && (
                          <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                            {recipeName}
                          </p>
                        )}
                      </div>

                      {/* Description - Full text displayed */}
                      {recipeDescription && (
                        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-4">
                          {recipeDescription}
                        </p>
                      )}

                      {/* Recipe Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        {totalTime > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{totalTime} Min</span>
                          </div>
                        )}
                        {servings > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{servings} Portionen</span>
                          </div>
                        )}
                        {recipe?.difficulty && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                              {recipe.difficulty}
                            </span>
                          </div>
                        )}

                        {/* CTA */}
                        <div className="ml-auto flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Rezept ansehen</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>

        {/* See More Button */}
        {hasMore && !showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Weitere {recipes.length - initialCount} Rezepte anzeigen
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {showAll && hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-full transition-all duration-300"
            >
              Weniger anzeigen
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
