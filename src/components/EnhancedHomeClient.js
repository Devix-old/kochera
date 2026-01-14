'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { Star, ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllCategories } from '@/lib/categories';
import HomePageSearchBar from '@/components/ui/HomePageSearchBar';

export default function EnhancedHomeClient({
  popularCategories,
  totalRecipes,
  featuredRecipes = [],
  allRecipes = [],
  authors = []
}) {
  const allCategories = getAllCategories();
  const carouselRef = useRef(null);

  // Story categories for the stories rail
  const STORY_CATEGORIES = [
    { name: 'Pfannkuchen', slug: 'pfannkuchen', image: '/images/kategorien/pfannkuchen.webp', icon: '🥞' },
    { name: 'Waffeln', slug: 'waffeln', image: '/images/kategorien/waffeln.webp', icon: '🧇' },
    { name: 'Kuchen', slug: 'kuchen', image: '/images/kategorien/kuchen-marmorkuchen.webp', icon: '🍰' },
    { name: 'Lasagne', slug: 'lasagne', image: '/images/kategorien/lasagne.webp', icon: '🍝' },
    { name: 'Airfryer', slug: 'airfryer', image: '/images/kategorien/airfryer-kartoffeln.webp', icon: '💨' },
    { name: 'Schnell', slug: 'schnell', image: '/images/kategorien/schnelles-abendessen-quesadilla.webp', icon: '⚡' },
    { name: 'Gesund', slug: 'gesund', image: '/images/kategorien/gesunde-fruhstucks-bowl.webp', icon: '🥗' },
    { name: 'Vegetarisch', slug: 'vegetarisch', image: '/images/kategorien/vegetarisches-ofengericht.webp', icon: '🌱' },
  ];

  // Get trending recipes (can use featured recipes or slice of all recipes)
  const trendingRecipes = featuredRecipes.length >= 4 
    ? featuredRecipes.slice(0, 8) 
    : allRecipes.slice(0, 8);

  // Get latest recipes (most recent, limit to 6)
  const latestRecipes = [...allRecipes]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 6);

  // Helper function to get recipe image URL
  const getRecipeImage = (recipe) => {
    if (recipe?.image?.src) return recipe.image.src;
    if (typeof recipe?.image === 'string') return recipe.image;
    return '/images/placeholder-recipe.webp'; // Fallback placeholder
  };

  // Helper function to get recipe title
  const getRecipeName = (recipe) => {
    return recipe?.recipeName || recipe?.title || 'Rezept';
  };

  // Helper function to get recipe slug
  const getRecipeSlug = (recipe) => {
    return recipe?.slug || '#';
  };

  // Helper function to render star rating
  const renderStarRating = (rating = 0) => {
    const stars = Math.round(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= stars
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

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
    <div className="min-h-screen bg-white">
      {/* SEARCH & STORIES HEADER */}
      <section className="w-full bg-white border-b border-gray-200 py-4">
        {/* SEARCH BAR */}
        <div className="px-4 pt-2 mb-4 pb-2">
          <HomePageSearchBar recipes={allRecipes} placeholder="Was kochst du heute?" />
        </div>

        {/* STORIES RAIL - Bigger Circles */}
        <div className="flex overflow-x-auto gap-5 md:gap-6 px-4 pb-4 scrollbar-hide snap-x snap-mandatory md:justify-center md:overflow-x-visible">
          {STORY_CATEGORIES.map((story) => (
            <Link
              key={story.slug}
              href={`/${story.slug}`}
              className="flex-shrink-0 snap-start flex flex-col items-center gap-3 min-w-[110px] md:min-w-[120px]"
            >
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="w-full py-8 bg-white">
        <div className="px-4 mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Beliebt diese Woche
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {trendingRecipes.map((recipe) => (
            <Link
              key={getRecipeSlug(recipe)}
              href={`/${getRecipeSlug(recipe)}`}
              className="group"
            >
              <div className="flex flex-col gap-3 bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                {/* Image */}
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                  <img
                    src={getRecipeImage(recipe) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=267&fit=crop"}
                    alt={getRecipeName(recipe)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    width="320"
                    height="213"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Text Content */}
                <div className="p-1 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {getRecipeName(recipe)}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    {recipe?.totalTimeMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.totalTimeMinutes} Min
                      </span>
                    )}
                    {recipe?.ratingAverage && renderStarRating(recipe.ratingAverage)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DIN MATKREATÖR section */}    
      <section className="w-full py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-orange-50 border border-gray-100 shadow-lg flex flex-col md:flex-row">
            
            {/* Image Section - Left on desktop, top on mobile */}
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img
                src="/images/din-matkreator-kochera-in-kitchen.webp"
                alt="Kochera in der Küche"
                className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                loading="lazy"
              />
            </div>

            {/* Text Content Section - Right on desktop, bottom on mobile */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-purple-600 rounded-full w-fit">
                Din Matkreatör
              </span>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Hallo! Ich bin <span className="text-purple-600">Kochera</span>.
              </h3>
              
              <div className="space-y-3 text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                <p>
                  Willkommen in meiner Küche! Ich habe diese Seite gegründet, um meine Leidenschaft für Kochen und Backen mit dir zu teilen.
                </p>
                <p className="hidden md:block">
                  Ich glaube an Qualität vor Quantität. Daher ist jedes Rezept, das du hier findest, sorgfältig getestet, verkostet und perfektioniert, um sicherzustellen, dass du jedes Mal erfolgreich bist.
                </p>
              </div>

              <Link
                href="/om"
                className="group inline-flex items-center justify-center md:justify-start gap-2 bg-purple-600 text-white font-bold px-5 py-3 rounded-lg border-2 border-black shadow-md hover:bg-purple-700 transition-all duration-200 w-fit"
              >
                <span>Mehr über unsere Reise erfahren</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* LATEST RECIPES - Carousel */}
      <section className="w-full py-8 bg-gray-50 relative">
        <div className="px-4 mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1 text-center">
            Neueste Rezepte
          </h2>
          <Link
            href="/rezepte"
            className="text-sm md:text-base text-purple-600 hover:text-purple-700 font-semibold hidden md:inline-flex items-center gap-1"
          >
            Alle ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Carousel Container with Arrows */}
        <div className="relative">
          {/* Left Arrow - Only visible on large screens */}
          <button
            onClick={() => scrollCarousel('left')}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-purple-600"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow - Only visible on large screens */}
          <button
            onClick={() => scrollCarousel('right')}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-purple-600"
            aria-label="Scroll right"
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
            {latestRecipes.map((recipe) => (
              <Link
                key={getRecipeSlug(recipe)}
                href={`/${getRecipeSlug(recipe)}`}
                className="group flex-shrink-0 snap-start w-[280px] md:w-[320px]"
              >
                <div className="flex flex-col gap-3 bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  {/* Image */}
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                    <img
                      src={getRecipeImage(recipe) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=267&fit=crop"}
                      alt={getRecipeName(recipe)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      width="320"
                      height="213"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {getRecipeName(recipe)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      {recipe?.totalTimeMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recipe.totalTimeMinutes} Min
                        </span>
                      )}
                      {recipe?.ratingAverage && renderStarRating(recipe.ratingAverage)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>

        {/* View All Link - Mobile */}
        <div className="px-4 mt-6 text-center md:hidden">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Alle Rezepte ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
