'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';

/**
 * Variations Grid - Carousel with arrows on large screens
 * Displays recipes matching the filterTag in a horizontal carousel
 */
export default function VariationsGrid({ variations = [], title = "Alle Pfannkuchen-Variationen" }) {
  const carouselRef = useRef(null);

  if (!variations || variations.length === 0) {
    return null;
  }

  // Carousel scroll functions
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Card width (320px) + gap (20px)
      const currentScroll = carouselRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Entdecke alle Variationen
          </p>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative">
          {/* Left Arrow - Only visible on large screens */}
          <button
            onClick={() => scrollCarousel('left')}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Nach links scrollen"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow - Only visible on large screens */}
          <button
            onClick={() => scrollCarousel('right')}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Nach rechts scrollen"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontal Scrollable Carousel */}
          <div 
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-4 lg:px-16"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-4 md:gap-6">
              {variations.map((recipe, index) => (
                <div key={recipe.slug || index} className="flex-shrink-0 snap-start w-[280px] md:w-[320px]">
                  <RecipeCard 
                    recipe={recipe} 
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

