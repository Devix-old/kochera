'use client';

import Link from 'next/link';
import { Clock, Users, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import Rating from '../ui/Rating';
import Tag from '../ui/Tag';
import { cn } from '@/lib/utils/cn';

export default function RecipeCard({ recipe, index = 0, className }) {
  const difficultyLabels = {
    'Lätt': 'Lätt',
    'Medel': 'Medel',
    'Avancerad': 'Avancerad',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-1',
        className
      )}
    >
      <Link href={`/${recipe.slug}`} className="block">
      <div className="recipe-card relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        {recipe.image?.src ? (
          <img
            src={recipe.image.src}
            alt={recipe.image.alt || recipe.recipeName || recipe.title}
            width="400"
            height="300"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            data-related-recipe="true"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-400" />
          </div>
        )}
        </div>

        <div className="pt-2">
          <h3
            className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2"
            style={{ 
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}
          >
            {recipe.recipeName || recipe.title}
          </h3>

          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{recipe.totalTimeMinutes || recipe.cookTimeMinutes || 30} min</span>
            </div>
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 md:w-4 md:h-4" />
                <span>{recipe.servings} port</span>
              </div>
            )}
            {recipe.difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                recipe.difficulty === 'Lätt' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : recipe.difficulty === 'Medel'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {difficultyLabels[recipe.difficulty]}
              </span>
            )}
          </div>

          {recipe.ratingAverage > 0 && (
            <Rating
              rating={recipe.ratingAverage}
              count={recipe.ratingCount}
              size="sm"
            />
          )}

        </div>
      </Link>
    </motion.article>
  );
}

