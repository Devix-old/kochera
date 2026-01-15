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
    'Vegetarisch': 'Grüne, bunte und sättigende vegetarische Gerichte, die alle lieben. Von schnellen Alltagsgerichten bis zu festlichen Salaten.',
    'Alltagsessen': 'Einfache und schnelle Rezepte für den Alltag. Perfekt, wenn es schnell gehen soll, aber trotzdem lecker sein muss!',
    'Backen': 'Duftende Brötchen, saftige Kuchen und knuspriges Brot. Alles, was Sie für die perfekte Kaffeepause brauchen.',
    'Pasta': 'Von klassischer Carbonara bis zu cremigen Saucen. Entdecken Sie alle Möglichkeiten der Pastawelt.',
    'Grillen': 'Die besten Grillrezepte für den Sommer. Marinaden, Spieße und alles, was nach Sommer schmeckt.',
    'Desserts': 'Süße Abschlüsse, die beeindrucken. Von einfachen Nachspeisen bis zu aufwendigen Backwaren.',
    'Eintöpfe & Suppen': 'Wärmende und sättigende Suppen und Eintöpfe für alle Jahreszeiten. Comfort Food vom Feinsten.',
    'Suppen': 'Wärmende und sättigende Suppen für alle Jahreszeiten. Comfort Food vom Feinsten.',
    'Salate': 'Frische und bunte Salate, die satt machen. Perfekt für Mittagessen oder als Beilage.',
    'Hähnchen': 'Vielseitige Hähnchengerichte aus aller Welt. Alles von gegrillt bis langsam gegart.',
    'Fisch & Meeresfrüchte': 'Die Köstlichkeiten des Meeres auf beste Weise zubereitet. Einfache Rezepte, die den Fisch hervorheben.',
    'Fisch': 'Die Köstlichkeiten des Meeres auf beste Weise zubereitet. Einfache Rezepte, die den Fisch hervorheben.',
    'Schnelles Abendessen': 'Fertig in unter 30 Minuten! Wenn die Zeit knapp ist, aber Sie richtig gutes Essen wollen.',
    'Glutenfrei': 'Glutenfreie Köstlichkeiten, die jeder genießen kann. Kein Kompromiss beim Geschmack!',
    'Fleisch': 'Saftige und würzige Fleischgerichte für jeden Anlass. Von schnellen Abendessen bis zu langsam gegart.',
    'Herbstfavoriten': 'Warme und gemütliche Gerichte für den Herbst. Comfort Food, das Körper und Seele wärmt.',
    'Frühstück': 'Starten Sie den Tag richtig mit nahrhaften und leckeren Frühstücksgerichten.',
    'Beilagen': 'Perfekte Beilagen, die das Hauptgericht ergänzen.',
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
              Alle Rezepte
            </h1>
            <p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-inter"
            >
              Entdecke {recipes.length} getestete Rezepte für jeden Anlass
            </p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 mb-12 border border-gray-100 dark:border-gray-700 rounded-xl">
          <div className="mb-4">
            <SmartSearchBar
              recipes={recipes}
              onSearch={setSearchQuery}
              placeholder="Suche Rezepte, Zutaten oder Tags..."
              className="w-full"
            />
          </div>

          {/* Active filters */}
          {(searchQuery || Object.keys(filters).length > 0) && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktive Filter:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    Suche: &ldquo;{searchQuery}&rdquo;
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
                  Alle löschen
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
            Zeige <span className="font-bold text-purple-600">{filteredRecipes.length}</span> Rezepte
          </p>
        </div>

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
              Keine Rezepte gefunden
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Versuche deine Filter anzupassen oder suche nach etwas anderem
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-semibold transition-colors"
            >
              Alle Filter zurücksetzen
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
              Hast du nicht gefunden, wonach du gesucht hast?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Wir fügen jede Woche neue Rezepte hinzu. Abonniere unseren Newsletter, damit du nichts verpasst!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Zur Startseite
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

