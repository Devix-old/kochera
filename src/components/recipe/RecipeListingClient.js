'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/recipe/RecipeCard';
import SmartSearchBar from '@/components/ui/SmartSearchBar';
import Pagination from '@/components/ui/Pagination';
import CategoryHero from '@/components/ui/CategoryHero';
import Tag from '@/components/ui/Tag';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { filterRecipes, sortRecipes, getUniqueFilterValues } from '@/lib/utils/search';
import { smartSearch } from '@/lib/utils/smartSearch';
import LeaderboardAd from '@/components/ads/LeaderboardAd';

export default function RecipeListingClient({ initialRecipes, categoryName = null, showHero = false }) {
  const searchParams = useSearchParams();
  // De-duplicate any incoming recipes by slug to prevent React key collisions
  const [recipes] = useState(() => {
    const seen = new Set();
    return (initialRecipes || []).filter(r => {
      if (!r?.slug) return false;
      if (seen.has(r.slug)) return false;
      seen.add(r.slug);
      return true;
    });
  });
  const [filteredRecipes, setFilteredRecipes] = useState(initialRecipes);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  // Category descriptions
  const categoryDescriptions = {
    'Vegetariskt': 'Gröna, färgglada och mättande vegetariska rätter som alla älskar. Från snabba vardagsmiddagar till festliga sallader.',
    'Vardagsmat': 'Enkla och snabba recept för vardagens middagar. Perfekt när det ska gå fort men ändå vara gott!',
    'Bakning': 'Doftande bullar, saftiga kakor och krispigt bröd. Allt du behöver för den perfekta fikastunden.',
    'Pasta': 'Från klassisk carbonara till krämiga såser. Upptäck pastavärldens alla möjligheter.',
    'Grillmat': 'Sommarens bästa recept för grillen. Marinader, spett och allt som smakar sommar.',
    'Desserter': 'Söta avslutningar som imponerar. Från enkla efterrätter till avancerade bakverk.',
    'Grytor & Soppor': 'Värmande och mättande soppor och grytor för alla årstider. Comfort food när den är som bäst.',
    'Soppor': 'Värmande och mättande soppor för alla årstider. Comfort food när den är som bäst.',
    'Sallader': 'Fräscha och färgglada sallader som mättar. Perfekt för lunch eller som tillbehör.',
    'Kyckling': 'Mångsidiga kycklingrätter från hela världen. Allt från grillat till långkokt.',
    'Fisk & Skaldjur': 'Havets läckerheter tillagade på bästa sätt. Enkla recept som lyfter fisken.',
    'Fisk': 'Havets läckerheter tillagade på bästa sätt. Enkla recept som lyfter fisken.',
    'Snabb middag': 'Klart på under 30 minuter! När tiden är knapp men du vill ha riktigt god mat.',
    'Glutenfritt': 'Glutenfria godsaker som alla kan njuta av. Ingen kompromiss med smaken!',
    'Kött': 'Saftiga och smakrika kötträtter för alla tillfällen. Från snabba middagar till långkok.',
    'Höstens favoriter': 'Varma och mysiga rätter för hösten. Comfort food som värmer både kropp och själ.',
    'Frukost': 'Starta dagen rätt med näringsrika och goda frukosträtter.',
    'Tillbehör': 'Perfekta tillbehör som kompletterar huvudrätten.',
  };

  // Handle URL search params
  useEffect(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (q) setSearchQuery(q);
    if (category) setFilters(prev => ({ ...prev, category }));
    if (tag) setFilters(prev => ({ ...prev, tags: [tag] }));
  }, [searchParams]);

  // Apply filters and search
  useEffect(() => {
    let result = [...recipes];

    // Apply smart search
    if (searchQuery) {
      const searchResults = smartSearch(result, searchQuery);
      result = searchResults.map(r => {
        // Remove relevanceScore before passing to filters
        const { relevanceScore, ...recipe } = r;
        return recipe;
      });
    }

    // Apply filters
    result = filterRecipes(result, filters);

    // Apply sorting
    result = sortRecipes(result, sortBy);

    setFilteredRecipes(result);
    setCurrentPage(1);
  }, [recipes, filters, searchQuery, sortBy]);

  const categories = getUniqueFilterValues(recipes, 'category');
  const tags = getUniqueFilterValues(recipes, 'tags');

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  // Get current category from URL or filters
  const currentCategory = categoryName || filters.category || searchParams.get('tag') || searchParams.get('category');
  const categoryDescription = currentCategory ? categoryDescriptions[currentCategory] : null;

  // Get popular tags for suggestions
  const allTags = getUniqueFilterValues(recipes, 'tags').slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Category Hero - Only show if we have a specific category and showHero is true */}
      {currentCategory && showHero && (
        <CategoryHero
          category={currentCategory}
          description={categoryDescription}
          recipeCount={filteredRecipes.length}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-20 xl:px-24  py-20 md:py-24">
        {/* Header - Only show if no category hero */}
        {!currentCategory && (
          <div className="mb-12 text-center">
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white font-playfair"
            >
              Alla recept
            </h1>
            <p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-inter"
            >
              Utforska {recipes.length} provlagade recept för alla tillfällen
            </p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 mb-12 border border-gray-100 dark:border-gray-700 rounded-xl">
          <div className="mb-4">
            <SmartSearchBar
              recipes={recipes}
              onSearch={setSearchQuery}
              placeholder="Sök recept, ingredienser eller taggar..."
              className="w-full"
            />
          </div>

          {/* Active filters */}
          {(searchQuery || Object.keys(filters).length > 0) && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktiva filter:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    Sökning: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {filters.category}
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                  }}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  Rensa alla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p 
            className="text-gray-600 dark:text-gray-400 font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Visar <span className="font-bold text-purple-600">{filteredRecipes.length}</span> recept
          </p>
        </div>

        {/* Leaderboard Ad */}
        <LeaderboardAd />

        {/* Recipe Grid */}
        {paginatedRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-4 md:gap-y-8 mb-16">
              {paginatedRecipes.map((recipe, index) => (
                <RecipeCard 
                  key={`${recipe.slug}-${index}`} 
                  recipe={recipe} 
                  index={index} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 
              className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Inga recept hittades
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Prova att justera dina filter eller sök efter något annat
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-semibold transition-colors"
            >
              Återställ alla filter
            </button>
          </div>
        )}


        {/* CTA Section - After everything */}
        <div className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              Hittade du inte vad du sökte?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Vi lägger till nya recept varje vecka. Prenumerera på vårt nyhetsbrev så missar du inget!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Till startsidan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/blogg"
                className="inline-flex items-center px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Läs våra matguider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

