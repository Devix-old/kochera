import Link from 'next/link';
import { Clock, Users, Star, ArrowRight, ChefHat, Utensils, Calendar } from 'lucide-react';
import { formatYieldLabel } from '@/lib/utils/yield';

/**
 * Smart Internal Links Component
 * Displays contextually relevant internal links for SEO
 */
export default function SmartInternalLinks({ links, currentRecipe }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <ArrowRight className="w-6 h-6 mr-3 text-purple-600" />
          Du kanske också gillar
        </h2>
        
        <div className="space-y-8">
          {links.map((linkGroup, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                {getLinkGroupIcon(linkGroup.type)}
                <span className="ml-2">{linkGroup.title}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {linkGroup.links.map((recipe) => {
                  const yieldLabel = formatYieldLabel(recipe.yield, recipe.servings);
                  return (
                  <Link
                    key={recipe.slug}
                    href={`/${recipe.slug}`}
                    className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start space-x-3">
                      {recipe.image?.src && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={recipe.image.src}
                            alt={recipe.image.alt || recipe.recipeName || recipe.title}
                            width="64"
                            height="64"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {recipe.recipeName || recipe.title}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{recipe.totalTimeMinutes} min</span>
                          </div>
                          {yieldLabel && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{yieldLabel}</span>
                            </div>
                          )}
                          {recipe.ratingAverage && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              <span>{recipe.ratingAverage}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Show relevance reason */}
                        {getRelevanceReason(recipe, linkGroup.type)}
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Get icon for link group type
 */
function getLinkGroupIcon(type) {
  const icons = {
    related: <ChefHat className="w-5 h-5 text-purple-600" />,
    ingredients: <Utensils className="w-5 h-5 text-green-600" />,
    techniques: <ChefHat className="w-5 h-5 text-blue-600" />,
    seasonal: <Calendar className="w-5 h-5 text-orange-600" />
  };
  
  return icons[type] || <ChefHat className="w-5 h-5 text-purple-600" />;
}

/**
 * Get relevance reason for link
 */
function getRelevanceReason(recipe, type) {
  switch (type) {
    case 'related':
      return (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Liknande kategori och taggar
        </div>
      );
    case 'ingredients':
      return (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {recipe.commonIngredients?.length > 0 && (
            <span>Delar ingredienser: {recipe.commonIngredients.slice(0, 2).join(', ')}</span>
          )}
        </div>
      );
    case 'techniques':
      return (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {recipe.commonTechniques?.length > 0 && (
            <span>Samma teknik: {recipe.commonTechniques.slice(0, 2).join(', ')}</span>
          )}
        </div>
      );
    case 'seasonal':
      return (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {recipe.commonSeasonal?.length > 0 && (
            <span>Säsong: {recipe.commonSeasonal.join(', ')}</span>
          )}
        </div>
      );
    default:
      return null;
  }
}

/**
 * Category Navigation Component
 */
export function CategoryNavigation({ categories, currentCategory }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Weitere Kategorien entdecken
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`p-4 rounded-lg text-center transition-all duration-300 ${
                currentCategory === category.slug
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Trending Recipes Component
 */
export function TrendingRecipes({ recipes, title = "Populära recept just nu" }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 mb-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-orange-600" />
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 6).map((recipe) => (
            (() => {
              const yieldLabel = formatYieldLabel(recipe.yield, recipe.servings);
              return (
            <Link
              key={recipe.slug}
              href={`/${recipe.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              {recipe.image?.src && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image.src}
                    alt={recipe.image.alt || recipe.title}
                    width="400"
                    height="300"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    data-related-recipe="true"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Trendande
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{recipe.totalTimeMinutes} min</span>
                  </div>
                  {yieldLabel && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{yieldLabel}</span>
                    </div>
                  )}
                  {recipe.ratingAverage && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>{recipe.ratingAverage}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            );
            })()
          ))}
        </div>
      </div>
    </section>
  );
}
