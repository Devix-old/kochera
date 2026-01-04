'use client';

import Link from 'next/link';
import { Star, ChefHat } from 'lucide-react';
import { getAllCategories } from '@/lib/categories';
import HomePageSearchBar from '@/components/ui/HomePageSearchBar';

export default function EnhancedHomeClient({
  popularCategories,
  totalRecipes,
  featuredRecipes = [],
  allRecipes = [],
  articles = [],
  authors = []
}) {
  const allCategories = getAllCategories();

  // Story categories for the stories rail
  const STORY_CATEGORIES = [
    { name: 'Frühstück', slug: 'fruehstueck', image: '/images/categories/fruehstueck.webp', icon: '🌅' },
    { name: 'Pasta', slug: 'pasta', image: '/images/categories/pasta.webp', icon: '🍝' },
    { name: 'Vegan', slug: 'vegan', image: '/images/categories/vegan.webp', icon: '🌱' },
    { name: 'Kuchen', slug: 'kuchen', image: '/images/categories/kuchen.webp', icon: '🍰' },
    { name: 'Hähnchen', slug: 'haehnchen', image: '/images/categories/haehnchen.webp', icon: '🍗' },
    { name: 'Dessert', slug: 'dessert', image: '/images/categories/dessert.webp', icon: '🍨' },
    { name: 'Vegetarisch', slug: 'vegetarisch', image: '/images/categories/vegetarisch.webp', icon: '🥗' },
    { name: 'Schnell', slug: 'schnell', image: '/images/categories/schnell.webp', icon: '⚡' },
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

  return (
    <div className="min-h-screen bg-white">
      {/* SEARCH & STORIES HEADER */}
      <section className="w-full bg-white border-b border-gray-200 py-4">
        {/* SEARCH BAR */}
        <div className="px-4 pt-2 mb-4 pb-2">
          <HomePageSearchBar recipes={allRecipes} placeholder="Was kochst du heute?" />
        </div>

        {/* STORIES RAIL */}
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide snap-x snap-mandatory md:justify-center md:overflow-x-visible">
          {STORY_CATEGORIES.map((story) => (
            <Link
              key={story.slug}
              href={`/${story.slug}`}
              className="flex-shrink-0 snap-start flex flex-col items-center gap-2 min-w-[80px]"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 p-[2px] border-2 border-orange-400">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="w-full py-8 bg-white">
        <div className="px-4 mb-6">
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
              <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={getRecipeImage(recipe) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"}
                    alt={getRecipeName(recipe)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                {/* Text Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-2 min-h-[2.5rem]">
                    {getRecipeName(recipe)}
                  </h3>
                  {/* Star Rating */}
                  {renderStarRating(recipe?.ratingAverage)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="w-full py-8 bg-white">
        <div className="rounded-xl p-6 mx-4 my-8 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-purple-50">
          {/* Avatar */}
          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
              alt="Author"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Hi, ich bin [Name].
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Jedes Rezept wird von mir persönlich getestet und perfektioniert.
            </p>
            <Link
              href="/om"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-bold text-sm"
            >
              Mehr über mich →
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST RECIPES */}
      <section className="w-full py-8 bg-gray-50">
        <div className="px-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Neueste Rezepte
          </h2>
        </div>
        
        <div className="flex flex-col gap-6 px-4">
          {latestRecipes.map((recipe) => (
            <Link
              key={getRecipeSlug(recipe)}
              href={`/${getRecipeSlug(recipe)}`}
              className="group"
            >
              <div className="flex gap-4 bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow p-4 md:p-0">
                {/* Image - 30% width on larger screens */}
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={getRecipeImage(recipe) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"}
                    alt={getRecipeName(recipe)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                {/* Text Content - 70% width */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 line-clamp-2">
                    {getRecipeName(recipe)}
                  </h3>
                  {recipe?.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {recipe.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {recipe?.totalTimeMinutes && (
                      <span>{recipe.totalTimeMinutes} Min</span>
                    )}
                    {recipe?.ratingAverage && renderStarRating(recipe.ratingAverage)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="px-4 mt-8 text-center">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Alle Rezepte ansehen
          </Link>
        </div>
      </section>
    </div>
  );
}
